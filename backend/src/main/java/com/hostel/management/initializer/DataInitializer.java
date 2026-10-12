package com.hostel.management.initializer;

import com.hostel.management.entity.*;
import com.hostel.management.repository.ComplaintRepository;
import com.hostel.management.repository.MessAttendanceRepository;
import com.hostel.management.repository.RoomRepository;
import com.hostel.management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;
    private final MessAttendanceRepository attendanceRepository;
    private final ComplaintRepository complaintRepository;

    @Override
    @Transactional
    public void run(String... args) {
        initializeRooms();
        initializeStudents();
        initializeMessAttendance();
        initializeComplaints();
    }

    private void initializeRooms() {
        if (roomRepository.count() > 0) {
            return;
        }

        List<Room> rooms = Arrays.asList(
                Room.builder().roomNumber("101").capacity(2).currentOccupancy(0).status(RoomStatus.AVAILABLE).build(),
                Room.builder().roomNumber("102").capacity(2).currentOccupancy(0).status(RoomStatus.AVAILABLE).build(),
                Room.builder().roomNumber("103").capacity(3).currentOccupancy(0).status(RoomStatus.AVAILABLE).build(),
                Room.builder().roomNumber("104").capacity(3).currentOccupancy(0).status(RoomStatus.AVAILABLE).build(),
                Room.builder().roomNumber("201").capacity(2).currentOccupancy(0).status(RoomStatus.AVAILABLE).build(),
                Room.builder().roomNumber("202").capacity(2).currentOccupancy(0).status(RoomStatus.AVAILABLE).build(),
                Room.builder().roomNumber("203").capacity(3).currentOccupancy(0).status(RoomStatus.AVAILABLE).build(),
                Room.builder().roomNumber("204").capacity(3).currentOccupancy(0).status(RoomStatus.AVAILABLE).build(),
                Room.builder().roomNumber("301").capacity(2).currentOccupancy(0).status(RoomStatus.AVAILABLE).build(),
                Room.builder().roomNumber("302").capacity(2).currentOccupancy(0).status(RoomStatus.MAINTENANCE).build()
        );

        roomRepository.saveAll(rooms);
    }

    private void initializeStudents() {
        if (studentRepository.count() > 0) {
            return;
        }

        List<Student> students = Arrays.asList(
                Student.builder()
                        .name("Rahul Sharma")
                        .email("rahul.sharma@college.edu")
                        .phone("9876543210")
                        .roomNumber("101")
                        .feeStatus(FeeStatus.PAID)
                        .build(),
                Student.builder()
                        .name("Priya Patel")
                        .email("priya.patel@college.edu")
                        .phone("9876543211")
                        .roomNumber("101")
                        .feeStatus(FeeStatus.PAID)
                        .build(),
                Student.builder()
                        .name("Amit Kumar")
                        .email("amit.kumar@college.edu")
                        .phone("9876543212")
                        .roomNumber("102")
                        .feeStatus(FeeStatus.PENDING)
                        .build(),
                Student.builder()
                        .name("Sneha Reddy")
                        .email("sneha.reddy@college.edu")
                        .phone("9876543213")
                        .roomNumber("103")
                        .feeStatus(FeeStatus.PAID)
                        .build(),
                Student.builder()
                        .name("Vikram Singh")
                        .email("vikram.singh@college.edu")
                        .phone("9876543214")
                        .roomNumber("103")
                        .feeStatus(FeeStatus.OVERDUE)
                        .build(),
                Student.builder()
                        .name("Anjali Gupta")
                        .email("anjali.gupta@college.edu")
                        .phone("9876543215")
                        .roomNumber("103")
                        .feeStatus(FeeStatus.PAID)
                        .build(),
                Student.builder()
                        .name("Rohit Verma")
                        .email("rohit.verma@college.edu")
                        .phone("9876543216")
                        .roomNumber("201")
                        .feeStatus(FeeStatus.PENDING)
                        .build(),
                Student.builder()
                        .name("Kavya Nair")
                        .email("kavya.nair@college.edu")
                        .phone("9876543217")
                        .roomNumber("201")
                        .feeStatus(FeeStatus.PAID)
                        .build(),
                Student.builder()
                        .name("Arjun Mehta")
                        .email("arjun.mehta@college.edu")
                        .phone("9876543218")
                        .roomNumber(null)
                        .feeStatus(FeeStatus.PENDING)
                        .build(),
                Student.builder()
                        .name("Deepika Joshi")
                        .email("deepika.joshi@college.edu")
                        .phone("9876543219")
                        .roomNumber(null)
                        .feeStatus(FeeStatus.PAID)
                        .build()
        );

        List<Student> savedStudents = studentRepository.saveAll(students);

        updateRoomOccupancy(savedStudents);
    }

    private void updateRoomOccupancy(List<Student> students) {
        for (Student student : students) {
            if (student.getRoomNumber() != null && !student.getRoomNumber().isEmpty()) {
                roomRepository.findByRoomNumber(student.getRoomNumber()).ifPresent(room -> {
                    room.assignStudent();
                    roomRepository.save(room);
                });
            }
        }
    }

    private void initializeMessAttendance() {
        if (attendanceRepository.count() > 0) {
            return;
        }

        LocalDate today = LocalDate.now();
        List<Student> students = studentRepository.findAll();

        for (Student student : students) {
            for (int i = 0; i < 7; i++) {
                LocalDate date = today.minusDays(i);
                for (MealType mealType : MealType.values()) {
                    AttendanceStatus status = (i < 5 || mealType != MealType.DINNER) ?
                            AttendanceStatus.PRESENT : AttendanceStatus.ABSENT;

                    MessAttendance attendance = MessAttendance.builder()
                            .studentId(student.getId())
                            .date(date)
                            .mealType(mealType)
                            .status(status)
                            .build();

                    attendanceRepository.save(attendance);
                }
            }
        }
    }

    private void initializeComplaints() {
        if (complaintRepository.count() > 0) {
            return;
        }

        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) {
            return;
        }

        List<Complaint> complaints = Arrays.asList(
                Complaint.builder()
                        .studentId(students.get(0).getId())
                        .category(ComplaintCategory.PLUMBING)
                        .description("Leaking faucet in bathroom")
                        .status(ComplaintStatus.PENDING)
                        .build(),
                Complaint.builder()
                        .studentId(students.get(1).getId())
                        .category(ComplaintCategory.ELECTRICAL)
                        .description("Power outlet not working in room")
                        .status(ComplaintStatus.IN_PROGRESS)
                        .build(),
                Complaint.builder()
                        .studentId(students.get(2).getId())
                        .category(ComplaintCategory.CLEANING)
                        .description("Common area needs cleaning")
                        .status(ComplaintStatus.RESOLVED)
                        .resolvedAt(LocalDateTime.now().minusDays(2))
                        .build(),
                Complaint.builder()
                        .studentId(students.get(3).getId())
                        .category(ComplaintCategory.INTERNET)
                        .description("WiFi connection keeps dropping")
                        .status(ComplaintStatus.PENDING)
                        .build(),
                Complaint.builder()
                        .studentId(students.get(4).getId())
                        .category(ComplaintCategory.OTHER)
                        .description("Noise complaint from neighboring room")
                        .status(ComplaintStatus.IN_PROGRESS)
                        .build()
        );

        complaintRepository.saveAll(complaints);
    }
}