export type Role =
  | "super_admin"
  | "factory_owner"
  | "plant_manager"
  | "maintenance_manager"
  | "reliability_engineer"
  | "safety_manager"
  | "maintenance_technician"
  | "viewer";

export type DashboardData = {
  kpis: Record<string, number | number[] | Record<string, number>>;
  assets: {
    id: number;
    name: string;
    status: string;
    criticality: string;
    health_score: number;
    failure_risk_score: number;
  }[];
  risk_hotspots: {
    plant: string;
    asset: string;
    risk_reason: string;
  }[];
  forecasted_maintenance_workload: {
    week: string;
    planned: number;
    predictive: number;
  }[];
};

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  role: Role;
  locale: string;
  timezone?: string;
};

export type AssetDetail = {
  id: number;
  asset_code: string;
  name: string;
  category: string;
  status: string;
  criticality: string;
  manufacturer: string;
  model: string;
  commissioned_on: string;
  downtime_cost_per_hour: number;
  latest_reading: Record<string, string | number>;
  sensor_trend: Record<string, string | number>[];
  predictions: {
    health_score: number;
    failure_risk_score: number;
    maintenance_urgency_score: number;
    remaining_useful_life_days: number;
    safety_severity_score: number;
    recommendations: string[];
    probable_causes: string[];
  };
  open_work_orders: {
    id: number;
    title: string;
    status: string;
    priority: string;
    assigned_to: string;
  }[];
  incidents: {
    id: number;
    title: string;
    severity: string;
    status: string;
  }[];
  safety_alerts: {
    id: number;
    title: string;
    severity: string;
    risk_matrix: string;
  }[];
  spare_parts: {
    id: number;
    name: string;
    stock_on_hand: number;
    reorder_level: number;
  }[];
};

export type WorkOrderItem = {
  id: number;
  asset_id?: number;
  title: string;
  status: string;
  priority: string;
  assigned_to: string;
  sla_hours: number;
  downtime_impact_hours: number;
  type: string;
};

export type WorkOrderDetail = {
  item: WorkOrderItem & {
    asset_id: number;
    created_at?: string;
  };
  updates: {
    id: number;
    status: string;
    note: string;
    created_at: string;
  }[];
};

export type IncidentItem = {
  id: number;
  asset_id?: number;
  title: string;
  severity: string;
  status: string;
  summary: string;
  rcaSummary: string;
};

export type RoleProfile = {
  role: Role;
  label: string;
  dashboard_title: string;
  mission: string;
  primary_tabs: string[];
  core_inputs: string[];
  approvals: string[];
  outcome_metrics: string[];
  data_scope: string[];
};

export type IntakeWorkspace = {
  id: string;
  title: string;
  owner_role: Role;
  owner_label: string;
  cadence: string;
  purpose: string;
  required_fields: string[];
  validation_rules: string[];
  downstream_outputs: string[];
};

export type IndustrialField = {
  name: string;
  requirement: "required" | "recommended" | "conditional";
  notes: string;
};

export type IndustrialFieldSet = {
  domain: string;
  subtitle: string;
  owner_roles: string[];
  fields: IndustrialField[];
};

export type IntakeSubmission = {
  id: number;
  workspace_id: string;
  workspace_title: string;
  owner_role: Role;
  submitted_by: string;
  plant: string;
  asset_reference: string;
  summary: string;
  status: "submitted" | "review_required" | "approved";
  created_at: string;
};

export type AgentAssistantRequest = {
  message: string;
  context?: {
    locale?: string;
    timezone?: string;
    requesting_role?: Role;
  };
  pageContext?: {
    page: "dashboard" | "asset";
    title?: string;
    assetId?: number;
    assetCode?: string;
    assetName?: string;
    assetCategory?: string;
    assetCriticality?: string;
  };
  model?: string;
  toolChoice?: "auto" | "required";
};

export type AgentAssistantResponse = {
  answer: string;
  model: string;
};
