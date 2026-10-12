package com.hostel.management.controller;

import com.hostel.management.dto.ApiResponseDTO;
import com.hostel.management.dto.RoomCreateDTO;
import com.hostel.management.dto.RoomDTO;
import com.hostel.management.entity.RoomStatus;
import com.hostel.management.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<RoomDTO>>> getAllRooms() {
        List<RoomDTO> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(ApiResponseDTO.success(rooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<RoomDTO>> getRoomById(@PathVariable Long id) {
        RoomDTO room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponseDTO.success(room));
    }

    @GetMapping("/number/{roomNumber}")
    public ResponseEntity<ApiResponseDTO<RoomDTO>> getRoomByNumber(@PathVariable String roomNumber) {
        RoomDTO room = roomService.getRoomByNumber(roomNumber);
        return ResponseEntity.ok(ApiResponseDTO.success(room));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<RoomDTO>> createRoom(@Valid @RequestBody RoomCreateDTO createDTO) {
        RoomDTO room = roomService.createRoom(createDTO);
        return ResponseEntity.status(201).body(ApiResponseDTO.success("Room created successfully", room));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<RoomDTO>> updateRoom(@PathVariable Long id,
                                                               @Valid @RequestBody RoomCreateDTO updateDTO) {
        RoomDTO room = roomService.updateRoom(id, updateDTO);
        return ResponseEntity.ok(ApiResponseDTO.success("Room updated successfully", room));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponseDTO<RoomDTO>> updateRoomStatus(@PathVariable Long id,
                                                                     @RequestParam RoomStatus status) {
        RoomDTO room = roomService.updateRoomStatus(id, status);
        return ResponseEntity.ok(ApiResponseDTO.success("Room status updated successfully", room));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Room deleted successfully"));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponseDTO<List<RoomDTO>>> getAvailableRooms() {
        List<RoomDTO> rooms = roomService.getAvailableRooms();
        return ResponseEntity.ok(ApiResponseDTO.success(rooms));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponseDTO<List<RoomDTO>>> getRoomsByStatus(@PathVariable RoomStatus status) {
        List<RoomDTO> rooms = roomService.getRoomsByStatus(status);
        return ResponseEntity.ok(ApiResponseDTO.success(rooms));
    }
}