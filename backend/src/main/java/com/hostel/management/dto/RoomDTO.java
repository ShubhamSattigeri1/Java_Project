package com.hostel.management.dto;

import com.hostel.management.entity.RoomStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDTO {

    private Long id;
    private String roomNumber;
    private Integer capacity;
    private Integer currentOccupancy;
    private RoomStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public boolean isAvailable() {
        return status == RoomStatus.AVAILABLE && currentOccupancy < capacity;
    }

    public int getAvailableSlots() {
        return Math.max(0, capacity - currentOccupancy);
    }
}