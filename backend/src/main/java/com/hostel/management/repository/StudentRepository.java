package com.hostel.management.repository;

import com.hostel.management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    List<Student> findByRoomNumber(String roomNumber);

    List<Student> findByFeeStatus(com.hostel.management.entity.FeeStatus feeStatus);

    @Query("SELECT s FROM Student s WHERE s.roomNumber IS NULL OR s.roomNumber = ''")
    List<Student> findUnassignedStudents();

    @Query("SELECT COUNT(s) FROM Student s")
    long countTotalStudents();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.feeStatus = :status")
    long countByFeeStatus(@Param("status") com.hostel.management.entity.FeeStatus status);
}