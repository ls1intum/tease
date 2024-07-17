package de.tum.cit.ase.tease.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Constraint {
    @JsonProperty("isActive")
    private Boolean isActive;
    private String id;
    private List<String> projectIds;
    private Threshold threshold;
    private ConstraintFunction constraintFunction;

    public Constraint(Boolean isActive, String id, List<String> projectIds, Threshold threshold, ConstraintFunction constraintFunction) {
        this.isActive = isActive;
        this.id = id;
        this.projectIds = projectIds;
        this.threshold = threshold;
        this.constraintFunction = constraintFunction;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public String getId() {
        return id;
    }

    public List<String> getProjectIds() {
        return projectIds;
    }

    public Threshold getThreshold() {
        return threshold;
    }

    public ConstraintFunction getConstraintFunction() {
        return constraintFunction;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }


    public void setId(String id) {
        this.id = id;
    }

    public void setProjectIds(List<String> projectIds) {
        this.projectIds = projectIds;
    }

    public void setThreshold(Threshold threshold) {
        this.threshold = threshold;
    }

    public void setConstraintFunction(ConstraintFunction constraintFunction) {
        this.constraintFunction = constraintFunction;
    }
}
