package com.hostel.management.controller;

import com.hostel.management.dto.ApiResponseDTO;
import com.hostel.management.dto.ComplaintCreateDTO;
import com.hostel.management.dto.ComplaintDTO;
import com.hostel.management.dto.ComplaintUpdateDTO;
import com.hostel.management.entity.ComplaintCategory;
import com.hostel.management.entity.ComplaintStatus;
import com.hostel.management.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<Page<ComplaintDTO>>> getAllComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) ComplaintCategory category,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ComplaintDTO> complaints = complaintService.getComplaintsWithFilters(status, category, pageable);
        return ResponseEntity.ok(ApiResponseDTO.success(complaints));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<ComplaintDTO>> getComplaintById(@PathVariable Long id) {
        ComplaintDTO complaint = complaintService.getComplaintById(id);
        return ResponseEntity.ok(ApiResponseDTO.success(complaint));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponseDTO<List<ComplaintDTO>>> getComplaintsByStudent(@PathVariable Long studentId) {
        List<ComplaintDTO> complaints = complaintService.getComplaintsByStudent(studentId);
        return ResponseEntity.ok(ApiResponseDTO.success(complaints));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponseDTO<List<ComplaintDTO>>> getComplaintsByStatus(@PathVariable ComplaintStatus status) {
        List<ComplaintDTO> complaints = complaintService.getComplaintsByStatus(status);
        return ResponseEntity.ok(ApiResponseDTO.success(complaints));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<ComplaintDTO>> createComplaint(@Valid @RequestBody ComplaintCreateDTO createDTO) {
        ComplaintDTO complaint = complaintService.createComplaint(createDTO);
        return ResponseEntity.status(201).body(ApiResponseDTO.success("Complaint created successfully", complaint));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<ComplaintDTO>> updateComplaint(@PathVariable Long id,
                                                                         @Valid @RequestBody ComplaintUpdateDTO updateDTO) {
        ComplaintDTO complaint = complaintService.updateComplaint(id, updateDTO);
        return ResponseEntity.ok(ApiResponseDTO.success("Complaint updated successfully", complaint));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Complaint deleted successfully"));
    }

    @GetMapping("/stats/pending")
    public ResponseEntity<ApiResponseDTO<Long>> getPendingComplaintsCount() {
        long count = complaintService.getPendingComplaintsCount();
        return ResponseEntity.ok(ApiResponseDTO.success(count));
    }

    @GetMapping("/stats/in-progress")
    public ResponseEntity<ApiResponseDTO<Long>> getInProgressComplaintsCount() {
        long count = complaintService.getInProgressComplaintsCount();
        return ResponseEntity.ok(ApiResponseDTO.success(count));
    }

    @GetMapping("/stats/resolved")
    public ResponseEntity<ApiResponseDTO<Long>> getResolvedComplaintsCount() {
        long count = complaintService.getResolvedComplaintsCount();
        return ResponseEntity.ok(ApiResponseDTO.success(count));
    }
}