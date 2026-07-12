package com.example.ApproveIt.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.ApproveIt.dto.ExpenseRequest;
import com.example.ApproveIt.dto.ExpenseResponse;
import com.example.ApproveIt.entity.Category;
import com.example.ApproveIt.entity.Expense;
import com.example.ApproveIt.entity.ExpenseStatus;
import com.example.ApproveIt.entity.User;
import com.example.ApproveIt.repository.CategoryRepository;
import com.example.ApproveIt.repository.ExpenseRepository;
import com.example.ApproveIt.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ExpenseResponse submitExpense(String email, ExpenseRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setCategory(category);
        expense.setAmount(request.getAmount());
        expense.setCurrency(request.getCurrency());
        expense.setDescription(request.getDescription());
        expense.setReceiptUrl(request.getReceiptUrl());
        expense.setStatus(ExpenseStatus.PENDING);

        expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(expense);
    }

    public Page<ExpenseResponse> getMyExpenses(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return expenseRepository.findByUserId(user.getId(), pageable)
                .map(ExpenseResponse::fromEntity);
    }

    public ExpenseResponse updateExpense(String email, Long expenseId, ExpenseRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Expense expense = expenseRepository.findByIdAndUserId(expenseId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        if (expense.getStatus() != ExpenseStatus.PENDING) {
            throw new IllegalStateException("Only PENDING expenses can be edited");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        expense.setCategory(category);
        expense.setAmount(request.getAmount());
        expense.setCurrency(request.getCurrency());
        expense.setDescription(request.getDescription());
        expense.setReceiptUrl(request.getReceiptUrl());
        expense.setUpdatedAt(java.time.LocalDateTime.now());

        expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(expense);
    }

    public void cancelExpense(String email, Long expenseId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Expense expense = expenseRepository.findByIdAndUserId(expenseId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        if (expense.getStatus() != ExpenseStatus.PENDING) {
            throw new IllegalStateException("Only PENDING expenses can be cancelled");
        }

        expense.setStatus(ExpenseStatus.CANCELLED);
        expenseRepository.save(expense);
    }
    public Page<ExpenseResponse> getAllExpenses(Pageable pageable) {
    return expenseRepository.findAll(pageable)
            .map(ExpenseResponse::fromEntity);
}
}