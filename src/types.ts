/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CableData {
  size: number; // mm²
  ampacityCu: number; // Ampere in air/tray
  ampacityAl: number; // Ampere in air/tray
  rCu: number; // Resistance Ohm/km at 70°C
  rAl: number; // Resistance Ohm/km at 70°C
  x: number; // Reactance Ohm/km
}

export const CABLE_TABLE: CableData[] = [
  { size: 1.5, ampacityCu: 20, ampacityAl: 0, rCu: 14.8, rAl: 0, x: 0.101 },
  { size: 2.5, ampacityCu: 27, ampacityAl: 0, rCu: 8.91, rAl: 0, x: 0.095 },
  { size: 4, ampacityCu: 36, ampacityAl: 0, rCu: 5.57, rAl: 0, x: 0.09 },
  { size: 6, ampacityCu: 46, ampacityAl: 0, rCu: 3.71, rAl: 0, x: 0.085 },
  { size: 10, ampacityCu: 63, ampacityAl: 41, rCu: 2.21, rAl: 3.63, x: 0.08 },
  { size: 16, ampacityCu: 85, ampacityAl: 55, rCu: 1.38, rAl: 2.28, x: 0.08 },
  { size: 25, ampacityCu: 112, ampacityAl: 86, rCu: 0.87, rAl: 1.43, x: 0.08 },
  { size: 35, ampacityCu: 138, ampacityAl: 106, rCu: 0.62, rAl: 1.02, x: 0.075 },
  { size: 50, ampacityCu: 168, ampacityAl: 129, rCu: 0.46, rAl: 0.76, x: 0.075 },
  { size: 70, ampacityCu: 213, ampacityAl: 164, rCu: 0.32, rAl: 0.53, x: 0.075 },
  { size: 95, ampacityCu: 258, ampacityAl: 198, rCu: 0.23, rAl: 0.38, x: 0.075 },
  { size: 120, ampacityCu: 299, ampacityAl: 230, rCu: 0.18, rAl: 0.30, x: 0.075 },
  { size: 150, ampacityCu: 344, ampacityAl: 265, rCu: 0.15, rAl: 0.24, x: 0.075 },
  { size: 185, ampacityCu: 392, ampacityAl: 302, rCu: 0.12, rAl: 0.20, x: 0.075 },
  { size: 240, ampacityCu: 461, ampacityAl: 355, rCu: 0.09, rAl: 0.15, x: 0.075 },
  { size: 300, ampacityCu: 530, ampacityAl: 408, rCu: 0.07, rAl: 0.12, x: 0.075 },
  { size: 400, ampacityCu: 610, ampacityAl: 470, rCu: 0.05, rAl: 0.09, x: 0.075 }
];

export interface Module1State {
  voltage: number; // U (V) - 380, 400, 415
  currentR: number; // IR (A)
  currentS: number; // IS (A)
  currentT: number; // IT (A)
  cosphi: number; // Power factor
  kwhConsumption: number; // monthly kWh context
  transformerKva: number; // Transformer capacity for loading reference (kVA)
}

export interface Module2State {
  loadKw: number; // P (kW)
  currentPf: number; // cosphi 1
  targetPf: number; // cosphi 2
  voltage: number; // V (V) - 380, 400, 415
  ctRatioPrimary: number; // Primary current (e.g., 400 in 400/5)
  ctRatioSecondary: number; // Secondary current (usually 5)
  selectedStepSize: number; // e.g., 20, 25, 30, 40, 50 kVAr
}

export interface Module3State {
  daytimeAvgLoadKw: number; // kW average load in daylight
  daytimeMinLoadKw: number; // kW peak minimum daytime load
  actualLoadCurrent: number; // Current (A)
  pf: number; // Cosphi during daytime
  operatingHours: number; // hours of factory ops
  roofAreaSqM: number; // available Roof Area
  roofType: "metal" | "concrete" | "deck";
  hasZeroExport: boolean;
  electricityRateVnd: number; // standard or average cost (VND/kWh)
  installationCostPerKwpVnd: number; // VND per kWp installed
  selectedPanelId?: string; // Longi, JA, Jinko, Risen, Aiko, Trina selection
}

export interface SolarPanelData {
  id: string;
  brand: string;
  model: string;
  powerWp: number;
  efficiency: number;
  dimensions: string;
  area: number;
  weight: number;
  cellType: string;
}

export const SOLAR_PANELS: SolarPanelData[] = [
  // --- JA SOLAR ---
  {
    id: "ja-630-bifacial",
    brand: "JA Solar",
    model: "JAM72D42-630/LB",
    powerWp: 630,
    efficiency: 22.5,
    dimensions: "2465 × 1134 × 30 mm",
    area: 2.79,
    weight: 34.6,
    cellType: "N-type Double Glass Bifacial (16BB)"
  },
  {
    id: "ja-650-bifacial",
    brand: "JA Solar",
    model: "JAM72D42-650/LB",
    powerWp: 650,
    efficiency: 23.3,
    dimensions: "2465 × 1134 × 30 mm",
    area: 2.79,
    weight: 34.6,
    cellType: "N-type Double Glass Bifacial (16BB)"
  },
  {
    id: "ja-620-bifacial-66",
    brand: "JA Solar",
    model: "JAM66D45-620/LB",
    powerWp: 620,
    efficiency: 23.0,
    dimensions: "2382 × 1134 × 30 mm",
    area: 2.70,
    weight: 33.1,
    cellType: "N-type Double Glass Bifacial (16BB - 66 Cell)"
  },
  // --- LONGI SOLAR ---
  {
    id: "longi-640-bc",
    brand: "LONGi Solar",
    model: "LR7-72HVHF-640M",
    powerWp: 640,
    efficiency: 23.7,
    dimensions: "2382 × 1134 × 30 mm",
    area: 2.70,
    weight: 28.5,
    cellType: "BC-Cell HPBC 2.0 Single Glass (Anti-Dust Frame)"
  },
  {
    id: "longi-660-bc",
    brand: "LONGi Solar",
    model: "LR7-72HVHF-660M",
    powerWp: 660,
    efficiency: 24.4,
    dimensions: "2382 × 1134 × 30 mm",
    area: 2.70,
    weight: 28.5,
    cellType: "BC-Cell HPBC 2.0 Single Glass (Anti-Dust Frame)"
  },
  {
    id: "longi-670-bc",
    brand: "LONGi Solar",
    model: "LR7-72HVHF-670M",
    powerWp: 670,
    efficiency: 24.8,
    dimensions: "2382 × 1134 × 30 mm",
    area: 2.70,
    weight: 28.5,
    cellType: "BC-Cell HPBC 2.0 Single Glass (Anti-Dust Frame)"
  },
  // --- JINKO SOLAR ---
  {
    id: "jinko-590-bifacial",
    brand: "Jinko Solar",
    model: "JKM590N-72HL4-BDV",
    powerWp: 590,
    efficiency: 22.84,
    dimensions: "2278 × 1134 × 30 mm",
    area: 2.58,
    weight: 31.0,
    cellType: "Tiger Neo N-type Bifacial (144 Cell)"
  },
  {
    id: "jinko-605-mono",
    brand: "Jinko Solar",
    model: "JKM605N-72HL4-(V)",
    powerWp: 605,
    efficiency: 23.42,
    dimensions: "2278 × 1134 × 30 mm",
    area: 2.58,
    weight: 27.0,
    cellType: "Tiger Neo N-type Mono-facial (144 Cell)"
  },
  {
    id: "jinko-630-bifacial",
    brand: "Jinko Solar",
    model: "JKM630N-66HL4M-BDV",
    powerWp: 630,
    efficiency: 23.32,
    dimensions: "2382 × 1134 × 30 mm",
    area: 2.70,
    weight: 32.4,
    cellType: "Tiger Neo N-type Bifacial (132 Cell)"
  },
  // --- RISEN SOLAR ---
  {
    id: "risen-585-bifacial",
    brand: "Risen Solar",
    model: "RSM144-9-585BNDG",
    powerWp: 585,
    efficiency: 22.6,
    dimensions: "2278 × 1134 × 30 mm",
    area: 2.58,
    weight: 31.0,
    cellType: "n-type TOPCon Bifacial"
  },
  {
    id: "risen-595-bifacial",
    brand: "Risen Solar",
    model: "RSM144-9-595BNDG",
    powerWp: 595,
    efficiency: 23.0,
    dimensions: "2278 × 1134 × 30 mm",
    area: 2.58,
    weight: 31.0,
    cellType: "n-type TOPCon Bifacial"
  },
  // --- AIKO SOLAR ---
  {
    id: "aiko-620-abc",
    brand: "Aiko Solar",
    model: "AIKO-A620-MAH72Dw",
    powerWp: 620,
    efficiency: 24.0,
    dimensions: "2278 × 1134 × 30 mm",
    area: 2.58,
    weight: 31.0,
    cellType: "ABC (All Back Contact) High Efficiency"
  },
  {
    id: "aiko-630-abc",
    brand: "Aiko Solar",
    model: "AIKO-A630-MAH72Dw",
    powerWp: 630,
    efficiency: 24.4,
    dimensions: "2278 × 1134 × 30 mm",
    area: 2.58,
    weight: 31.0,
    cellType: "ABC (All Back Contact) Premium"
  },
  // --- TRINA SOLAR ---
  {
    id: "trina-680-vertex",
    brand: "Trina Solar",
    model: "TSM-680DE21",
    powerWp: 680,
    efficiency: 21.9,
    dimensions: "2384 × 1303 × 33 mm",
    area: 3.11,
    weight: 38.7,
    cellType: "Vertex Dual Glass N-type TOPCon"
  },
  {
    id: "trina-700-vertex",
    brand: "Trina Solar",
    model: "TSM-700DE21",
    powerWp: 700,
    efficiency: 22.5,
    dimensions: "2384 × 1303 × 33 mm",
    area: 3.11,
    weight: 38.7,
    cellType: "Vertex Dual Glass N-type TOPCon Ultimate"
  }
];

export interface Module4State {
  loadKw: number; // kW
  currentA: number; // A (if 0, uses kW to calculate)
  cableLength: number; // meters
  cableMaterial: "copper" | "aluminum";
  installationMethod: "conduit" | "tray" | "underground";
  ambientTemp: number; // °C
  allowableDropPercent: number; // e.g. 2%, 3%, 5%
  cosphi: number; // PF
  voltage: number; // U (V)
}

export interface FullAppState {
  module1: Module1State;
  module2: Module2State;
  module3: Module3State;
  module4: Module4State;
  theme: "dark" | "light";
}

export const INITIAL_STATE: FullAppState = {
  module1: {
    voltage: 400,
    currentR: 380,
    currentS: 410,
    currentT: 395,
    cosphi: 0.78,
    kwhConsumption: 120000,
    transformerKva: 1000
  },
  module2: {
    loadKw: 250,
    currentPf: 0.78,
    targetPf: 0.95,
    voltage: 400,
    ctRatioPrimary: 600,
    ctRatioSecondary: 5,
    selectedStepSize: 25
  },
  module3: {
    daytimeAvgLoadKw: 350,
    daytimeMinLoadKw: 150,
    actualLoadCurrent: 550,
    pf: 0.82,
    operatingHours: 10,
    roofAreaSqM: 2500,
    roofType: "metal",
    hasZeroExport: true,
    electricityRateVnd: 2200, // Average VND/kWh industrial rate in VN (e.g. EVN normal hour is 1600-1800, peak is 3000-3200)
    installationCostPerKwpVnd: 13500000, // 13.5M VND per kWp average industrial
    selectedPanelId: "ja-630-bifacial"
  },
  module4: {
    loadKw: 150,
    currentA: 260,
    cableLength: 120,
    cableMaterial: "copper",
    installationMethod: "tray",
    ambientTemp: 35,
    allowableDropPercent: 3,
    cosphi: 0.85,
    voltage: 400
  },
  theme: "dark"
};
