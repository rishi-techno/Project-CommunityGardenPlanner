package com.gardenmanagement.service;

import com.gardenmanagement.dto.EventDTO;
import com.gardenmanagement.entity.Event;
import com.gardenmanagement.exception.ResourceNotFoundException;
import com.gardenmanagement.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for event management business logic.
 */
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        return toDTO(event);
    }

    public EventDTO createEvent(EventDTO dto) {
        Event event = Event.builder()
                .eventName(dto.getEventName())
                .description(dto.getDescription())
                .eventDate(dto.getEventDate())
                .location(dto.getLocation())
                .build();
        return toDTO(eventRepository.save(event));
    }

    public EventDTO updateEvent(Long id, EventDTO dto) {
        Event existing = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));

        existing.setEventName(dto.getEventName());
        existing.setDescription(dto.getDescription());
        existing.setEventDate(dto.getEventDate());
        existing.setLocation(dto.getLocation());

        return toDTO(eventRepository.save(existing));
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event", "id", id);
        }
        eventRepository.deleteById(id);
    }

    public List<EventDTO> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(LocalDateTime.now()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─── Mapper ─────────────────────────────────────────────────────────────────

    private EventDTO toDTO(Event event) {
        return EventDTO.builder()
                .id(event.getId())
                .eventName(event.getEventName())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .build();
    }
}
