package com.hostel.management.repository;

import com.hostel.management.entity.Complaint;
import com.hostel.management.entity.ComplaintCategory;
import com.hostel.management.entity.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByStudentId(Long studentId);

    List<Complaint> findByStatus(ComplaintStatus status);

    List<Complaint> findByCategory(ComplaintCategory category);

    List<Complaint> findByStatusIn(List<ComplaintStatus> statuses);

    Page<Complaint> findByStudentId(Long studentId, Pageable pageable);

    Page<Complaint> findByStatus(ComplaintStatus status, Pageable pageable);

    @Query("SELECT c FROM Complaint c WHERE (:status IS NULL OR c.status = :status) AND (:category IS NULL OR c.category = :category) ORDER BY c.createdAt DESC")
    Page<Complaint> findWithFilters(@Param("status") ComplaintStatus status, @Param("category") ComplaintCategory category, Pageable pageable);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = 'PENDING'")
    long countPendingComplaints();

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = 'IN_PROGRESS'")
    long countInProgressComplaints();

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = 'RESOLVED'")
    long countResolvedComplaints();
}