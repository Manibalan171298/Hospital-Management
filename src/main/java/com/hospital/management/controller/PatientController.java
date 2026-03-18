package com.hospital.management.controller;

import com.hospital.management.model.Patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private com.hospital.management.service.PatientService patientService;

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    // 🔍 SEARCH patients by name
    @GetMapping("/search")
    public List<Patient> searchPatients(@RequestParam String name) {
        return patientService.searchPatients(name);
    }

    @GetMapping("/history")
    public List<com.hospital.management.model.PastPatient> getPastPatients() {
        return patientService.getPastPatients();
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientService.createPatient(patient);
    }

    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
    }
}
