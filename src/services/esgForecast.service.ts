import type { HistoricalESGData, ESGMetricKey } from '../components/management/common/BusinessUnitBreakdownModal';

export type ForecastScenario = 'ytd_momentum' | 'accelerated' | 'conservative';

export interface ForecastModelMetrics {
  slope: number;
  r2: number;
  ytdRunRateDelta: number;
  annualizedGrowthPct: number;
  confidenceScore: number;
}

export interface ExtendedESGData extends HistoricalESGData {
  isForecast?: boolean;
  isTransitionPoint?: boolean;
  scenario?: ForecastScenario;
  confidenceLow?: number;
  confidenceHigh?: number;
  modelConfidence?: number;
  // Specific forecast metric keys for continuous Recharts rendering
  forecastEsgScore?: number;
  forecastEnvironmentalScore?: number;
  forecastSocialScore?: number;
  forecastGovernanceScore?: number;
  forecastGhgIntensity?: number;
  forecastRenewableRatio?: number;
  forecastWaterRecycledRatio?: number;
  forecastWasteRecycled?: number;
  forecastLtifr?: number;
}

export const SCENARIO_LABELS: Record<ForecastScenario, { label: string; badge: string; description: string }> = {
  ytd_momentum: {
    label: 'YTD Run-Rate (Baseline)',
    badge: 'Baseline Run-Rate',
    description: 'Extrapolates current FY26 YTD execution pace and active BU efficiency projects.',
  },
  accelerated: {
    label: 'Accelerated Transition (+15%)',
    badge: 'High Ambition',
    description: 'Models accelerated capex deployment in hybrid solar-wind parks and electrified fleets.',
  },
  conservative: {
    label: 'Conservative / Business-as-Usual',
    badge: 'Conservative',
    description: 'Assumes supply chain delays and steady-state operations with baseline efficiency.',
  },
};

/**
 * Calculates weighted linear regression and YTD momentum
 */
export function calculateYtdTrend(values: number[]): ForecastModelMetrics {
  const n = values.length;
  if (n < 2) {
    return {
      slope: 0,
      r2: 1,
      ytdRunRateDelta: 0,
      annualizedGrowthPct: 0,
      confidenceScore: 85,
    };
  }

  // Linear regression x = 0, 1, ..., n-1
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const meanX = sumX / n;
  const meanY = sumY / n;
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) || 0;
  const intercept = meanY - slope * meanX;

  // Compute R-squared
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const yPred = slope * i + intercept;
    ssTot += Math.pow(values[i] - meanY, 2);
    ssRes += Math.pow(values[i] - yPred, 2);
  }
  const r2 = ssTot === 0 ? 1 : Math.max(0, Math.min(1, 1 - ssRes / ssTot));

  // Recent YTD delta (weighted higher between the last two points)
  const lastDelta = values[n - 1] - values[n - 2];
  const avgDelta = (values[n - 1] - values[0]) / (n - 1);
  const ytdRunRateDelta = 0.65 * lastDelta + 0.35 * avgDelta;
  const annualizedGrowthPct = values[n - 2] !== 0 ? ((values[n - 1] - values[n - 2]) / values[n - 2]) * 100 : 0;

  // Calculate confidence score (higher for strong R² and adequate sample size)
  const confidenceScore = Math.min(98, Math.max(78, Math.round((0.5 * r2 + 0.3 * (n / 5) + 0.2) * 100)));

  return {
    slope,
    r2: Math.round(r2 * 100) / 100,
    ytdRunRateDelta,
    annualizedGrowthPct: Math.round(annualizedGrowthPct * 10) / 10,
    confidenceScore,
  };
}

/**
 * Applies diminishing returns when metrics approach upper/lower limits
 */
function applyBoundaryDampening(currentVal: number, rawDelta: number, isLowerBetter: boolean, minVal = 0, maxVal = 100): number {
  if (isLowerBetter) {
    // Approaches 0
    const distanceToFloor = Math.max(0, currentVal - minVal);
    const dampening = Math.min(1, distanceToFloor / 10);
    return Math.max(minVal, currentVal + rawDelta * (rawDelta < 0 ? dampening : 1));
  } else {
    // Approaches 100
    const distanceToCeil = Math.max(0, maxVal - currentVal);
    const dampening = Math.min(1, distanceToCeil / 15);
    return Math.min(maxVal, currentVal + rawDelta * (rawDelta > 0 ? dampening : 1));
  }
}

/**
 * Builds combined dataset containing historical points and seamless forecast points
 */
export function buildForecastDataset(
  historicalPoints: HistoricalESGData[],
  options: {
    showForecast: boolean;
    scenario: ForecastScenario;
    horizonYears?: number;
  }
): ExtendedESGData[] {
  if (!historicalPoints || historicalPoints.length === 0) {
    return [];
  }

  // If forecast is disabled, return clean historical points
  if (!options.showForecast) {
    return historicalPoints.map((item) => ({
      ...item,
      isForecast: false,
      scenario: item.scenario,
    }));
  }

  const n = historicalPoints.length;
  const lastActual = historicalPoints[n - 1];
  const isQuarterly = lastActual.yearLabel.startsWith('Q');
  const horizon = options.horizonYears ?? (isQuarterly ? 3 : 2);

  // Scenario multipliers
  const scenarioMultiplier =
    options.scenario === 'accelerated'
      ? 1.22
      : options.scenario === 'conservative'
      ? 0.62
      : 1.0;

  // Analyze trends for all 9 metrics
  const esgTrend = calculateYtdTrend(historicalPoints.map((d) => d.esgScore ?? 0));
  const envTrend = calculateYtdTrend(historicalPoints.map((d) => d.environmentalScore ?? 0));
  const socTrend = calculateYtdTrend(historicalPoints.map((d) => d.socialScore ?? 0));
  const govTrend = calculateYtdTrend(historicalPoints.map((d) => d.governanceScore ?? 0));
  const ghgTrend = calculateYtdTrend(historicalPoints.map((d) => d.ghgIntensity ?? 0));
  const renTrend = calculateYtdTrend(historicalPoints.map((d) => d.renewableRatio ?? 0));
  const watTrend = calculateYtdTrend(historicalPoints.map((d) => d.waterRecycledRatio ?? 0));
  const wasTrend = calculateYtdTrend(historicalPoints.map((d) => d.wasteRecycled ?? 0));
  const ltiTrend = calculateYtdTrend(historicalPoints.map((d) => d.ltifr ?? 0));

  // Build the enhanced historical segment (with forecast keys undefined, except transition point)
  const result: ExtendedESGData[] = historicalPoints.map((point, index) => {
    const isTransition = index === n - 1;

    if (isTransition) {
      // The transition point connects the solid historical line to the dashed forecast line
      return {
        ...point,
        isForecast: false,
        isTransitionPoint: true,
        scenario: options.scenario,
        modelConfidence: esgTrend.confidenceScore,
        forecastEsgScore: point.esgScore,
        forecastEnvironmentalScore: point.environmentalScore,
        forecastSocialScore: point.socialScore,
        forecastGovernanceScore: point.governanceScore,
        forecastGhgIntensity: point.ghgIntensity,
        forecastRenewableRatio: point.renewableRatio,
        forecastWaterRecycledRatio: point.waterRecycledRatio,
        forecastWasteRecycled: point.wasteRecycled,
        forecastLtifr: point.ltifr,
      };
    }

    return {
      ...point,
      isForecast: false,
      isTransitionPoint: false,
      scenario: point.scenario,
    };
  });

  // Iteratively compute future forecast points
  let prevEsg: number = lastActual.esgScore ?? 95.8;
  let prevEnv: number = lastActual.environmentalScore ?? 94.1;
  let prevSoc: number = lastActual.socialScore ?? 96.2;
  let prevGov: number = lastActual.governanceScore ?? 97.5;
  let prevGhg: number = lastActual.ghgIntensity ?? 18.2;
  let prevRen: number = lastActual.renewableRatio ?? 32.1;
  let prevWat: number = lastActual.waterRecycledRatio ?? 42.4;
  let prevWas: number = lastActual.wasteRecycled ?? 92.0;
  let prevLti: number = lastActual.ltifr ?? 0.08;

  for (let step = 1; step <= horizon; step++) {
    // Generate label
    let yearLabel = '';
    let fiscalYear = '';

    if (isQuarterly) {
      // Parse last quarter e.g. "Q4 FY26" or "Q3 FY26"
      const match = lastActual.yearLabel.match(/Q(\d)\s+FY(\d+)/);
      if (match) {
        const lastQ = parseInt(match[1], 10);
        const lastFY = parseInt(match[2], 10);
        const nextTotalQ = lastQ + step;
        const nextQ = ((nextTotalQ - 1) % 4) + 1;
        const nextFY = lastFY + Math.floor((nextTotalQ - 1) / 4);
        yearLabel = `Q${nextQ} FY${nextFY} (Proj)`;
        fiscalYear = `Q${nextQ} FY 20${nextFY - 1}-${nextFY} (Predictive Run-Rate)`;
      } else {
        yearLabel = `Q+${step} (Proj)`;
        fiscalYear = `Forecast Period +${step}`;
      }
    } else {
      // Annual format e.g. "FY26"
      const match = lastActual.yearLabel.match(/FY(\d+)/);
      if (match) {
        const lastFY = parseInt(match[1], 10);
        const nextFY = lastFY + step;
        yearLabel = `FY${nextFY} (Proj)`;
        fiscalYear = `FY 20${nextFY - 1}-${nextFY} (Predictive Horizon)`;
      } else {
        yearLabel = `Year +${step} (Proj)`;
        fiscalYear = `Forecast Horizon +${step}`;
      }
    }

    // Step dampening for multi-step horizons (step 2 has slight momentum decay)
    const horizonDecay = Math.pow(0.92, step - 1);

    // Compute metric delta
    const esgDelta = esgTrend.ytdRunRateDelta * scenarioMultiplier * horizonDecay;
    const envDelta = envTrend.ytdRunRateDelta * scenarioMultiplier * horizonDecay;
    const socDelta = socTrend.ytdRunRateDelta * scenarioMultiplier * horizonDecay;
    const govDelta = govTrend.ytdRunRateDelta * scenarioMultiplier * horizonDecay;
    // For GHG and LTIFR, negative delta is good (decarbonization / safer)
    const ghgDelta = ghgTrend.ytdRunRateDelta * scenarioMultiplier * horizonDecay;
    const renDelta = renTrend.ytdRunRateDelta * scenarioMultiplier * horizonDecay;
    const watDelta = watTrend.ytdRunRateDelta * scenarioMultiplier * horizonDecay;
    const wasDelta = wasTrend.ytdRunRateDelta * scenarioMultiplier * horizonDecay;
    const ltiDelta = ltiTrend.ytdRunRateDelta * scenarioMultiplier * horizonDecay;

    const nextEsg = Math.round(applyBoundaryDampening(prevEsg, esgDelta, false, 50, 99.5) * 10) / 10;
    const nextEnv = Math.round(applyBoundaryDampening(prevEnv, envDelta, false, 50, 99.5) * 10) / 10;
    const nextSoc = Math.round(applyBoundaryDampening(prevSoc, socDelta, false, 50, 99.5) * 10) / 10;
    const nextGov = Math.round(applyBoundaryDampening(prevGov, govDelta, false, 50, 99.5) * 10) / 10;
    const nextGhg = Math.round(applyBoundaryDampening(prevGhg, ghgDelta, true, 8.0, 35.0) * 10) / 10;
    const nextRen = Math.round(applyBoundaryDampening(prevRen, renDelta, false, 0, 75.0) * 10) / 10;
    const nextWat = Math.round(applyBoundaryDampening(prevWat, watDelta, false, 0, 80.0) * 10) / 10;
    const nextWas = Math.round(applyBoundaryDampening(prevWas, wasDelta, false, 0, 99.0) * 10) / 10;
    const nextLti = Math.round(applyBoundaryDampening(prevLti, ltiDelta, true, 0.02, 1.0) * 100) / 100;

    // Confidence interval spreads out as horizon increases
    const spread = (1.2 + 0.8 * step) * (options.scenario === 'conservative' ? 1.4 : 1.0);
    const confidenceLow = Math.round((nextEsg - spread) * 10) / 10;
    const confidenceHigh = Math.round(Math.min(100, nextEsg + spread) * 10) / 10;

    result.push({
      fiscalYear,
      yearLabel,
      // For Recharts: undefined on actual keys so the solid line doesn't draw here
      // For BU Breakdown Modal & Tooltips: fallback handlers can read forecast keys or the value
      esgScore: nextEsg as any,
      environmentalScore: nextEnv as any,
      socialScore: nextSoc as any,
      governanceScore: nextGov as any,
      ghgIntensity: nextGhg as any,
      renewableRatio: nextRen as any,
      waterRecycledRatio: nextWat as any,
      wasteRecycled: nextWas as any,
      ltifr: nextLti as any,
      // Dedicated forecast fields for Recharts dashed lines
      forecastEsgScore: nextEsg,
      forecastEnvironmentalScore: nextEnv,
      forecastSocialScore: nextSoc,
      forecastGovernanceScore: nextGov,
      forecastGhgIntensity: nextGhg,
      forecastRenewableRatio: nextRen,
      forecastWaterRecycledRatio: nextWat,
      forecastWasteRecycled: nextWas,
      forecastLtifr: nextLti,
      isForecast: true,
      isTransitionPoint: false,
      scenario: options.scenario,
      confidenceLow,
      confidenceHigh,
      modelConfidence: Math.max(70, esgTrend.confidenceScore - step * 4),
    });

    prevEsg = nextEsg;
    prevEnv = nextEnv;
    prevSoc = nextSoc;
    prevGov = nextGov;
    prevGhg = nextGhg;
    prevRen = nextRen;
    prevWat = nextWat;
    prevWas = nextWas;
    prevLti = nextLti;
  }

  return result;
}

/**
 * Helper to safely extract metric value whether actual or forecast
 */
export function getMetricValue(point: ExtendedESGData, metricKey: ESGMetricKey): number {
  if (point[metricKey] !== undefined && typeof point[metricKey] === 'number') {
    return point[metricKey] as number;
  }
  const forecastKey = (`forecast${metricKey.charAt(0).toUpperCase() + metricKey.slice(1)}` as keyof ExtendedESGData);
  if (point[forecastKey] !== undefined && typeof point[forecastKey] === 'number') {
    return point[forecastKey] as number;
  }
  return 0;
}
