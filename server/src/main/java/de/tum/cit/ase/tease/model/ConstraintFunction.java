package de.tum.cit.ase.tease.model;

import java.util.List;

public class ConstraintFunction {
    private String description;
    private String operator;
    private String property;
    private String propertyId;
    private String value;
    private String valueId;
    private List<String> studentIds;

    public ConstraintFunction(String description, String operator, String property, String propertyId, String value, String valueId, List<String> students) {
        this.description = description;
        this.operator = operator;
        this.property = property;
        this.propertyId = propertyId;
        this.value = value;
        this.valueId = valueId;
        this.studentIds = students;
    }

    public String getDescription() {
        return description;
    }

    public String getOperator() {
        return operator;
    }

    public String getProperty() {
        return property;
    }

    public String getPropertyId() {
        return propertyId;
    }

    public String getValue() {
        return value;
    }

    public String getValueId() {
        return valueId;
    }

    public List<String> getStudentIds() {
        return studentIds;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public void setPropertyId(String propertyId) {
        this.propertyId = propertyId;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public void setValueId(String valueId) {
        this.valueId = valueId;
    }

    public void setStudentIds(List<String> studentIds) {
        this.studentIds = studentIds;
    }
}
