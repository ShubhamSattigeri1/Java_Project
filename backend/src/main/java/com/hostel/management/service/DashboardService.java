package com.hostel.management.service;

import com.hostel.management.dto.DashboardStatsDTO;
import com.hostel.management.entity.ComplaintStatus;
import com.hostel.management.repository.ComplaintRepository;
import com.hostel.management.repository.MessAttendanceRepository;
import com.hostel.management.repository.RoomRepository;
import com.hostel.management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;
    private final MessAttendanceRepository attendanceRepository;
    private final ComplaintRepository complaintRepository;

    public DashboardStatsDTO getDashboardStats() {
        return DashboardStatsDTO.builder()
                .totalStudents(studentRepository.countTotalStudents())
                .occupiedRooms(roomRepository.countOccupiedRooms())
                .totalRooms(roomRepository.countTotalRooms())
                .availableRooms(roomRepository.countTotalRooms() - roomRepository.countOccupiedRooms())
                .todaysMessCount(attendanceRepository.countPresentByDate(LocalDate.now()))
                .pendingComplaints(complaintRepository.countPendingComplaints())
                .inProgressComplaints(complaintRepository.countInProgressComplaints())
                .resolvedComplaints(complaintRepository.countResolvedComplaints())
                .build();
    }
}