package com.qrfraud.backend.dto;

import java.util.List;

public class ScanResponse {

    private int riskScore;
    private String riskLevel;
    private List<String> reasons;
    private String decodedData;

    public ScanResponse(int riskScore, String riskLevel, List<String> reasons) {
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.reasons = reasons;
        // this.decodedData = decodedData;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public List<String> getReasons() {
        return reasons;
    }
//     public String getDecodedData() {
//     return decodedData;
// }
}