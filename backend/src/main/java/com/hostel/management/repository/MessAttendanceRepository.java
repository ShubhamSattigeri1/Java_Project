package com.hostel.management.repository;

import com.hostel.management.entity.MessAttendance;
import com.hostel.management.entity.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MessAttendanceRepository extends JpaRepository<MessAttendance, Long> {

    List<MessAttendance> findByStudentId(Long studentId);

    List<MessAttendance> findByDate(LocalDate date);

    List<MessAttendance> findByDateAndMealType(LocalDate date, MealType mealType);

    List<MessAttendance> findByStudentIdAndDateBetween(Long studentId, LocalDate startDate, LocalDate endDate);

    Optional<MessAttendance> findByStudentIdAndDateAndMealType(Long studentId, LocalDate date, MealType mealType);

    @Query("SELECT COUNT(m) FROM MessAttendance m WHERE m.date = :date AND m.status = 'PRESENT'")
    long countPresentByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(m) FROM MessAttendance m WHERE m.date = :date AND m.mealType = :mealType AND m.status = 'PRESENT'")
    long countPresentByDateAndMealType(@Param("date") LocalDate date, @Param("mealType") MealType mealType);

    @Query("SELECT COUNT(m) FROM MessAttendance m WHERE m.studentId = :studentId AND m.date BETWEEN :startDate AND :endDate AND m.status = 'PRESENT'")
    long countPresentByStudentAndDateRange(@Param("studentId") Long studentId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}