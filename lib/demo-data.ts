import type { AssetDetail, DashboardData, IntakeSubmission, WorkOrderDetail } from "@/lib/types";

export const dashboardData: DashboardData = {
  kpis: {
    total_assets: 4,
    healthy_assets: 2,
    assets_at_risk: 2,
    critical_alerts: 1,
    mtbf_hours: 412,
    mttr_hours: 5.6,
    downtime_hours: 7,
    predicted_failures_next_7_days: 1,
    predicted_failures_next_30_days: 2,
    plant_health_index: 72.5,
  },
  assets: [
    { id: 101, name: "Primary Air Compressor", status: "warning", criticality: "critical", health_score: 66, failure_risk_score: 71 },
    { id: 102, name: "Conveyor Motor 12", status: "healthy", criticality: "high", health_score: 86, failure_risk_score: 32 },
    { id: 103, name: "Cooling Water Pump 7", status: "critical", criticality: "critical", health_score: 54, failure_risk_score: 88 },
    { id: 104, name: "Exhaust Fan 4", status: "healthy", criticality: "medium", health_score: 84, failure_risk_score: 28 },
  ],
  risk_hotspots: [
    { plant: "Utilities Plant", asset: "Cooling Water Pump 7", risk_reason: "Pressure instability, vibration growth, and active safety escalation" },
    { plant: "Casting Plant", asset: "Primary Air Compressor", risk_reason: "Thermal drift, due maintenance window, and rising power draw" },
  ],
  forecasted_maintenance_workload: [
    { week: "W17", planned: 5, predictive: 2 },
    { week: "W18", planned: 4, predictive: 3 },
    { week: "W19", planned: 6, predictive: 4 },
  ],
};

export const assets = [
  { id: 101, asset_code: "CMP-01", name: "Primary Air Compressor", category: "Compression", status: "warning", criticality: "critical", health_score: 66, failure_risk_score: 71 },
  { id: 102, asset_code: "CNV-12", name: "Conveyor Motor 12", category: "Material Handling", status: "healthy", criticality: "high", health_score: 86, failure_risk_score: 32 },
  { id: 103, asset_code: "PMP-07", name: "Cooling Water Pump 7", category: "Pumping", status: "critical", criticality: "critical", health_score: 54, failure_risk_score: 88 },
  { id: 104, asset_code: "FAN-04", name: "Exhaust Fan 4", category: "Ventilation", status: "healthy", criticality: "medium", health_score: 84, failure_risk_score: 28 },
];

export const assetDetailById: Record<number, AssetDetail> = {
  101: {
    id: 101,
    asset_code: "CMP-01",
    name: "Primary Air Compressor",
    category: "Compression",
    status: "warning",
    criticality: "critical",
    manufacturer: "Atlas Copco",
    model: "GA 90",
    commissioned_on: "2018-03-14",
    downtime_cost_per_hour: 3800,
    latest_reading: {
      recorded_at: "2026-04-22T12:00:00",
      temperature: 77.8,
      vibration: 3.4,
      pressure: 8.45,
      humidity: 39.5,
      runtime_hours: 8123,
      power_consumption: 118.2,
    },
    sensor_trend: [
      { recorded_at: "02:00", temperature: 73.2, vibration: 2.8, pressure: 8.63 },
      { recorded_at: "04:00", temperature: 74.1, vibration: 2.9, pressure: 8.61 },
      { recorded_at: "06:00", temperature: 75.5, vibration: 3.0, pressure: 8.58 },
      { recorded_at: "08:00", temperature: 76.4, vibration: 3.1, pressure: 8.54 },
      { recorded_at: "10:00", temperature: 77.1, vibration: 3.2, pressure: 8.49 },
      { recorded_at: "12:00", temperature: 77.8, vibration: 3.4, pressure: 8.45 },
    ],
    predictions: {
      health_score: 66,
      failure_risk_score: 71,
      maintenance_urgency_score: 74,
      remaining_useful_life_days: 42,
      safety_severity_score: 58,
      recommendations: [
        "Review compressor heat increase and lubrication cycle",
        "Maintain current preventive plan and continue trend monitoring.",
      ],
      probable_causes: [
        "Progressive bearing wear or misalignment is likely contributing to the failure pattern.",
        "Repeated recent incident frequency suggests the current maintenance interval is too wide.",
      ],
    },
    open_work_orders: [
      { id: 202, title: "Review compressor heat increase and lubrication cycle", status: "open", priority: "high", assigned_to: "Maha Al-Dosari" },
    ],
    incidents: [{ id: 302, title: "Compressor thermal drift", severity: "medium", status: "investigating" }],
    safety_alerts: [{ id: 402, title: "Compressor heat trend may increase operator exposure during manual inspection", severity: "high", risk_matrix: "4x3" }],
    spare_parts: [{ id: 2, name: "Synthetic compressor lubricant", stock_on_hand: 6, reorder_level: 4 }],
  },
  103: {
    id: 103,
    asset_code: "PMP-07",
    name: "Cooling Water Pump 7",
    category: "Pumping",
    status: "critical",
    criticality: "critical",
    manufacturer: "Grundfos",
    model: "CRN 64",
    commissioned_on: "2019-01-11",
    downtime_cost_per_hour: 4200,
    latest_reading: {
      recorded_at: "2026-04-22T12:00:00",
      temperature: 84.6,
      vibration: 5.28,
      pressure: 7.12,
      humidity: 43.5,
      runtime_hours: 5441,
      power_consumption: 129.4,
    },
    sensor_trend: [
      { recorded_at: "02:00", temperature: 76.2, vibration: 4.02, pressure: 8.21 },
      { recorded_at: "04:00", temperature: 77.6, vibration: 4.16, pressure: 8.07 },
      { recorded_at: "06:00", temperature: 79.8, vibration: 4.45, pressure: 7.81 },
      { recorded_at: "08:00", temperature: 81.5, vibration: 4.71, pressure: 7.63 },
      { recorded_at: "10:00", temperature: 83.1, vibration: 4.96, pressure: 7.36 },
      { recorded_at: "12:00", temperature: 84.6, vibration: 5.28, pressure: 7.12 },
    ],
    predictions: {
      health_score: 54,
      failure_risk_score: 88,
      maintenance_urgency_score: 91,
      remaining_useful_life_days: 18,
      safety_severity_score: 79,
      recommendations: [
        "Create an immediate inspection work order and verify rotating component condition.",
        "Reserve outage capacity within 30 days and prepare spare parts for replacement.",
        "Escalate to HSE review and restrict manual intervention until controls are verified.",
      ],
      probable_causes: [
        "Progressive bearing wear or misalignment is likely contributing to the failure pattern.",
        "Hydraulic restriction or seal degradation may be reducing pressure stability.",
        "Recent corrective history indicates the issue may be recurring rather than isolated.",
      ],
    },
    open_work_orders: [
      { id: 201, title: "Investigate abnormal vibration on Cooling Water Pump 7", status: "in_progress", priority: "critical", assigned_to: "Ahmed Al-Qahtani" },
    ],
    incidents: [{ id: 301, title: "Pump discharge instability", severity: "high", status: "open" }],
    safety_alerts: [{ id: 401, title: "Pump degradation linked to slip and hot-surface exposure", severity: "critical", risk_matrix: "5x4" }],
    spare_parts: [{ id: 1, name: "Mechanical seal kit", stock_on_hand: 2, reorder_level: 2 }],
  },
};

export const workOrderDetailById: Record<number, WorkOrderDetail> = {
  201: {
    item: {
      id: 201,
      asset_id: 103,
      title: "Investigate abnormal vibration on Cooling Water Pump 7",
      status: "in_progress",
      priority: "critical",
      assigned_to: "Ahmed Al-Qahtani",
      sla_hours: 8,
      downtime_impact_hours: 3.5,
      type: "predictive",
      created_at: "2026-04-22T07:30:00",
    },
    updates: [
      { id: 1, status: "in_progress", note: "Bearing housing inspected. Elevated heat and seal wear confirmed.", created_at: "2026-04-22T08:10:00" },
    ],
  },
  202: {
    item: {
      id: 202,
      asset_id: 101,
      title: "Review compressor heat increase and lubrication cycle",
      status: "open",
      priority: "high",
      assigned_to: "Maha Al-Dosari",
      sla_hours: 24,
      downtime_impact_hours: 1.2,
      type: "inspection",
      created_at: "2026-04-21T14:10:00",
    },
    updates: [
      { id: 2, status: "open", note: "Trend review scheduled with reliability engineer.", created_at: "2026-04-21T16:15:00" },
    ],
  },
};

export const intakeSubmissions: IntakeSubmission[] = [
  {
    id: 1,
    workspace_id: "condition-monitoring",
    workspace_title: "Condition monitoring and baseline configuration",
    owner_role: "reliability_engineer",
    submitted_by: "Khaled Al-Qahtani",
    plant: "Utilities Plant",
    asset_reference: "PMP-07",
    summary: "Updated pressure and vibration baseline after pump overhaul review.",
    status: "review_required",
    created_at: "2026-04-22T09:30:00",
  },
  {
    id: 2,
    workspace_id: "maintenance-execution",
    workspace_title: "Maintenance planning and execution capture",
    owner_role: "maintenance_manager",
    submitted_by: "Maha Al-Dosari",
    plant: "Casting Plant",
    asset_reference: "CMP-01",
    summary: "Logged predictive inspection scope, parts reservation, and closure evidence requirements.",
    status: "submitted",
    created_at: "2026-04-22T10:15:00",
  },
];
