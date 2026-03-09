package com.qrfraud.backend.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class RiskAnalysisService {

    public int calculateRisk(String qrContent) {

        int risk = 0;

        if (qrContent == null) return 0;

        String content = qrContent.toLowerCase();

        if (content.contains("refund")) risk += 30;
        if (content.contains("job")) risk += 25;
        if (content.contains("offer")) risk += 20;
        if (content.contains("upi://pay")) risk += 10;

        return Math.min(risk, 100);
    }

    public String riskLevel(int score) {

        if (score < 30) return "LOW";
        else if (score < 70) return "MEDIUM";
        else return "HIGH";
    }

    // 👇 THIS MUST BE INSIDE THE CLASS
    public List<String> generateReasons(String qrContent) {

        List<String> reasons = new ArrayList<>();

        if(qrContent == null) return reasons;

        String content = qrContent.toLowerCase();

        if(content.contains("refund"))
            reasons.add("Contains refund keyword");

        if(content.contains("job"))
            reasons.add("Contains job scam keyword");

        if(content.contains("offer"))
            reasons.add("Contains suspicious offer");

        if(content.contains("upi://pay"))
            reasons.add("UPI payment detected");

        return reasons;
    }
}