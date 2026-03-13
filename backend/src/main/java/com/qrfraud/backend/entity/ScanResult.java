// package com.qrfraud.backend.entity;

// import jakarta.persistence.*;

// @Entity
// public class ScanResult {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String qrContent;

//     private int riskScore;

//     private String riskLevel;

//     public ScanResult() {
//     }

//     public Long getId() {
//         return id;
//     }

//     public String getQrContent() {
//         return qrContent;
//     }

//     public void setQrContent(String qrContent) {
//         this.qrContent = qrContent;
//     }

//     public int getRiskScore() {
//         return riskScore;
//     }

//     public void setRiskScore(int riskScore) {
//         this.riskScore = riskScore;
//     }

//     public String getRiskLevel() {
//         return riskLevel;
//     }

//     public void setRiskLevel(String riskLevel) {
//         this.riskLevel = riskLevel;
//     }
// }
package com.qrfraud.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ScanResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String qrContent;

    private int riskScore;

    private String riskLevel;

    @Column(length = 1000)
    private String reasons;

    private String imagePath;

    private LocalDateTime scannedAt;

    public ScanResult() {}

    public ScanResult(String qrContent, int riskScore, String riskLevel, String reasons, String imagePath) {
        this.qrContent = qrContent;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.reasons = reasons;
        this.imagePath = imagePath;
        this.scannedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQrContent() {
        return qrContent;
    }

    public void setQrContent(String qrContent) {
        this.qrContent = qrContent;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getReasons() {
        return reasons;
    }

    public void setReasons(String reasons) {
        this.reasons = reasons;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public LocalDateTime getScannedAt() {
        return scannedAt;
    }

    public void setScannedAt(LocalDateTime scannedAt) {
        this.scannedAt = scannedAt;
    }

    
}