package com.gardenmanagement.controller;

import com.gardenmanagement.dto.PlantDTO;
import com.gardenmanagement.service.PlantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for plant endpoints.
 */
@RestController
@RequestMapping("/api/plants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlantController {

    private final PlantService plantService;

    /** GET /api/plants - Get all plants */
    @GetMapping
    public ResponseEntity<List<PlantDTO>> getAllPlants() {
        return ResponseEntity.ok(plantService.getAllPlants());
    }

    /** GET /api/plants/{id} - Get plant by ID */
    @GetMapping("/{id}")
    public ResponseEntity<PlantDTO> getPlantById(@PathVariable Long id) {
        return ResponseEntity.ok(plantService.getPlantById(id));
    }

    /** GET /api/plants/category?name=... - Filter by category */
    @GetMapping("/category")
    public ResponseEntity<List<PlantDTO>> getByCategory(@RequestParam String name) {
        return ResponseEntity.ok(plantService.getPlantsByCategory(name));
    }

    /** GET /api/plants/plot/{plotId} - Get plants by plot */
    @GetMapping("/plot/{plotId}")
    public ResponseEntity<List<PlantDTO>> getByPlot(@PathVariable Long plotId) {
        return ResponseEntity.ok(plantService.getPlantsByPlot(plotId));
    }

    /** POST /api/plants - Create a new plant */
    @PostMapping
    public ResponseEntity<PlantDTO> createPlant(@Valid @RequestBody PlantDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(plantService.createPlant(dto));
    }

    /** PUT /api/plants/{id} - Update a plant */
    @PutMapping("/{id}")
    public ResponseEntity<PlantDTO> updatePlant(@PathVariable Long id,
                                                 @Valid @RequestBody PlantDTO dto) {
        return ResponseEntity.ok(plantService.updatePlant(id, dto));
    }

    /** DELETE /api/plants/{id} - Delete a plant */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlant(@PathVariable Long id) {
        plantService.deletePlant(id);
        return ResponseEntity.noContent().build();
    }
}
