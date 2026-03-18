package com.hospital.management.service;

import com.hospital.management.model.Patient;
import com.hospital.management.model.PastPatient;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.PastPatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PastPatientRepository pastPatientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public List<Patient> searchPatients(String name) {
        return patientRepository.findByNameContainingIgnoreCase(name);
    }

    public List<PastPatient> getPastPatients() {
        return pastPatientRepository.findAll();
    }

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Archive
        PastPatient past = new PastPatient();
        past.setOriginalPatientId(patient.getId());
        past.setName(patient.getName());
        past.setAge(patient.getAge());
        past.setGender(patient.getGender());
        past.setDisease(patient.getDisease());
        past.setContactNumber(patient.getContactNumber());
        past.setStatus(patient.getStatus());
        past.setMovedAt(java.time.LocalDateTime.now());

        pastPatientRepository.save(past);

        // Delete
        patientRepository.deleteById(id);
    }
}
