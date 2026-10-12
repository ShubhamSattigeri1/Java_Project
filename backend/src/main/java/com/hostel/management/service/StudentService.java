package com.hostel.management.service;

import com.hostel.management.dto.StudentCreateDTO;
import com.hostel.management.dto.StudentDTO;
import com.hostel.management.entity.FeeStatus;
import com.hostel.management.entity.Student;
import com.hostel.management.exception.ResourceNotFoundException;
import com.hostel.management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final RoomService roomService;

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return convertToDTO(student);
    }

    public StudentDTO getStudentByEmail(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
        return convertToDTO(student);
    }

    public StudentDTO createStudent(StudentCreateDTO createDTO) {
        if (studentRepository.findByEmail(createDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Student with email " + createDTO.getEmail() + " already exists");
        }

        Student student = Student.builder()
                .name(createDTO.getName())
                .email(createDTO.getEmail())
                .phone(createDTO.getPhone())
                .feeStatus(createDTO.getFeeStatus())
                .build();

        Student saved = studentRepository.save(student);
        return convertToDTO(saved);
    }

    public StudentDTO updateStudent(Long id, StudentCreateDTO updateDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if (!student.getEmail().equals(updateDTO.getEmail()) &&
                studentRepository.findByEmail(updateDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Student with email " + updateDTO.getEmail() + " already exists");
        }

        student.setName(updateDTO.getName());
        student.setEmail(updateDTO.getEmail());
        student.setPhone(updateDTO.getPhone());
        student.setFeeStatus(updateDTO.getFeeStatus());

        Student saved = studentRepository.save(student);
        return convertToDTO(saved);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if (student.getRoomNumber() != null && !student.getRoomNumber().isEmpty()) {
            roomService.unassignStudentFromRoom(student.getRoomNumber());
        }

        studentRepository.delete(student);
    }

    public StudentDTO assignRoom(Long studentId, String roomNumber) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        roomService.assignStudentToRoom(roomNumber);
        student.setRoomNumber(roomNumber);

        Student saved = studentRepository.save(student);
        return convertToDTO(saved);
    }

    public StudentDTO unassignRoom(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        if (student.getRoomNumber() != null && !student.getRoomNumber().isEmpty()) {
            roomService.unassignStudentFromRoom(student.getRoomNumber());
            student.setRoomNumber(null);
        }

        Student saved = studentRepository.save(student);
        return convertToDTO(saved);
    }

    public List<StudentDTO> getUnassignedStudents() {
        return studentRepository.findUnassignedStudents().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<StudentDTO> getStudentsByFeeStatus(FeeStatus feeStatus) {
        return studentRepository.findByFeeStatus(feeStatus).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public long getTotalStudentsCount() {
        return studentRepository.countTotalStudents();
    }

    public long getStudentsCountByFeeStatus(FeeStatus feeStatus) {
        return studentRepository.countByFeeStatus(feeStatus);
    }

    private StudentDTO convertToDTO(Student student) {
        return StudentDTO.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .roomNumber(student.getRoomNumber())
                .feeStatus(student.getFeeStatus())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}