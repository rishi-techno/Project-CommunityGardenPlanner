package com.gardenmanagement.repository;

import com.gardenmanagement.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Event entity with custom queries.
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find upcoming events (after current time)
    @Query("SELECT e FROM Event e WHERE e.eventDate > :now ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents(@Param("now") LocalDateTime now);

    // Find events by location
    List<Event> findByLocationContainingIgnoreCase(String location);

    // Find events within a date range
    @Query("SELECT e FROM Event e WHERE e.eventDate BETWEEN :startDate AND :endDate ORDER BY e.eventDate ASC")
    List<Event> findEventsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);

    // Search events by name
    @Query("SELECT e FROM Event e WHERE LOWER(e.eventName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Event> searchByName(@Param("keyword") String keyword);
}
