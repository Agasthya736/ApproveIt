package com.example.ApproveIt.service;

import com.example.ApproveIt.dto.*;
import com.example.ApproveIt.entity.*;
import com.example.ApproveIt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final ApprovalActionRepository approvalActionRepository;

    public Page<ExpenseResponse> getPendingForManager(String managerEmail, Pageable pageable) {
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return expenseRepository.findPendingByManagerId(manager.getId(), pageable)
                .map(ExpenseResponse::fromEntity);
    }

    @Transactional
    public ExpenseResponse approve(String actorEmail, Long expenseId, ApprovalRequest request) {
        return processDecision(actorEmail, expenseId, ExpenseStatus.APPROVED, ActionType.APPROVED, request);
    }

    @Transactional
    public ExpenseResponse reject(String actorEmail, Long expenseId, ApprovalRequest request) {
        if (request.getComment() == null || request.getComment().isBlank()) {
            throw new IllegalArgumentException("A comment is required when rejecting an expense");
        }
        return processDecision(actorEmail, expenseId, ExpenseStatus.REJECTED, ActionType.REJECTED, request);
    }

    private ExpenseResponse processDecision(String actorEmail, Long expenseId, ExpenseStatus newStatus,
                                            ActionType actionType, ApprovalRequest request) {

        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        // idempotency check — blocks double-approve / double-reject
        if (expense.getStatus() != ExpenseStatus.PENDING) {
            throw new IllegalStateException("This expense has already been " + expense.getStatus());
        }

        // self-approval prevention
        if (expense.getUser().getId().equals(actor.getId())) {
            throw new IllegalStateException("You cannot approve or reject your own expense");
        }

        // hierarchy check: actor must be the submitter's manager (ADMIN bypasses this — checked via role at controller/@PreAuthorize)
        boolean isDirectManager = expense.getUser().getManager() != null
                && expense.getUser().getManager().getId().equals(actor.getId());
        boolean isAdmin = actor.getRoles().stream().anyMatch(r -> r.getName().equals("ADMIN"));

        if (!isDirectManager && !isAdmin) {
            throw new IllegalStateException("You are not authorized to act on this expense");
        }

        // @Version field on Expense handles optimistic locking automatically here —
        // if two requests race, the second save() throws OptimisticLockException
        expense.setStatus(newStatus);
        expense.setUpdatedAt(java.time.LocalDateTime.now());
        expenseRepository.save(expense);

        ApprovalAction action = new ApprovalAction();
        action.setExpense(expense);
        action.setActor(actor);
        action.setAction(actionType);
        action.setComment(request.getComment());
        approvalActionRepository.save(action);

        return ExpenseResponse.fromEntity(expense);
    }
}