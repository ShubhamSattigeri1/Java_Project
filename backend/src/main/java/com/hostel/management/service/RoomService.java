package com.hostel.management.service;

import com.hostel.management.dto.RoomCreateDTO;
import com.hostel.management.dto.RoomDTO;
import com.hostel.management.entity.Room;
import com.hostel.management.entity.RoomStatus;
import com.hostel.management.exception.ResourceNotFoundException;
import com.hostel.management.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomService {

    private final RoomRepository roomRepository;

    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RoomDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return convertToDTO(room);
    }

    public RoomDTO getRoomByNumber(String roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with number: " + roomNumber));
        return convertToDTO(room);
    }

    public RoomDTO createRoom(RoomCreateDTO createDTO) {
        if (roomRepository.findByRoomNumber(createDTO.getRoomNumber()).isPresent()) {
            throw new IllegalArgumentException("Room with number " + createDTO.getRoomNumber() + " already exists");
        }

        Room room = Room.builder()
                .roomNumber(createDTO.getRoomNumber())
                .capacity(createDTO.getCapacity())
                .currentOccupancy(0)
                .status(RoomStatus.AVAILABLE)
                .build();

        Room saved = roomRepository.save(room);
        return convertToDTO(saved);
    }

    public RoomDTO updateRoomStatus(Long id, RoomStatus status) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        room.setStatus(status);
        Room saved = roomRepository.save(room);
        return convertToDTO(saved);
    }

    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        if (room.getCurrentOccupancy() > 0) {
            throw new IllegalStateException("Cannot delete room with current occupants");
        }

        roomRepository.delete(room);
    }

    public List<RoomDTO> getAvailableRooms() {
        return roomRepository.findAvailableRooms().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RoomDTO> getRoomsByStatus(RoomStatus status) {
        return roomRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public long getTotalRoomsCount() {
        return roomRepository.countTotalRooms();
    }

    public long getOccupiedRoomsCount() {
        return roomRepository.countOccupiedRooms();
    }

    public void assignStudentToRoom(String roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with number: " + roomNumber));

        if (!room.isAvailable()) {
            throw new IllegalStateException("Room " + roomNumber + " is not available for assignment");
        }

        room.assignStudent();
        roomRepository.save(room);
    }

    public void unassignStudentFromRoom(String roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with number: " + roomNumber));

        room.removeStudent();
        roomRepository.save(room);
    }

    private RoomDTO convertToDTO(Room room) {
        return RoomDTO.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .capacity(room.getCapacity())
                .currentOccupancy(room.getCurrentOccupancy())
                .status(room.getStatus())
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .build();
    }

    public RoomDTO updateRoom(Long id, RoomCreateDTO updateDTO) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        if (!room.getRoomNumber().equals(updateDTO.getRoomNumber()) &&
                roomRepository.findByRoomNumber(updateDTO.getRoomNumber()).isPresent()) {
            throw new IllegalArgumentException("Room with number " + updateDTO.getRoomNumber() + " already exists");
        }

        if (updateDTO.getCapacity() < room.getCurrentOccupancy()) {
            throw new IllegalArgumentException("Cannot reduce capacity below current occupancy (" + room.getCurrentOccupancy() + ")");
        }

        room.setRoomNumber(updateDTO.getRoomNumber());
        room.setCapacity(updateDTO.getCapacity());

        if (room.getCurrentOccupancy() >= room.getCapacity()) {
            room.setStatus(RoomStatus.FULL);
        } else if (room.getStatus() == RoomStatus.FULL) {
            room.setStatus(RoomStatus.AVAILABLE);
        }

        Room saved = roomRepository.save(room);
        return convertToDTO(saved);
    }
}