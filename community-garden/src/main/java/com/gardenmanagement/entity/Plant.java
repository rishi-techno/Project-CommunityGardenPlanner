package com.gardenmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

/**
 * Plant entity representing a plant growing in a garden plot.
 */
@Entity
@Table(name = "plants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String plantName;

    @NotBlank
    @Column(nullable = false)
    private String category; // e.g., Vegetable, Fruit, Herb, Flower

    @NotNull
    @Column(nullable = false)
    private LocalDate plantingDate;

    private LocalDate harvestDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrowthStatus growthStatus;

    // Many plants belong to one plot
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plot_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private GardenPlot plot;

    public enum GrowthStatus {
        SEEDLING, GROWING, MATURE, HARVESTED, DEAD
    }
}
