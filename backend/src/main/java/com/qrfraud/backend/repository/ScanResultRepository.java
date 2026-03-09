package com.qrfraud.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.qrfraud.backend.entity.ScanResult;

public interface ScanResultRepository extends JpaRepository<ScanResult, Long> {
}