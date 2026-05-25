package com.gardenmanagement.service;

import com.gardenmanagement.dto.WateringDTO;
import com.gardenmanagement.entity.GardenPlot;
import com.gardenmanagement.entity.WateringSchedule;
import com.gardenmanagement.exception.ResourceNotFoundException;
import com.gardenmanagement.repository.PlotRepository;
import com.gardenmanagement.repository.WateringRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for watering schedule business logic.
 */
@Service
@RequiredArgsConstructor
public class WateringService {

    private final WateringRepository wateringRepository;
    private final PlotRepository plotRepository;

    public List<WateringDTO> getAllSchedules() {
        return wateringRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public WateringDTO createSchedule(WateringDTO dto) {
        GardenPlot plot = plotRepository.findById(dto.getPlotId())
                .orElseThrow(() -> new ResourceNotFoundException("GardenPlot", "id", dto.getPlotId()));

        WateringSchedule schedule = WateringSchedule.builder()
                .wateringDate(dto.getWateringDate())
                .wateringTime(dto.getWateringTime())
                .status(dto.getStatus() != null
                        ? WateringSchedule.WateringStatus.valueOf(dto.getStatus().toUpperCase())
                        : WateringSchedule.WateringStatus.SCHEDULED)
                .notes(dto.getNotes())
                .plot(plot)
                .build();

        return toDTO(wateringRepository.save(schedule));
    }

    public WateringDTO updateSchedule(Long id, WateringDTO dto) {
        WateringSchedule existing = wateringRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WateringSchedule", "id", id));

        GardenPlot plot = plotRepository.findById(dto.getPlotId())
                .orElseThrow(() -> new ResourceNotFoundException("GardenPlot", "id", dto.getPlotId()));

        existing.setWateringDate(dto.getWateringDate());
        existing.setWateringTime(dto.getWateringTime());
        existing.setStatus(WateringSchedule.WateringStatus.valueOf(dto.getStatus().toUpperCase()));
        existing.setNotes(dto.getNotes());
        existing.setPlot(plot);

        return toDTO(wateringRepository.save(existing));
    }

    public void deleteSchedule(Long id) {
        if (!wateringRepository.existsById(id)) {
            throw new ResourceNotFoundException("WateringSchedule", "id", id);
        }
        wateringRepository.deleteById(id);
    }

    public List<WateringDTO> getUpcomingSchedules() {
        return wateringRepository.findUpcomingScheduled(LocalDate.now()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<WateringDTO> getSchedulesByPlot(Long plotId) {
        return wateringRepository.findByPlotId(plotId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─── Mapper ─────────────────────────────────────────────────────────────────

    private WateringDTO toDTO(WateringSchedule schedule) {
        WateringDTO dto = new WateringDTO();
        dto.setId(schedule.getId());
        dto.setWateringDate(schedule.getWateringDate());
        dto.setWateringTime(schedule.getWateringTime());
        dto.setStatus(schedule.getStatus().name());
        dto.setNotes(schedule.getNotes());
        if (schedule.getPlot() != null) {
            dto.setPlotId(schedule.getPlot().getId());
            dto.setPlotNumber(schedule.getPlot().getPlotNumber());
        }
        return dto;
    }
}
