package com.qrfraud.backend.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.qrfraud.backend.service.RiskAnalysisService;
import com.qrfraud.backend.dto.ScanRequest;
import com.qrfraud.backend.dto.ScanResponse;
import com.qrfraud.backend.repository.MultipartInputStreamFileResource;

import java.io.File;
import java.util.List;
import java.util.Map;

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
//     @PostMapping("/upload")
// public ScanResponse uploadImage(@RequestParam("file") MultipartFile file) {

//     if (file.isEmpty()) {
//         return new ScanResponse(0, "LOW", List.of("Empty file uploaded"));
//     }

//     try {
//         // 🔹 For now simulate extracted QR content
//         String extractedContent = "upi://pay?offer=job refund";

//         int score = service.calculateRisk(extractedContent);
//         String level = service.riskLevel(score);
//         List<String> reasons = service.generateReasons(extractedContent);

//         return new ScanResponse(score, level, reasons);

//     } catch (Exception e) {
//         return new ScanResponse(0, "LOW", List.of("Upload failed"));
//     }
// }
// }
@PostMapping("/upload")
public ScanResponse uploadImage(@RequestParam("file") MultipartFile file) {

    try {

        RestTemplate restTemplate = new RestTemplate();

        String pythonUrl = "http://127.0.0.1:8000/scan_and_analyze";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(pythonUrl, requestEntity, Map.class);

        Map analysis = (Map) response.getBody().get("analysis");

        int score = (int) analysis.get("risk_score");
        String level = (String) analysis.get("risk_level");

        // List<String> reasons = (List<String>) analysis.get("explanations");
        List<Map<String, Object>> explanations =
        (List<Map<String, Object>>) analysis.get("explanations");

List<String> reasons = explanations.stream()
        .map(e -> (String) e.get("reason"))
        .toList();

        service.saveScan("QR_DATA", score, level, reasons, file.getOriginalFilename());

        return new ScanResponse(score, level, reasons);

    } catch (Exception e) {

        e.printStackTrace();
        return new ScanResponse(0, "LOW", List.of("Analysis failed"));

    }
}
}
