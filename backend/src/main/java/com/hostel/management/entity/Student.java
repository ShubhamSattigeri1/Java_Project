package com.hostel.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_student_email", columnList = "email", unique = true),
    @Index(name = "idx_student_room", columnList = "room_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(name = "room_number")
    private String roomNumber;

    @NotNull(message = "Fee status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "fee_status", nullable = false)
    private FeeStatus feeStatus = FeeStatus.PENDING;
}