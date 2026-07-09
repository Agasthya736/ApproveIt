package com.example.ApproveIt.dto;

import lombok.*;

@Getter @Setter
public class ApprovalRequest {
    private String comment; // optional, required for reject in service logic
}
