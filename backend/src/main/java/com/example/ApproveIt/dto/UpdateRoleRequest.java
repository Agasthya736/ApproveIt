package com.example.ApproveIt.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateRoleRequest {
    @NotBlank
    private String role; // EMPLOYEE, MANAGER, ADMIN
}