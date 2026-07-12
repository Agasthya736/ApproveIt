package com.example.ApproveIt.dto;

import java.util.Set;
import java.util.stream.Collectors;

import com.example.ApproveIt.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String department;
    private Long managerId;
    private String managerName;
    private Set<String> roles;

    public static UserResponse fromEntity(User u) {
        return new UserResponse(
            u.getId(),
            u.getName(),
            u.getEmail(),
            u.getDepartment(),
            u.getManager() != null ? u.getManager().getId() : null,
            u.getManager() != null ? u.getManager().getName() : null,
            u.getRoles().stream().map(r -> r.getName()).collect(Collectors.toSet())
        );
    }
}