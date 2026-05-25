package com.gardenmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Event entity representing a community garden event (workshop, harvest day, etc.).
 */
@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String eventName;

    @Column(length = 1000)
    private String description;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime eventDate;

    @NotBlank
    @Column(nullable = false)
    private String location;
}
