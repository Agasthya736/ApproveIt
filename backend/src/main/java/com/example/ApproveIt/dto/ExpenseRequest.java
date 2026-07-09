package com.example.ApproveIt.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
public class ExpenseRequest {

    @NotNull
    private Long categoryId;

    @NotNull @Positive
    private BigDecimal amount;

    private String currency = "INR";

    private String description;

    private String receiptUrl;
}