package com.gardenmanagement.service;

import com.gardenmanagement.dto.PlantDTO;
import com.gardenmanagement.entity.GardenPlot;
import com.gardenmanagement.entity.Plant;
import com.gardenmanagement.exception.ResourceNotFoundException;
import com.gardenmanagement.repository.PlantRepository;
import com.gardenmanagement.repository.PlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for plant management business logic.
 */
@Service
@RequiredArgsConstructor
public class PlantService {

    private final PlantRepository plantRepository;
    private final PlotRepository plotRepository;

    public List<PlantDTO> getAllPlants() {
        return plantRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PlantDTO getPlantById(Long id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));
        return toDTO(plant);
    }

    public PlantDTO createPlant(PlantDTO dto) {
        GardenPlot plot = plotRepository.findById(dto.getPlotId())
                .orElseThrow(() -> new ResourceNotFoundException("GardenPlot", "id", dto.getPlotId()));

        Plant plant = Plant.builder()
                .plantName(dto.getPlantName())
                .category(dto.getCategory())
                .plantingDate(dto.getPlantingDate())
                .harvestDate(dto.getHarvestDate())
                .growthStatus(dto.getGrowthStatus() != null
                        ? Plant.GrowthStatus.valueOf(dto.getGrowthStatus().toUpperCase())
                        : Plant.GrowthStatus.SEEDLING)
                .plot(plot)
                .build();

        return toDTO(plantRepository.save(plant));
    }

    public PlantDTO updatePlant(Long id, PlantDTO dto) {
        Plant existing = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));

        GardenPlot plot = plotRepository.findById(dto.getPlotId())
                .orElseThrow(() -> new ResourceNotFoundException("GardenPlot", "id", dto.getPlotId()));

        existing.setPlantName(dto.getPlantName());
        existing.setCategory(dto.getCategory());
        existing.setPlantingDate(dto.getPlantingDate());
        existing.setHarvestDate(dto.getHarvestDate());
        existing.setGrowthStatus(Plant.GrowthStatus.valueOf(dto.getGrowthStatus().toUpperCase()));
        existing.setPlot(plot);

        return toDTO(plantRepository.save(existing));
    }

    public void deletePlant(Long id) {
        if (!plantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Plant", "id", id);
        }
        plantRepository.deleteById(id);
    }

    public List<PlantDTO> getPlantsByCategory(String category) {
        return plantRepository.findByCategory(category).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PlantDTO> getPlantsByPlot(Long plotId) {
        return plantRepository.findByPlotId(plotId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─── Mappers ────────────────────────────────────────────────────────────────

    private PlantDTO toDTO(Plant plant) {
        PlantDTO dto = new PlantDTO();
        dto.setId(plant.getId());
        dto.setPlantName(plant.getPlantName());
        dto.setCategory(plant.getCategory());
        dto.setPlantingDate(plant.getPlantingDate());
        dto.setHarvestDate(plant.getHarvestDate());
        dto.setGrowthStatus(plant.getGrowthStatus().name());
        if (plant.getPlot() != null) {
            dto.setPlotId(plant.getPlot().getId());
            dto.setPlotNumber(plant.getPlot().getPlotNumber());
        }
        return dto;
    }
}
