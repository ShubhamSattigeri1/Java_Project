package com.hostel.management.dto;

import com.hostel.management.entity.AttendanceStatus;
import com.hostel.management.entity.MealType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessAttendanceCreateDTO {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Meal type is required")
    private MealType mealType;

    @NotNull(message = "Status is required")
    private AttendanceStatus status = AttendanceStatus.PRESENT;
}