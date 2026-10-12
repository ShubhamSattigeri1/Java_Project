package com.hostel.management.dto;

import com.hostel.management.entity.ComplaintStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintUpdateDTO {

    @NotNull(message = "Status is required")
    private ComplaintStatus status;
}