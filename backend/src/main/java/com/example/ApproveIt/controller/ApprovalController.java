package com.example.ApproveIt.controller;

import com.example.ApproveIt.dto.*;
import com.example.ApproveIt.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Page<ExpenseResponse>> pending(Authentication auth, Pageable pageable) {
        return ResponseEntity.ok(approvalService.getPendingForManager(auth.getName(), pageable));
    }

    @PostMapping("/{expenseId}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ExpenseResponse> approve(Authentication auth, @PathVariable Long expenseId,
                                                   @RequestBody(required = false) ApprovalRequest request) {
        ApprovalRequest req = request != null ? request : new ApprovalRequest();
        return ResponseEntity.ok(approvalService.approve(auth.getName(), expenseId, req));
    }

    @PostMapping("/{expenseId}/reject")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ExpenseResponse> reject(Authentication auth, @PathVariable Long expenseId,
                                                  @RequestBody ApprovalRequest request) {
        return ResponseEntity.ok(approvalService.reject(auth.getName(), expenseId, request));
    }
}