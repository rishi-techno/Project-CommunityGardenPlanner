package com.gardenmanagement.controller;

import com.gardenmanagement.dto.WateringDTO;
import com.gardenmanagement.service.WateringService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for watering schedule endpoints.
 */
@RestController
@RequestMapping("/api/watering")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WateringController {

    private final WateringService wateringService;

    /** GET /api/watering - Get all watering schedules */
    @GetMapping
    public ResponseEntity<List<WateringDTO>> getAllSchedules() {
        return ResponseEntity.ok(wateringService.getAllSchedules());
    }

    /** GET /api/watering/upcoming - Get upcoming scheduled waterings */
    @GetMapping("/upcoming")
    public ResponseEntity<List<WateringDTO>> getUpcoming() {
        return ResponseEntity.ok(wateringService.getUpcomingSchedules());
    }

    /** GET /api/watering/plot/{plotId} - Get watering schedules for a plot */
    @GetMapping("/plot/{plotId}")
    public ResponseEntity<List<WateringDTO>> getByPlot(@PathVariable Long plotId) {
        return ResponseEntity.ok(wateringService.getSchedulesByPlot(plotId));
    }

    /** POST /api/watering - Create a watering schedule */
    @PostMapping
    public ResponseEntity<WateringDTO> createSchedule(@Valid @RequestBody WateringDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(wateringService.createSchedule(dto));
    }

    /** PUT /api/watering/{id} - Update a watering schedule */
    @PutMapping("/{id}")
    public ResponseEntity<WateringDTO> updateSchedule(@PathVariable Long id,
                                                       @Valid @RequestBody WateringDTO dto) {
        return ResponseEntity.ok(wateringService.updateSchedule(id, dto));
    }

    /** DELETE /api/watering/{id} - Delete a watering schedule */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        wateringService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
