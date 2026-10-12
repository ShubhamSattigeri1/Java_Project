package com.hostel.management.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyMessBillDTO {

    private Long studentId;
    private String studentName;
    private int totalMeals;
    private int breakfastCount;
    private int lunchCount;
    private int dinnerCount;
    private double estimatedBill;
    private LocalDate monthStart;
    private LocalDate monthEnd;
    private Map<String, Integer> dailyBreakdown;
}