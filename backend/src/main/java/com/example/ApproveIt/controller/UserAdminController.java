package com.example.ApproveIt.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ApproveIt.dto.UpdateManagerRequest;
import com.example.ApproveIt.dto.UpdateRoleRequest;
import com.example.ApproveIt.dto.UserResponse;
import com.example.ApproveIt.service.UserAdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserAdminController {

    private final UserAdminService userAdminService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userAdminService.getAllUsers());
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponse> updateRole(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest request) {
        return ResponseEntity.ok(userAdminService.updateRole(id, request.getRole()));
    }

    @PatchMapping("/{id}/manager")
    public ResponseEntity<UserResponse> updateManager(@PathVariable Long id, @RequestBody UpdateManagerRequest request) {
        return ResponseEntity.ok(userAdminService.updateManager(id, request.getManagerId()));
    }
}