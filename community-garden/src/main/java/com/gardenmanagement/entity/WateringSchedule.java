package com.gardenmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * WateringSchedule entity representing a scheduled or completed watering task for a plot.
 */
@Entity
@Table(name = "watering_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WateringSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private LocalDate wateringDate;

    @NotNull
    @Column(nullable = false)
    private LocalTime wateringTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WateringStatus status;

    @Column(length = 500)
    private String notes;

    // Many watering schedules belong to one plot
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plot_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private GardenPlot plot;

    public enum WateringStatus {
        SCHEDULED, COMPLETED, SKIPPED
    }
}
