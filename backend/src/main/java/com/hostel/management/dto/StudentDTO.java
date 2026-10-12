package com.hostel.management.dto;

import com.hostel.management.entity.FeeStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    private String phone;

    private String roomNumber;

    @NotNull(message = "Fee status is required")
    private FeeStatus feeStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}