// --- General ---
export interface ApiErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationErrorResponse {
  detail?: ApiErrorDetail[];
}

// --- Auth ---
export interface RegisterRequest {
  salon_name: string;
  owner_email: string;
  password: string;
  full_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  tenant_id: string;
  user_id: string;
}

export interface UserInfoResponse {
  userId: string;
  username: string;
  realName: string;
  avatar: string;
  roles: { roleName: string; value: string }[];
}


// --- Query ---
export interface GenerateQueryRequest {
  question: string;
  execute?: boolean;
  use_cache?: boolean;
}

export interface QueryResponse {
  query_id: string;
  question: string;
  sql: string;
  executed: boolean;
  results: Record<string, any>[] | null;
  row_count: number | null;
  execution_time_ms: number | null;
  error: string | null;
}

export interface FeedbackRequest {
  rating?: number;
  was_helpful?: boolean;
  feedback?: string;
}

// --- Integrations ---
export interface TestIntegrationRequest {
    integration_type: string;
    credentials: Record<string, any>;
    config?: Record<string, any>;
}

export interface TestIntegrationResponse {
    success: boolean;
    error: string | null;
    message: string;
}

export interface IntegrationResponse {
    integration_id: string;
    name: string;
    integration_type: string;
    status: string;
    created_at: string;
    last_sync_at: string | null;
    next_sync_at: string | null;
    last_error: string | null;
}

export interface CreateIntegrationRequest {
    name: string;
    integration_type: string;
    credentials: Record<string, any>;
    config?: Record<string, any>;
    sync_frequency_minutes?: number;
}

export interface SyncIntegrationRequest {
    mode?: 'full' | 'incremental';
}

export interface SyncIntegrationResponse {
    success: boolean;
    tables_synced: number;
    total_records: number;
    errors: string[];
}

// --- Training ---
export interface AutoTrainResponse {
    success: boolean;
    ddl_trained: boolean;
    questions_trained: number;
    documentation_added: number;
    errors: string[];
    already_trained: boolean;
    message: string;
}

export interface TrainingStatusResponse {
    is_trained: boolean;
    tenant_id: string;
}

export interface TrainCustomRequest {
    question?: string;
    sql?: string;
    ddl?: string;
    documentation?: string;
}

// --- Insights ---
export interface InsightResponse {
    insight_id: string;
    tenant_id: string;
    type: string;
    severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
    status: 'new' | 'viewed' | 'acknowledged' | 'resolved' | 'dismissed';
    title: string;
    description: string;
    recommendation: string;
    metrics: Record<string, any>;
    affected_entities: Record<string, any>;
    current_value: number;
    previous_value: number;
    change_percent: number;
    generated_at: string;
    viewed_at: string | null;
    resolved_at: string | null;
    data_source: string;
    confidence_score: number;
}

export interface GenerateInsightsResponse {
    success: boolean;
    insights_generated: number;
    insights: InsightResponse[];
}

export interface ListInsightsParams {
    status_filter?: 'new' | 'viewed' | 'acknowledged' | 'resolved' | 'dismissed';
    type_filter?: string;
    severity_filter?: 'info' | 'low' | 'medium' | 'high' | 'critical';
    limit?: number;
}

export interface UpdateInsightStatusRequest {
    status: 'acknowledged' | 'resolved' | 'dismissed';
}

// --- Predictions ---
export interface RevenueForecastDataPoint {
  date: string;
  prediction: number;
}
export interface RevenueForecast {
  days: number;
  forecast: RevenueForecastDataPoint[];
}

export interface BookingDemandDataPoint {
    date: string;
    predicted_bookings: number;
}
export interface BookingDemand {
    forecast: BookingDemandDataPoint[];
}

export interface ChurnRiskCustomer {
    customer_id: number;
    customer_name: string;
    risk_score: number;
    risk_factors: string[];
    last_visit: string;
}

export interface ServiceTrend {
    growing: { service_name: string; change: number }[];
    declining: { service_name: string; change: number }[];
}

export interface DashboardPredictionsResponse {
    revenue_forecasts: {
        '7_day': RevenueForecast;
        '30_day': RevenueForecast;
    };
    booking_demand: BookingDemand;
    churn_risk: {
        high_risk_customers: ChurnRiskCustomer[];
    };
    service_trends: ServiceTrend;
}

export interface ForecastRevenueRequest {
    days_ahead?: number;
    method?: 'moving_average' | 'prophet';
}

export interface ForecastRevenueResponse { /* Define based on actual response */ }

export interface ForecastBookingDemandRequest {
    days_ahead?: number;
    include_hourly?: boolean;
}

export interface IdentifyChurnRiskRequest {
    method?: 'rule_based' | 'random_forest';
    threshold?: number;
}

// --- Recommendations ---
export interface RecommendationResponse {
    id: string;
    type: string;
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'pending' | 'accepted' | 'rejected';
    action_items: string[];
    expected_impact: string;
    confidence_score: number;
    generated_at: string;
}

export interface GenerateAllRecommendationsResponse {
    promotions: RecommendationResponse[];
    scheduling: RecommendationResponse[];
    retention: RecommendationResponse[];
    inventory: RecommendationResponse[];
    pricing: RecommendationResponse[];
}

export interface UpdateRecommendationStatusRequest {
    status: 'accepted' | 'rejected' | 'pending';
    feedback?: string;
}