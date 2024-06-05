package de.tum.cit.ase.tease.model;

import java.util.List;

public class Allocation {
    private String projectId;
    private List<String> students;

    public Allocation(String projectId, List<String> students) {
        this.projectId = projectId;
        this.students = students;
    }

    public String getProjectId() {
        return projectId;
    }

    public List<String> getStudents() {
        return students;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public void setStudents(List<String> students) {
        this.students = students;
    }
}
