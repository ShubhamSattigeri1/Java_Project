package com.hostel.management.dto;

import com.hostel.management.entity.ComplaintCategory;
import com.hostel.management.entity.ComplaintStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintDTO {

    private Long id;
    private Long studentId;
    private String studentName;
    private ComplaintCategory category;
    private String description;
    private ComplaintStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}