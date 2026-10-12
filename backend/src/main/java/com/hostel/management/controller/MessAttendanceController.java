package com.hostel.management.controller;

import com.hostel.management.dto.ApiResponseDTO;
import com.hostel.management.dto.MessAttendanceCreateDTO;
import com.hostel.management.dto.MessAttendanceDTO;
import com.hostel.management.dto.MonthlyMessBillDTO;
import com.hostel.management.entity.MealType;
import com.hostel.management.service.MessAttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/mess")
@RequiredArgsConstructor
public class MessAttendanceController {

    private final MessAttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<MessAttendanceDTO>>> getAllAttendance() {
        List<MessAttendanceDTO> attendance = attendanceService.getAllAttendance();
        return ResponseEntity.ok(ApiResponseDTO.success(attendance));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponseDTO<List<MessAttendanceDTO>>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<MessAttendanceDTO> attendance = attendanceService.getAttendanceByDate(date);
        return ResponseEntity.ok(ApiResponseDTO.success(attendance));
    }

    @GetMapping("/date/{date}/meal/{mealType}")
    public ResponseEntity<ApiResponseDTO<List<MessAttendanceDTO>>> getAttendanceByDateAndMeal(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable MealType mealType) {
        List<MessAttendanceDTO> attendance = attendanceService.getAttendanceByDateAndMeal(date, mealType);
        return ResponseEntity.ok(ApiResponseDTO.success(attendance));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponseDTO<List<MessAttendanceDTO>>> getAttendanceByStudent(@PathVariable Long studentId) {
        List<MessAttendanceDTO> attendance = attendanceService.getAttendanceByStudent(studentId);
        return ResponseEntity.ok(ApiResponseDTO.success(attendance));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<MessAttendanceDTO>> markAttendance(@Valid @RequestBody MessAttendanceCreateDTO createDTO) {
        MessAttendanceDTO attendance = attendanceService.markAttendance(createDTO);
        return ResponseEntity.status(201).body(ApiResponseDTO.success("Attendance marked successfully", attendance));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Attendance record deleted successfully"));
    }

    @GetMapping("/today/count")
    public ResponseEntity<ApiResponseDTO<Long>> getTodaysMessCount() {
        long count = attendanceService.getTodaysMessCount();
        return ResponseEntity.ok(ApiResponseDTO.success(count));
    }

    @GetMapping("/date/{date}/meal/{mealType}/count")
    public ResponseEntity<ApiResponseDTO<Long>> getMealCount(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable MealType mealType) {
        long count = attendanceService.getMealCountByDateAndType(date, mealType);
        return ResponseEntity.ok(ApiResponseDTO.success(count));
    }

    @GetMapping("/bill/student/{studentId}/month/{year}/{month}")
    public ResponseEntity<ApiResponseDTO<MonthlyMessBillDTO>> getMonthlyBill(
            @PathVariable Long studentId,
            @PathVariable int year,
            @PathVariable int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        MonthlyMessBillDTO bill = attendanceService.calculateMonthlyBill(studentId, yearMonth);
        return ResponseEntity.ok(ApiResponseDTO.success(bill));
    }

    @GetMapping("/bill/month/{year}/{month}")
    public ResponseEntity<ApiResponseDTO<List<MonthlyMessBillDTO>>> getAllMonthlyBills(
            @PathVariable int year,
            @PathVariable int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        List<MonthlyMessBillDTO> bills = attendanceService.calculateAllMonthlyBills(yearMonth);
        return ResponseEntity.ok(ApiResponseDTO.success(bills));
    }
}