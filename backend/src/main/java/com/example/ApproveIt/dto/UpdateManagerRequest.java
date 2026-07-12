package com.example.ApproveIt.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateManagerRequest {
    private Long managerId; // nullable — null means "no manager / top of hierarchy"
}