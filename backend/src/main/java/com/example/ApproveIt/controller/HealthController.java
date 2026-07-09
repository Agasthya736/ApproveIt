package com.example.ApproveIt.controller;

import com.example.ApproveIt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class HealthController {

    private final UserRepository userRepository;

    @GetMapping("/api/health")
    public String health() {
        return "DB connected. User count: " + userRepository.count();
    }
}