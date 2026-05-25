package com.gardenmanagement.repository;

import com.gardenmanagement.entity.WateringSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for WateringSchedule entity with custom queries.
 */
@Repository
public interface WateringRepository extends JpaRepository<WateringSchedule, Long> {

    // Find all watering schedules for a specific plot
    List<WateringSchedule> findByPlotId(Long plotId);

    // Find upcoming (scheduled) waterings
    @Query("SELECT w FROM WateringSchedule w WHERE w.wateringDate >= :today AND w.status = 'SCHEDULED' ORDER BY w.wateringDate ASC, w.wateringTime ASC")
    List<WateringSchedule> findUpcomingScheduled(@Param("today") LocalDate today);

    // Find watering schedules by status
    List<WateringSchedule> findByStatus(WateringSchedule.WateringStatus status);

    // Find waterings by date
    List<WateringSchedule> findByWateringDate(LocalDate wateringDate);
}
