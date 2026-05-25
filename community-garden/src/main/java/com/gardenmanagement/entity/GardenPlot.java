package com.gardenmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

/**
 * GardenPlot entity representing a physical garden plot in the community garden.
 */
@Entity
@Table(name = "garden_plots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GardenPlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String plotNumber;

    @NotBlank
    @Column(nullable = false)
    private String size; // e.g., "10x10", "5x5"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlotStatus status;

    // Many plots can be assigned to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_user_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User assignedUser;

    // One plot can have multiple plants
    @OneToMany(mappedBy = "plot", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Plant> plants;

    // One plot can have multiple watering schedules
    @OneToMany(mappedBy = "plot", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<WateringSchedule> wateringSchedules;

    public enum PlotStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE
    }
}
