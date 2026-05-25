package com.gardenmanagement.service;

import com.gardenmanagement.entity.User;
import com.gardenmanagement.exception.ResourceNotFoundException;
import com.gardenmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

/**
 * Service for member management (admin-only operations).
 */
@Service
@RequiredArgsConstructor
public class MemberService {

    private final UserRepository userRepository;

    /**
     * Returns a sanitized list of all members (no passwords).
     */
    public List<Map<String, Object>> getAllMembers() {
        return userRepository.findAll().stream()
                .map(this::toSafeMap)
                .toList();
    }

    /**
     * Returns a single member by ID (no password).
     */
    public Map<String, Object> getMemberById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return toSafeMap(user);
    }

    /**
     * Deletes a member by ID.
     */
    public void deleteMember(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }

    // ─── Helper: strip password from user response ───────────────────────────────

    private Map<String, Object> toSafeMap(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole().name());
        return map;
    }
}
