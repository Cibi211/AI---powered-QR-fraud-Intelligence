package com.qrfraud.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.qrfraud.backend.service.RiskAnalysisService;
import com.qrfraud.backend.dto.ScanRequest;
import com.qrfraud.backend.dto.ScanResponse;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ScanController {

    private final RiskAnalysisService service;

    public ScanController(RiskAnalysisService service) {
        this.service = service;
    }

    @PostMapping("/scan")
    public ScanResponse analyze(@RequestBody ScanRequest request) {

        int score = service.calculateRisk(request.getQrContent());
        String level = service.riskLevel(score);
        List<String> reasons = service.generateReasons(request.getQrContent());

        return new ScanResponse(score, level, reasons);
    }
    @PostMapping("/upload")
public ScanResponse uploadImage(@RequestParam("file") MultipartFile file) {

    if (file.isEmpty()) {
        return new ScanResponse(0, "LOW", List.of("Empty file uploaded"));
    }

    try {
        // 🔹 For now simulate extracted QR content
        String extractedContent = "upi://pay?offer=job refund";

        int score = service.calculateRisk(extractedContent);
        String level = service.riskLevel(score);
        List<String> reasons = service.generateReasons(extractedContent);

        return new ScanResponse(score, level, reasons);

    } catch (Exception e) {
        return new ScanResponse(0, "LOW", List.of("Upload failed"));
    }
}
}
