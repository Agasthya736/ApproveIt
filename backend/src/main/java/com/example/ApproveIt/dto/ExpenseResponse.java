package com.example.ApproveIt.dto;

import com.example.ApproveIt.entity.Expense;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private String employeeName;
    private String category;
    private BigDecimal amount;
    private String currency;
    private String description;
    private String status;
    private LocalDateTime submittedAt;

    public static ExpenseResponse fromEntity(Expense e) {
        return new ExpenseResponse(
                e.getId(),
                e.getUser().getName(),
                e.getCategory().getName(),
                e.getAmount(),
                e.getCurrency(),
                e.getDescription(),
                e.getStatus().name(),
                e.getSubmittedAt()
        );
    }
}