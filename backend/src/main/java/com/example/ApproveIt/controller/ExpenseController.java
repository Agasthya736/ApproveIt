package com.example.ApproveIt.controller;

import com.example.ApproveIt.dto.*;
import com.example.ApproveIt.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> submit(Authentication auth, @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.submitExpense(auth.getName(), request));
    }

    @GetMapping("/me")
    public ResponseEntity<Page<ExpenseResponse>> myExpenses(Authentication auth, Pageable pageable) {
        return ResponseEntity.ok(expenseService.getMyExpenses(auth.getName(), pageable));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(Authentication auth, @PathVariable Long id,
                                                  @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(auth.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(Authentication auth, @PathVariable Long id) {
        expenseService.cancelExpense(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}