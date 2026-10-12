package com.hostel.management.controller;

import com.hostel.management.dto.ApiResponseDTO;
import com.hostel.management.dto.RoomAssignmentDTO;
import com.hostel.management.dto.StudentCreateDTO;
import com.hostel.management.dto.StudentDTO;
import com.hostel.management.entity.FeeStatus;
import com.hostel.management.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<StudentDTO>>> getAllStudents() {
        List<StudentDTO> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponseDTO.success(students));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<StudentDTO>> getStudentById(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponseDTO.success(student));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<StudentDTO>> createStudent(@Valid @RequestBody StudentCreateDTO createDTO) {
        StudentDTO student = studentService.createStudent(createDTO);
        return ResponseEntity.status(201).body(ApiResponseDTO.success("Student created successfully", student));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<StudentDTO>> updateStudent(@PathVariable Long id,
                                                                     @Valid @RequestBody StudentCreateDTO updateDTO) {
        StudentDTO student = studentService.updateStudent(id, updateDTO);
        return ResponseEntity.ok(ApiResponseDTO.success("Student updated successfully", student));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Student deleted successfully"));
    }

    @PostMapping("/{id}/assign-room")
    public ResponseEntity<ApiResponseDTO<StudentDTO>> assignRoom(@PathVariable Long id,
                                                                  @Valid @RequestBody RoomAssignmentDTO assignmentDTO) {
        StudentDTO student = studentService.assignRoom(id, assignmentDTO.getRoomNumber());
        return ResponseEntity.ok(ApiResponseDTO.success("Room assigned successfully", student));
    }

    @DeleteMapping("/{id}/unassign-room")
    public ResponseEntity<ApiResponseDTO<StudentDTO>> unassignRoom(@PathVariable Long id) {
        StudentDTO student = studentService.unassignRoom(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Room unassigned successfully", student));
    }

    @GetMapping("/unassigned")
    public ResponseEntity<ApiResponseDTO<List<StudentDTO>>> getUnassignedStudents() {
        List<StudentDTO> students = studentService.getUnassignedStudents();
        return ResponseEntity.ok(ApiResponseDTO.success(students));
    }

    @GetMapping("/fee-status/{status}")
    public ResponseEntity<ApiResponseDTO<List<StudentDTO>>> getStudentsByFeeStatus(@PathVariable FeeStatus status) {
        List<StudentDTO> students = studentService.getStudentsByFeeStatus(status);
        return ResponseEntity.ok(ApiResponseDTO.success(students));
    }
}