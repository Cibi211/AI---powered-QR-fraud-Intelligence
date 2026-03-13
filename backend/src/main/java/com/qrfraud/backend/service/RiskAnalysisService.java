package com.qrfraud.backend.service;

import org.springframework.stereotype.Service;
import com.qrfraud.backend.repository.ScanResultRepository;
import com.qrfraud.backend.entity.ScanResult;

import java.util.List;

@Service
public class RiskAnalysisService {

    private final ScanResultRepository repository;

    public RiskAnalysisService(ScanResultRepository repository) {
        this.repository = repository;
    }

    public int calculateRisk(String content) {

        int score = 0;

        if(content.contains("refund") || content.contains("reward"))
            score += 40;

        if(content.contains("login") || content.contains("verify"))
            score += 30;

        if(content.contains("upi://"))
            score += 20;

        return score;
    }

    public String riskLevel(int score) {

        if(score >= 70) return "HIGH";
        if(score >= 40) return "MEDIUM";
        return "LOW";
    }

    public List<String> generateReasons(String content) {

        if(content.contains("refund"))
            return List.of("Suspicious refund scam detected");

        if(content.contains("login"))
            return List.of("Phishing login detected");

        return List.of("No major threats detected");
    }

    public void saveScan(String qrContent, int score, String level, List<String> reasons, String imagePath){

        ScanResult result = new ScanResult(
                qrContent,
                score,
                level,
                String.join(", ", reasons),
                imagePath
        );

        repository.save(result);
    }
}