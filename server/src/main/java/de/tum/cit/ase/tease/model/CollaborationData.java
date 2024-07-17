package de.tum.cit.ase.tease.model;

import java.util.List;
import java.util.Map;

public class CollaborationData {
    private List<Allocation> allocations;
    private List<Constraint> constraints;
    private List<List<String>> lockedStudents;

    public CollaborationData(List<Allocation> allocations, List<Constraint> constraints, List<List<String>> lockedStudents) {
        this.allocations = allocations;
        this.constraints = constraints;
        this.lockedStudents = lockedStudents;
    }

    public List<Allocation> getAllocations() {
        return allocations;
    }

    public List<Constraint> getConstraints() {
        return constraints;
    }

    public List<List<String>> getLockedStudents() {
        return lockedStudents;
    }

    public void setAllocations(List<Allocation> allocations) {
        this.allocations = allocations;
    }

    public void setConstraints(List<Constraint> constraints) {
        this.constraints = constraints;
    }

    public void setLockedStudents(List<List<String>> lockedStudents) {
        this.lockedStudents = lockedStudents;
    }
}
