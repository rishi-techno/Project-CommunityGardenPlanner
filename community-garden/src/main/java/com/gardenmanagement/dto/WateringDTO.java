package com.gardenmanagement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTO for watering schedule create/update/response operations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WateringDTO {

    private Long id;

    @NotNull(message = "Watering date is required")
    private LocalDate wateringDate;

    @NotNull(message = "Watering time is required")
    private LocalTime wateringTime;

    private String status; // SCHEDULED, COMPLETED, SKIPPED

    private String notes;

    @NotNull(message = "Plot ID is required")
    private Long plotId;

    private String plotNumber; // For response display
}
