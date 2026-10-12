package com.hostel.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "rooms", indexes = {
    @Index(name = "idx_room_number", columnList = "room_number", unique = true),
    @Index(name = "idx_room_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Room number is required")
    @Column(name = "room_number", nullable = false, unique = true)
    private String roomNumber;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Column(nullable = false)
    private Integer capacity;

    @Min(value = 0, message = "Current occupancy cannot be negative")
    @Column(name = "current_occupancy", nullable = false)
    private Integer currentOccupancy = 0;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status = RoomStatus.AVAILABLE;

    public boolean isAvailable() {
        return status == RoomStatus.AVAILABLE && currentOccupancy < capacity;
    }

    public boolean isFull() {
        return currentOccupancy >= capacity;
    }

    public void assignStudent() {
        this.currentOccupancy++;
        if (this.currentOccupancy >= this.capacity) {
            this.status = RoomStatus.FULL;
        }
    }

    public void removeStudent() {
        this.currentOccupancy = Math.max(0, this.currentOccupancy - 1);
        if (this.currentOccupancy < this.capacity) {
            this.status = RoomStatus.AVAILABLE;
        }
    }
}