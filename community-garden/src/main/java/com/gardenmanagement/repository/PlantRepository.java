package com.gardenmanagement.repository;

import com.gardenmanagement.entity.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Plant entity with custom queries.
 */
@Repository
public interface PlantRepository extends JpaRepository<Plant, Long> {

    // Find all plants in a specific plot
    List<Plant> findByPlotId(Long plotId);

    // Filter plants by category (case-insensitive)
    @Query("SELECT p FROM Plant p WHERE LOWER(p.category) = LOWER(:category)")
    List<Plant> findByCategory(@Param("category") String category);

    // Filter plants by growth status
    List<Plant> findByGrowthStatus(Plant.GrowthStatus growthStatus);

    // Search plants by name
    @Query("SELECT p FROM Plant p WHERE LOWER(p.plantName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Plant> searchByName(@Param("name") String name);

    // Find plants ready to harvest
    @Query("SELECT p FROM Plant p WHERE p.growthStatus = 'MATURE'")
    List<Plant> findMaturePlants();
}
