package com.hostel.management.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponseDTO<T> {

    private boolean success;
    private String message;
    private T data;
    private int statusCode;

    public static <T> ApiResponseDTO<T> success(String message, T data) {
        return ApiResponseDTO.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .statusCode(200)
                .build();
    }

    public static <T> ApiResponseDTO<T> success(T data) {
        return success("Operation successful", data);
    }

    public static <T> ApiResponseDTO<T> error(String message, int statusCode) {
        return ApiResponseDTO.<T>builder()
                .success(false)
                .message(message)
                .statusCode(statusCode)
                .build();
    }
}