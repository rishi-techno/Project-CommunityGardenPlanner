package com.gardenmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for garden plot create/update/response operations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlotDTO {

    private Long id;

    @NotBlank(message = "Plot number is required")
    private String plotNumber;

    @NotBlank(message = "Plot size is required")
    private String size;

    private String status; // AVAILABLE, OCCUPIED, MAINTENANCE

    private Long assignedUserId;

    private String assignedUserName; // For response display
}
