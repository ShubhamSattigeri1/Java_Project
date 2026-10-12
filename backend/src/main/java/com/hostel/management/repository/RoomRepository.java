package com.hostel.management.repository;

import com.hostel.management.entity.Room;
import com.hostel.management.entity.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByRoomNumber(String roomNumber);

    List<Room> findByStatus(RoomStatus status);

    List<Room> findByStatusIn(List<RoomStatus> statuses);

    @Query("SELECT r FROM Room r WHERE r.currentOccupancy < r.capacity AND r.status = 'AVAILABLE'")
    List<Room> findAvailableRooms();

    @Query("SELECT COUNT(r) FROM Room r WHERE r.status = 'FULL'")
    long countOccupiedRooms();

    @Query("SELECT COUNT(r) FROM Room r")
    long countTotalRooms();
}