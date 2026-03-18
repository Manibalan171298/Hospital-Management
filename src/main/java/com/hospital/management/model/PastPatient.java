package com.hospital.management.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "past_patients_record")
public class PastPatient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Fields from Patient
    private Long originalPatientId; // To track reference
    private String name;
    private int age;
    private String gender;
    private String disease;
    private String contactNumber;
    private String status;

    private LocalDateTime movedAt; // Timestamp for when it was moved

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOriginalPatientId() {
        return originalPatientId;
    }

    public void setOriginalPatientId(Long originalPatientId) {
        this.originalPatientId = originalPatientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getMovedAt() {
        return movedAt;
    }

    public void setMovedAt(LocalDateTime movedAt) {
        this.movedAt = movedAt;
    }
}
