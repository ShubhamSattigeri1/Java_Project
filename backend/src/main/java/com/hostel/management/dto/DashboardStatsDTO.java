package com.hostel.management.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {

    private long totalStudents;
    private long occupiedRooms;
    private long totalRooms;
    private long availableRooms;
    private long todaysMessCount;
    private long pendingComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
}