package com.example.ApproveIt.dto;

import lombok.*;

@Getter @Setter @AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String email;
    private String name;
    private java.util.Set<String> roles;
}