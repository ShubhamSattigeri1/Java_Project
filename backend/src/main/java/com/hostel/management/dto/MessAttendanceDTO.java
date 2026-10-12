package com.hostel.management.dto;

import com.hostel.management.entity.AttendanceStatus;
import com.hostel.management.entity.MealType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessAttendanceDTO {

    private Long id;
    private Long studentId;
    private String studentName;
    private LocalDate date;
    private MealType mealType;
    private AttendanceStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}