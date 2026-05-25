package com.gardenmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for plant create/update/response operations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlantDTO {

    private Long id;

    @NotBlank(message = "Plant name is required")
    private String plantName;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Planting date is required")
    private LocalDate plantingDate;

    private LocalDate harvestDate;

    private String growthStatus; // SEEDLING, GROWING, MATURE, HARVESTED, DEAD

    @NotNull(message = "Plot ID is required")
    private Long plotId;

    private String plotNumber; // For response display
}
