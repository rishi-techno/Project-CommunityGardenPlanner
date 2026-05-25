package com.gardenmanagement.repository;

import com.gardenmanagement.entity.GardenPlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for GardenPlot entity with custom queries.
 */
@Repository
public interface PlotRepository extends JpaRepository<GardenPlot, Long> {

    Optional<GardenPlot> findByPlotNumber(String plotNumber);

    boolean existsByPlotNumber(String plotNumber);

    // Find all available plots
    List<GardenPlot> findByStatus(GardenPlot.PlotStatus status);

    // Find plots assigned to a specific user
    List<GardenPlot> findByAssignedUserId(Long userId);

    // Search plots by plot number or size (case-insensitive)
    @Query("SELECT p FROM GardenPlot p WHERE " +
           "LOWER(p.plotNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.size) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<GardenPlot> searchPlots(@Param("keyword") String keyword);

    // Count available plots
    @Query("SELECT COUNT(p) FROM GardenPlot p WHERE p.status = 'AVAILABLE'")
    long countAvailablePlots();
}
