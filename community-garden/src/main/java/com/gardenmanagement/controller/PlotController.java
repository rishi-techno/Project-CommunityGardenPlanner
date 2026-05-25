package com.gardenmanagement.controller;

import com.gardenmanagement.dto.PlotDTO;
import com.gardenmanagement.service.PlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for garden plot endpoints.
 */
@RestController
@RequestMapping("/api/plots")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlotController {

    private final PlotService plotService;

    /** GET /api/plots - Get all plots */
    @GetMapping
    public ResponseEntity<List<PlotDTO>> getAllPlots() {
        return ResponseEntity.ok(plotService.getAllPlots());
    }

    /** GET /api/plots/{id} - Get plot by ID */
    @GetMapping("/{id}")
    public ResponseEntity<PlotDTO> getPlotById(@PathVariable Long id) {
        return ResponseEntity.ok(plotService.getPlotById(id));
    }

    /** GET /api/plots/available - Get all available plots */
    @GetMapping("/available")
    public ResponseEntity<List<PlotDTO>> getAvailablePlots() {
        return ResponseEntity.ok(plotService.getAvailablePlots());
    }

    /** GET /api/plots/search?keyword=... - Search plots */
    @GetMapping("/search")
    public ResponseEntity<List<PlotDTO>> searchPlots(@RequestParam String keyword) {
        return ResponseEntity.ok(plotService.searchPlots(keyword));
    }

    /** POST /api/plots - Create a new plot (ADMIN only) */
    @PostMapping
    public ResponseEntity<PlotDTO> createPlot(@Valid @RequestBody PlotDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(plotService.createPlot(dto));
    }

    /** PUT /api/plots/{id} - Update a plot (ADMIN only) */
    @PutMapping("/{id}")
    public ResponseEntity<PlotDTO> updatePlot(@PathVariable Long id,
                                               @Valid @RequestBody PlotDTO dto) {
        return ResponseEntity.ok(plotService.updatePlot(id, dto));
    }

    /** DELETE /api/plots/{id} - Delete a plot (ADMIN only) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlot(@PathVariable Long id) {
        plotService.deletePlot(id);
        return ResponseEntity.noContent().build();
    }
}
