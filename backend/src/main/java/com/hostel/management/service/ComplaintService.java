package com.hostel.management.service;

import com.hostel.management.dto.ComplaintCreateDTO;
import com.hostel.management.dto.ComplaintDTO;
import com.hostel.management.dto.ComplaintUpdateDTO;
import com.hostel.management.entity.Complaint;
import com.hostel.management.entity.ComplaintCategory;
import com.hostel.management.entity.ComplaintStatus;
import com.hostel.management.entity.Student;
import com.hostel.management.exception.ResourceNotFoundException;
import com.hostel.management.repository.ComplaintRepository;
import com.hostel.management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final StudentRepository studentRepository;

    public List<ComplaintDTO> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<ComplaintDTO> getComplaintsWithFilters(ComplaintStatus status, ComplaintCategory category, Pageable pageable) {
        return complaintRepository.findWithFilters(status, category, pageable)
                .map(this::convertToDTO);
    }

    public ComplaintDTO getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
        return convertToDTO(complaint);
    }

    public List<ComplaintDTO> getComplaintsByStudent(Long studentId) {
        return complaintRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ComplaintDTO> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ComplaintDTO createComplaint(ComplaintCreateDTO createDTO) {
        Student student = studentRepository.findById(createDTO.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + createDTO.getStudentId()));

        Complaint complaint = Complaint.builder()
                .studentId(createDTO.getStudentId())
                .category(createDTO.getCategory())
                .description(createDTO.getDescription())
                .status(ComplaintStatus.PENDING)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return convertToDTO(saved);
    }

    public ComplaintDTO updateComplaint(Long id, ComplaintUpdateDTO updateDTO) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        if (updateDTO.getStatus() == ComplaintStatus.RESOLVED && complaint.getStatus() != ComplaintStatus.RESOLVED) {
            complaint.markResolved();
        } else if (updateDTO.getStatus() == ComplaintStatus.IN_PROGRESS && complaint.getStatus() == ComplaintStatus.PENDING) {
            complaint.markInProgress();
        } else {
            complaint.setStatus(updateDTO.getStatus());
        }

        Complaint saved = complaintRepository.save(complaint);
        return convertToDTO(saved);
    }

    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }

    public long getPendingComplaintsCount() {
        return complaintRepository.countPendingComplaints();
    }

    public long getInProgressComplaintsCount() {
        return complaintRepository.countInProgressComplaints();
    }

    public long getResolvedComplaintsCount() {
        return complaintRepository.countResolvedComplaints();
    }

    private ComplaintDTO convertToDTO(Complaint complaint) {
        Student student = studentRepository.findById(complaint.getStudentId()).orElse(null);

        return ComplaintDTO.builder()
                .id(complaint.getId())
                .studentId(complaint.getStudentId())
                .studentName(student != null ? student.getName() : "Unknown")
                .category(complaint.getCategory())
                .description(complaint.getDescription())
                .status(complaint.getStatus())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .resolvedAt(complaint.getResolvedAt())
                .build();
    }
}