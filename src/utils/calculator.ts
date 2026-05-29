/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CABLE_TABLE,
  CableData,
  Module1State,
  Module2State,
  Module3State,
  Module4State,
  SOLAR_PANELS
} from "../types";

// Helper for Trigonometric transformations
export function cosToTan(cosphi: number): number {
  if (cosphi <= 0 || cosphi > 1) return 0;
  const sinphi = Math.sqrt(1 - cosphi * cosphi);
  return sinphi / cosphi;
}

export function cosToSin(cosphi: number): number {
  if (cosphi < 0 || cosphi > 1) return 0;
  return Math.sqrt(1 - cosphi * cosphi);
}

// ==========================================
// MODULE 1 — CALCULATORS
// ==========================================
export interface Module1Results {
  avgCurrent: number; // A
  activePowerKw: number; // kW
  apparentPowerKva: number; // kVA
  reactivePowerKvar: number; // kVAr
  powerFactor: number;
  transformerLoadPercent: number; // %
  loadAlertColor: "emerald" | "amber" | "rose";
  loadText: string;
}

export function calculateModule1(inputs: Module1State): Module1Results {
  const { voltage, currentR, currentS, currentT, cosphi, transformerKva } = inputs;
  
  const avgCurrent = (currentR + currentS + currentT) / 3;
  
  // P = sqrt(3) * U * I_avg * cosphi / 1000
  const activePowerKw = (Math.sqrt(3) * voltage * avgCurrent * cosphi) / 1000;
  
  // S = sqrt(3) * U * I_avg / 1000
  const apparentPowerKva = (Math.sqrt(3) * voltage * avgCurrent) / 1000;
  
  // Q = sqrt(3) * U * I_avg * sinphi / 1000
  const sinphi = cosToSin(cosphi);
  const reactivePowerKvar = (Math.sqrt(3) * voltage * avgCurrent * sinphi) / 1000;
  
  const transformerLoadPercent = transformerKva > 0 ? (apparentPowerKva / transformerKva) * 100 : 0;
  
  let loadAlertColor: "emerald" | "amber" | "rose" = "emerald";
  let loadText = "An toàn (Normal)";
  if (transformerLoadPercent > 95) {
    loadAlertColor = "rose";
    loadText = "Quá tải nghiêm trọng (Overload!)";
  } else if (transformerLoadPercent > 80) {
    loadAlertColor = "amber";
    loadText = "Cận tải cao (High Load Warning)";
  }

  return {
    avgCurrent,
    activePowerKw,
    apparentPowerKva,
    reactivePowerKvar,
    powerFactor: cosphi,
    transformerLoadPercent,
    loadAlertColor,
    loadText
  };
}

// Real-time quick translation lookup tables
export function getAmpereToKwTable(voltage: number, cosphi: number) {
  const standardAmps = [100, 200, 400, 800, 1600];
  return standardAmps.map((amp) => {
    const kw = (Math.sqrt(3) * voltage * amp * cosphi) / 1000;
    const kva = (Math.sqrt(3) * voltage * amp) / 1000;
    return {
      amp,
      kw: Number(kw.toFixed(1)),
      kva: Number(kva.toFixed(1))
    };
  });
}

// ==========================================
// MODULE 2 — PF CORRECTION CAPACITOR (TỤ BÙ)
// ==========================================
export interface Module2Results {
  requiredKvar: number; // Qb required
  recommendedStepCount: number; // Number of steps
  actualCompKvar: number; // Actual compensation kVAr
  ckRatio: number; // C/K parameter for controller
  underCompensatedPf: number;
  compensatedPf: number;
  status: "thiếu" | "đủ" | "dư";
  stepsText: string;
  hasOvercompensationRisk: boolean; // True if Qb > load kW * 0.8 (at low load) or cosphi2 is > 0.98.
}

export function calculateModule2(inputs: Module2State): Module2Results {
  const { loadKw, currentPf, targetPf, voltage, ctRatioPrimary, ctRatioSecondary, selectedStepSize } = inputs;
  
  if (currentPf >= targetPf) {
    return {
      requiredKvar: 0,
      recommendedStepCount: 0,
      actualCompKvar: 0,
      ckRatio: 0,
      underCompensatedPf: currentPf,
      compensatedPf: currentPf,
      status: "đủ",
      stepsText: "Không cần bù thêm (PF hiện tại tốt hơn mục tiêu)",
      hasOvercompensationRisk: false
    };
  }

  const tanphi1 = cosToTan(currentPf);
  const tanphi2 = cosToTan(targetPf);
  
  // Qb = P * (tanphi1 - tanphi2)
  const requiredKvar = loadKw * (tanphi1 - tanphi2);
  
  // Number of steps
  let recommendedStepCount = 1;
  if (requiredKvar > 0 && selectedStepSize > 0) {
    recommendedStepCount = Math.ceil(requiredKvar / selectedStepSize);
  }
  
  const actualCompKvar = recommendedStepCount * selectedStepSize;
  
  // C/K Ratio Formula:
  // Ic1 = Q_step / (sqrt(3) * U) where U is Line voltage
  // CT_ratio = Primary / Secondary
  // C/K = Ic1 / CT_ratio
  const ctRatio = ctRatioSecondary > 0 ? ctRatioPrimary / ctRatioSecondary : 1;
  const ic1 = (selectedStepSize * 1000) / (Math.sqrt(3) * voltage);
  const ckRatio = ic1 / ctRatio;
  
  // Compensated PF calculation
  // tanCompensated = tanphi1 - (actualCompKvar / P)
  const tanComp = tanphi1 - (actualCompKvar / (loadKw || 1));
  const activeTanComp = Math.max(0, tanComp);
  const compensatedPf = 1 / Math.sqrt(1 + activeTanComp * activeTanComp);
  
  let status: "thiếu" | "đủ" | "dư" = "đủ";
  if (compensatedPf < targetPf) {
    status = "thiếu";
  } else if (compensatedPf > 0.985 && actualCompKvar > loadKw * 0.9) {
    status = "dư";
  }

  const stepsText = `${recommendedStepCount} cấp × ${selectedStepSize} kVAr`;
  const hasOvercompensationRisk = targetPf > 0.97 || actualCompKvar > loadKw * 0.85;

  return {
    requiredKvar,
    recommendedStepCount,
    actualCompKvar,
    ckRatio,
    underCompensatedPf: currentPf,
    compensatedPf,
    status,
    stepsText,
    hasOvercompensationRisk
  };
}

// ==========================================
// MODULE 3 — SOLAR ROOFTOP ZERO EXPORT & PAYBACK
// ==========================================
export interface Module3Results {
  recSolarPowerKwp: number; // recommended PV capacity
  inverterPowerKw: number; // AC inverter recommendation
  dcKwp: number; // Max DC Panel capacity
  dcToAcRatio: number;
  generationDailyKwh: number;
  generationYearlyKwh: number;
  annualElectricitySavedVnd: number;
  capitalCostVnd: number;
  paybackPeriodYears: number;
  isTransformerOverloaded: boolean;
  hasEvnFeedinRisk: boolean;
  lowPfRiskAfterSolar: boolean; // highly likely for solar bám tải
  selectedPanel: any; // SolarPanelData
}

export function calculateModule3(inputs: Module3State, module1AvgKva?: number, currentPf?: number): Module3Results {
  const {
    daytimeAvgLoadKw,
    daytimeMinLoadKw,
    roofAreaSqM,
    hasZeroExport,
    electricityRateVnd,
    installationCostPerKwpVnd,
    selectedPanelId
  } = inputs;

  // Retrieve selected panel or default to JA Solar 630W
  const panel = SOLAR_PANELS.find(p => p.id === selectedPanelId) || SOLAR_PANELS[0];

  // 1. Area limitation based on exact physical dimensions of the selected panel:
  // Maximum panels fitting = roofAreaSqM / panel.area
  // Limit capacity (kWp) = (panels count) * panel.powerWp / 1000
  const areaLimitKwp = (roofAreaSqM / panel.area) * (panel.powerWp / 1000);

  // 2. Load limitation: For zero export, capacity should be sized strictly under average/minimum daytime load 
  // to prevent heavy clipping or zero-export control shutting down the inverters.
  const loadLimitKwp = hasZeroExport ? daytimeMinLoadKw * 0.8 : daytimeAvgLoadKw * 1.2;

  // Recommended Solar PV system capacity
  const recSolarPowerKwp = Math.max(5, Math.min(areaLimitKwp, loadLimitKwp));
  
  const inverterPowerKw = recSolarPowerKwp / 1.15; // standard ~1.15 DC/AC loading ratio
  const dcKwp = recSolarPowerKwp;
  const dcToAcRatio = 1.15;

  // Daily generation: 4 hours of peak direct sunlight average in VN (PSH average)
  const generationDailyKwh = recSolarPowerKwp * 4.0;
  
  // Annual production taking wiring, dust, degradation losses into account (appx 10% safety margin)
  const generationYearlyKwh = generationDailyKwh * 365 * 0.92;

  const annualElectricitySavedVnd = generationYearlyKwh * electricityRateVnd;
  const capitalCostVnd = recSolarPowerKwp * installationCostPerKwpVnd;
  
  const paybackPeriodYears = annualElectricitySavedVnd > 0 ? (capitalCostVnd / annualElectricitySavedVnd) : 0;

  // Engineering Warnings:
  const isTransformerOverloaded = module1AvgKva ? module1AvgKva > 1000 : false;
  
  // Feed-in risk to EVN occurs if zero-export is disabled and generation peak can exceed minimum loads
  const hasEvnFeedinRisk = !hasZeroExport && (recSolarPowerKwp > daytimeMinLoadKw);

  // Solar supply active power, which reduces grid active load. 
  // But inductive reactive power from factories remains constant, so Grid Power Factor drops heavily.
  const lowPfRiskAfterSolar = recSolarPowerKwp > daytimeAvgLoadKw * 0.3;

  return {
    recSolarPowerKwp,
    inverterPowerKw,
    dcKwp,
    dcToAcRatio,
    generationDailyKwh,
    generationYearlyKwh,
    annualElectricitySavedVnd,
    capitalCostVnd,
    paybackPeriodYears,
    isTransformerOverloaded,
    hasEvnFeedinRisk,
    lowPfRiskAfterSolar,
    selectedPanel: panel
  };
}

// Generate real-time 24-Hour curve for interactive Chart.js load vs solar chart
export function generateLoadSolarCurves(inputs: Module3State) {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  
  // Base hourly load profiles (Vietnamese factory typical profile starting at 08h-17h peak)
  const baseLoadProfile = [
    0.3, 0.3, 0.28, 0.28, 0.3, 0.4, 0.6, 0.8, // 0 - 7h
    1.0, 1.0, 0.95, 0.9, 0.6, 0.95, 1.0, 0.98, // 8 - 15h
    0.9, 0.85, 0.7, 0.5, 0.4, 0.35, 0.32, 0.3  // 16 - 23h
  ];

  // Solar bell curve layout peaking at 12h
  const solarGenProfile = [
    0, 0, 0, 0, 0, 0, 0.05, 0.2, // 0 - 7h
    0.45, 0.75, 0.92, 0.98, 1.0, 0.96, 0.85, 0.6, // 8 - 15h
    0.3, 0.1, 0, 0, 0, 0, 0, 0  // 16 - 23h
  ];

  const peakDaytimeAvg = inputs.daytimeAvgLoadKw; // baseline kW
  const solarScale = inputs.daytimeMinLoadKw * 0.8; // default recommended solar capacity
  
  const records = hours.map((hour, idx) => {
    // scale load
    const loadKw = baseLoadProfile[idx] * peakDaytimeAvg;
    // scale solar
    const rawSolar = solarGenProfile[idx] * solarScale;
    
    // If Zero Export is on, solar generation must be clipped to not exceed the load
    let solarGeneratedKw = rawSolar;
    let clippedKw = 0;
    if (inputs.hasZeroExport && rawSolar > loadKw) {
      solarGeneratedKw = loadKw;
      clippedKw = rawSolar - loadKw;
    }

    const gridImportKw = Math.max(0, loadKw - solarGeneratedKw);

    return {
      hour,
      loadKw: Number(loadKw.toFixed(1)),
      solarGenKw: Number(rawSolar.toFixed(1)),
      actualSolarUsedKw: Number(solarGeneratedKw.toFixed(1)),
      clippedKw: Number(clippedKw.toFixed(1)),
      gridImportKw: Number(gridImportKw.toFixed(1))
    };
  });

  return records;
}

// ==========================================
// MODULE 4 — CABLE SIZING & VOLTAGE DROP
// ==========================================
export interface CableResult {
  sizeMm2: number;
  ampacityMatched: number;
  resistanceOhmKm: number;
  voltageDropVolts: number;
  voltageDropPercent: number;
  isPassed: boolean;
  powerLossKw: number;
  recommendationText: string;
}

export function calculateCable(inputs: Module4State): CableResult {
  const {
    loadKw,
    currentA,
    cableLength,
    cableMaterial,
    installationMethod,
    ambientTemp,
    allowableDropPercent,
    cosphi,
    voltage
  } = inputs;

  // 1. Determine Current
  let designCurrent = currentA;
  if (!designCurrent || designCurrent <= 0) {
    // P = sqrt(3) * U * I * cosphi -> I = P * 1000 / (sqrt(3) * U * cosphi)
    designCurrent = (loadKw * 1000) / (Math.sqrt(3) * voltage * cosphi);
  }

  // 2. Temp correction factor (standard IEC 60364-5-52)
  // Base rating is around 30°C. For hotter rooms in factories:
  let kTemp = 1.0;
  if (ambientTemp > 30) {
    if (ambientTemp <= 35) kTemp = 0.94;
    else if (ambientTemp <= 40) kTemp = 0.87;
    else if (ambientTemp <= 45) kTemp = 0.79;
    else if (ambientTemp <= 50) kTemp = 0.71;
    else kTemp = 0.58;
  }

  // Iterating through sizes to find the smallest compliance cable
  let matchedCable: CableData | null = null;
  let finalDropPct = 0;
  let finalDropV = 0;
  let isPassed = false;
  let ampacityMatched = 0;
  let resistanceOhmKm = 0;
  let xlOhmKm = 0;
  let powerLossKw = 0;

  for (let i = 0; i < CABLE_TABLE.length; i++) {
    const cable = CABLE_TABLE[i];
    const baseAmp = cableMaterial === "copper" ? cable.ampacityCu : cable.ampacityAl;
    
    if (baseAmp === 0) continue; // safety for copper-only sizes for aluminium

    const correctedAmp = baseAmp * kTemp;

    // Check ampacity first
    if (correctedAmp >= designCurrent) {
      // Calculate voltage drop for this size
      const R = cableMaterial === "copper" ? cable.rCu : cable.rAl;
      const X = cable.x;
      const cos = cosphi;
      const sin = cosToSin(cosphi);

      // Delta U = sqrt(3) * I * L * (R*cos + X*sin) / 1000
      const deltaU = (Math.sqrt(3) * designCurrent * cableLength * (R * cos + X * sin)) / 1000;
      const dropPct = (deltaU / voltage) * 100;

      if (dropPct <= allowableDropPercent) {
        matchedCable = cable;
        ampacityMatched = correctedAmp;
        finalDropV = deltaU;
        finalDropPct = dropPct;
        resistanceOhmKm = R;
        xlOhmKm = X;
        isPassed = true;
        // P_loss = 3 * I^2 * R * L / 1000
        powerLossKw = (3 * Math.pow(designCurrent, 2) * R * (cableLength / 1000)) / 1000;
        break;
      }
    }
  }

  // Fallback if no matching cable meets voltage drop or ampacity
  if (!matchedCable) {
    const cable = CABLE_TABLE[CABLE_TABLE.length - 1];
    const R = cableMaterial === "copper" ? cable.rCu : cable.rAl;
    const deltaU = (Math.sqrt(3) * designCurrent * cableLength * (R * cosphi + cable.x * cosToSin(cosphi))) / 1000;
    
    return {
      sizeMm2: cable.size,
      ampacityMatched: (cableMaterial === "copper" ? cable.ampacityCu : cable.ampacityAl) * kTemp,
      resistanceOhmKm: R,
      voltageDropVolts: deltaU,
      voltageDropPercent: (deltaU / voltage) * 100,
      isPassed: false,
      powerLossKw: (3 * Math.pow(designCurrent, 2) * R * (cableLength / 1000)) / 1000,
      recommendationText: `Cáp lớn nhất (${cable.size} mm²) vẫn không đạt sụt áp ${allowableDropPercent}% hoặc quá tải dòng. Hãy chạy dây song song (Multi-core) hoặc tăng cấp điện áp.`
    };
  }

  const recText = `Sợi cáp ${cableMaterial === "copper" ? "Đồng" : "Nhôm"} XLPE SINGLE-CORE cỡ **${matchedCable.size} mm²** đáp ứng tốt khả năng truyền dẫn điện dòng liên tục ${designCurrent.toFixed(1)}A (hiệu chỉnh nhiệt độ ${ambientTemp}°C) và sụt áp ${finalDropPct.toFixed(2)}% (thấp hơn giới hạn cho phép ${allowableDropPercent}%).`;

  return {
    sizeMm2: matchedCable.size,
    ampacityMatched,
    resistanceOhmKm,
    voltageDropVolts: finalDropV,
    voltageDropPercent: finalDropPct,
    isPassed,
    powerLossKw,
    recommendationText: recText
  };
}
