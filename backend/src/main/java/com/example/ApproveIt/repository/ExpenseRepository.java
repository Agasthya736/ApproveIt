package com.example.ApproveIt.repository;

import com.example.ApproveIt.entity.Expense;
import com.example.ApproveIt.entity.ExpenseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT e FROM Expense e JOIN FETCH e.user JOIN FETCH e.category WHERE e.user.id = :userId")
    List<Expense> findByUserIdWithDetails(@Param("userId") Long userId);

    Page<Expense> findByUserId(Long userId, Pageable pageable);

    Page<Expense> findByStatus(ExpenseStatus status, Pageable pageable);

    // pending expenses for a manager's direct reports
    @Query("SELECT e FROM Expense e JOIN FETCH e.user u WHERE u.manager.id = :managerId AND e.status = 'PENDING'")
    Page<Expense> findPendingByManagerId(@Param("managerId") Long managerId, Pageable pageable);

    Optional<Expense> findByIdAndUserId(Long id, Long userId);
}