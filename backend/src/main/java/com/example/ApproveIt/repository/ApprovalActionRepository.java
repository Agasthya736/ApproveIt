package com.example.ApproveIt.repository;

import com.example.ApproveIt.entity.ApprovalAction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApprovalActionRepository extends JpaRepository<ApprovalAction, Long> {
    List<ApprovalAction> findByExpenseIdOrderByActedAtDesc(Long expenseId);
}