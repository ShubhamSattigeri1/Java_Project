package com.hostel.management.service;

import com.hostel.management.dto.MessAttendanceCreateDTO;
import com.hostel.management.dto.MessAttendanceDTO;
import com.hostel.management.dto.MonthlyMessBillDTO;
import com.hostel.management.entity.AttendanceStatus;
import com.hostel.management.entity.MealType;
import com.hostel.management.entity.MessAttendance;
import com.hostel.management.entity.Student;
import com.hostel.management.exception.ResourceNotFoundException;
import com.hostel.management.repository.MessAttendanceRepository;
import com.hostel.management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MessAttendanceService {

    private final MessAttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    private static final double MEAL_COST = 50.0;

    public List<MessAttendanceDTO> getAllAttendance() {
        return attendanceRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MessAttendanceDTO> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MessAttendanceDTO> getAttendanceByDateAndMeal(LocalDate date, MealType mealType) {
        return attendanceRepository.findByDateAndMealType(date, mealType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MessAttendanceDTO> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MessAttendanceDTO markAttendance(MessAttendanceCreateDTO createDTO) {
        Student student = studentRepository.findById(createDTO.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + createDTO.getStudentId()));

        Optional<MessAttendance> existing = attendanceRepository.findByStudentIdAndDateAndMealType(
                createDTO.getStudentId(), createDTO.getDate(), createDTO.getMealType());

        MessAttendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
            attendance.setStatus(createDTO.getStatus());
        } else {
            attendance = MessAttendance.builder()
                    .studentId(createDTO.getStudentId())
                    .date(createDTO.getDate())
                    .mealType(createDTO.getMealType())
                    .status(createDTO.getStatus())
                    .build();
        }

        MessAttendance saved = attendanceRepository.save(attendance);
        return convertToDTO(saved);
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

    public long getTodaysMessCount() {
        return attendanceRepository.countPresentByDate(LocalDate.now());
    }

    public long getMealCountByDateAndType(LocalDate date, MealType mealType) {
        return attendanceRepository.countPresentByDateAndMealType(date, mealType);
    }

    public MonthlyMessBillDTO calculateMonthlyBill(Long studentId, YearMonth month) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();

        List<MessAttendance> attendances = attendanceRepository.findByStudentIdAndDateBetween(studentId, startDate, endDate);

        int breakfastCount = 0;
        int lunchCount = 0;
        int dinnerCount = 0;

        Map<String, Integer> dailyBreakdown = new LinkedHashMap<>();

        for (MessAttendance attendance : attendances) {
            if (attendance.getStatus() == AttendanceStatus.PRESENT) {
                String dayKey = attendance.getDate().toString();
                dailyBreakdown.put(dayKey, dailyBreakdown.getOrDefault(dayKey, 0) + 1);

                switch (attendance.getMealType()) {
                    case BREAKFAST -> breakfastCount++;
                    case LUNCH -> lunchCount++;
                    case DINNER -> dinnerCount++;
                }
            }
        }

        int totalMeals = breakfastCount + lunchCount + dinnerCount;
        double estimatedBill = totalMeals * MEAL_COST;

        return MonthlyMessBillDTO.builder()
                .studentId(studentId)
                .studentName(student.getName())
                .totalMeals(totalMeals)
                .breakfastCount(breakfastCount)
                .lunchCount(lunchCount)
                .dinnerCount(dinnerCount)
                .estimatedBill(estimatedBill)
                .monthStart(startDate)
                .monthEnd(endDate)
                .dailyBreakdown(dailyBreakdown)
                .build();
    }

    public List<MonthlyMessBillDTO> calculateAllMonthlyBills(YearMonth month) {
        List<Student> students = studentRepository.findAll();
        return students.stream()
                .map(student -> calculateMonthlyBill(student.getId(), month))
                .collect(Collectors.toList());
    }

    private MessAttendanceDTO convertToDTO(MessAttendance attendance) {
        Student student = studentRepository.findById(attendance.getStudentId()).orElse(null);

        return MessAttendanceDTO.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudentId())
                .studentName(student != null ? student.getName() : "Unknown")
                .date(attendance.getDate())
                .mealType(attendance.getMealType())
                .status(attendance.getStatus())
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }
}