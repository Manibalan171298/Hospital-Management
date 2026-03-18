package com.hospital.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hospital.management.model.PastPatient;

public interface PastPatientRepository extends JpaRepository<PastPatient, Long> {
}
