package de.tum.cit.ase.tease.controller;

import de.tum.cit.ase.tease.model.Allocation;
import de.tum.cit.ase.tease.model.CollaborationData;
import de.tum.cit.ase.tease.model.Constraint;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class TeaseController {
    private final Map<String, List<Allocation>> allocationsMapping = new HashMap<>();
    private final Map<String, List<List<String>>> lockedStudentsMapping = new HashMap<>();
    private final Map<String, List<Constraint>> constraintsMapping = new HashMap<>();

    @MessageMapping("/course-iteration/{courseIterationId}/allocations")
    @SendTo("/topic/course-iteration/{courseIterationId}/allocations")
    public List<Allocation> updateAllocations(@DestinationVariable String courseIterationId, List<Allocation> allocations) {
        this.allocationsMapping.put(courseIterationId, allocations);
        return allocations;
    }

    @MessageMapping("/course-iteration/{courseIterationId}/lockedStudents")
    @SendTo("/topic/course-iteration/{courseIterationId}/lockedStudents")
    public List<List<String>> updateLockedStudents(@DestinationVariable String courseIterationId, List<List<String>> lockedStudents) {
        this.lockedStudentsMapping.put(courseIterationId, lockedStudents);
        return lockedStudents;
    }

    @MessageMapping("/course-iteration/{courseIterationId}/constraints")
    @SendTo("/topic/course-iteration/{courseIterationId}/constraints")
    public List<Constraint> updateConstraints(@DestinationVariable String courseIterationId, List<Constraint> constraints) {
        this.constraintsMapping.put(courseIterationId, constraints);
        return constraints;
    }

    @MessageMapping("/course-iteration/{courseIterationId}/discovery")
    @SendTo("/topic/course-iteration/{courseIterationId}/discovery")
    public CollaborationData collaborationData(@DestinationVariable String courseIterationId) {
        var allocations = this.allocationsMapping.get(courseIterationId);
        var lockedStudents = this.lockedStudentsMapping.get(courseIterationId);
        var constraints = this.constraintsMapping.get(courseIterationId);
        return new CollaborationData(allocations, constraints, lockedStudents);
    }
}
