package com.example.ApproveIt.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.ApproveIt.dto.UserResponse;
import com.example.ApproveIt.entity.Role;
import com.example.ApproveIt.entity.User;
import com.example.ApproveIt.repository.RoleRepository;
import com.example.ApproveIt.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public UserResponse updateRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Role role = roleRepository.findByName(roleName.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid role: " + roleName));

        user.setRoles(Set.of(role));
        userRepository.save(user);
        return UserResponse.fromEntity(user);
    }

    public UserResponse updateManager(Long userId, Long managerId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (managerId == null) {
            user.setManager(null);
        } else {
            if (managerId.equals(userId)) {
                throw new IllegalStateException("A user cannot be their own manager");
            }
            User manager = userRepository.findById(managerId)
                    .orElseThrow(() -> new IllegalArgumentException("Manager not found"));
            user.setManager(manager);
        }

        userRepository.save(user);
        return UserResponse.fromEntity(user);
    }
}