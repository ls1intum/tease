package de.tum.cit.ase.tease.model;

public class Threshold {
    private Integer lowerBound;
    private Integer upperBound;

    public Threshold(Integer lowerBound, Integer upperBound) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
    }

    public Integer getLowerBound() {
        return lowerBound;
    }

    public Integer getUpperBound() {
        return upperBound;
    }

    public void setLowerBound(Integer lowerBound) {
        this.lowerBound = lowerBound;
    }

    public void setUpperBound(Integer upperBound) {
        this.upperBound = upperBound;
    }
}
