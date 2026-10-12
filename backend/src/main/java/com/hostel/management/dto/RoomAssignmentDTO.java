package com.hostel.management.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomAssignmentDTO {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Room number is required")
    private String roomNumber;
}