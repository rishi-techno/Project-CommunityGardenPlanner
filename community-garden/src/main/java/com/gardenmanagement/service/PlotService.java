package com.gardenmanagement.service;

import com.gardenmanagement.dto.PlotDTO;
import com.gardenmanagement.entity.GardenPlot;
import com.gardenmanagement.entity.User;
import com.gardenmanagement.exception.ResourceNotFoundException;
import com.gardenmanagement.repository.PlotRepository;
import com.gardenmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for garden plot business logic.
 */
@Service
@RequiredArgsConstructor
public class PlotService {

    private final PlotRepository plotRepository;
    private final UserRepository userRepository;

    public List<PlotDTO> getAllPlots() {
        return plotRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PlotDTO getPlotById(Long id) {
        GardenPlot plot = plotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GardenPlot", "id", id));
        return toDTO(plot);
    }

    public PlotDTO createPlot(PlotDTO dto) {
        if (plotRepository.existsByPlotNumber(dto.getPlotNumber())) {
            throw new IllegalArgumentException("Plot number '" + dto.getPlotNumber() + "' already exists");
        }
        GardenPlot plot = toEntity(dto);
        return toDTO(plotRepository.save(plot));
    }

    public PlotDTO updatePlot(Long id, PlotDTO dto) {
        GardenPlot existing = plotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GardenPlot", "id", id));

        existing.setPlotNumber(dto.getPlotNumber());
        existing.setSize(dto.getSize());
        existing.setStatus(GardenPlot.PlotStatus.valueOf(dto.getStatus().toUpperCase()));

        if (dto.getAssignedUserId() != null) {
            User user = userRepository.findById(dto.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getAssignedUserId()));
            existing.setAssignedUser(user);
        } else {
            existing.setAssignedUser(null);
        }

        return toDTO(plotRepository.save(existing));
    }

    public void deletePlot(Long id) {
        if (!plotRepository.existsById(id)) {
            throw new ResourceNotFoundException("GardenPlot", "id", id);
        }
        plotRepository.deleteById(id);
    }

    public List<PlotDTO> getAvailablePlots() {
        return plotRepository.findByStatus(GardenPlot.PlotStatus.AVAILABLE).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PlotDTO> searchPlots(String keyword) {
        return plotRepository.searchPlots(keyword).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─── Mappers ────────────────────────────────────────────────────────────────

    private PlotDTO toDTO(GardenPlot plot) {
        PlotDTO dto = new PlotDTO();
        dto.setId(plot.getId());
        dto.setPlotNumber(plot.getPlotNumber());
        dto.setSize(plot.getSize());
        dto.setStatus(plot.getStatus().name());
        if (plot.getAssignedUser() != null) {
            dto.setAssignedUserId(plot.getAssignedUser().getId());
            dto.setAssignedUserName(plot.getAssignedUser().getName());
        }
        return dto;
    }

    private GardenPlot toEntity(PlotDTO dto) {
        GardenPlot plot = new GardenPlot();
        plot.setPlotNumber(dto.getPlotNumber());
        plot.setSize(dto.getSize());
        plot.setStatus(dto.getStatus() != null
                ? GardenPlot.PlotStatus.valueOf(dto.getStatus().toUpperCase())
                : GardenPlot.PlotStatus.AVAILABLE);

        if (dto.getAssignedUserId() != null) {
            User user = userRepository.findById(dto.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getAssignedUserId()));
            plot.setAssignedUser(user);
        }
        return plot;
    }
}
