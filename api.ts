import type * as ApiTypes from './api-types';

const BASE_URL = 'http://localhost:8000'; // This should be replaced with an environment variable in a real app

export class ApiError extends Error {
    status: number;
    details?: ApiTypes.ValidationErrorResponse;

    constructor(message: string, status: number, details?: ApiTypes.ValidationErrorResponse) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
    }
}

async function apiClient<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    token?: string | null,
    body?: any
): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        let errorDetails: ApiTypes.ValidationErrorResponse | undefined;
        let errorMessage = `API Error: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.detail) {
                 errorDetails = errorData;
                 errorMessage = 'Validation Error';
                 if (typeof errorData.detail === 'string') {
                    errorMessage = errorData.detail;
                 } else if (Array.isArray(errorData.detail) && errorData.detail[0]?.msg) {
                    errorMessage = errorData.detail[0].msg;
                 }
            } else if (errorData.message) {
                 errorMessage = errorData.message;
            }
        } catch (e) {
            // Response was not JSON or empty
        }
        throw new ApiError(errorMessage, response.status, errorDetails);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json() as Promise<T>;
}


const AuthAPI = {
    register: (data: ApiTypes.RegisterRequest) => 
        apiClient<ApiTypes.AuthResponse>('/api/v1/auth/register', 'POST', null, data),
    
    login: (data: ApiTypes.LoginRequest) => 
        apiClient<ApiTypes.AuthResponse>('/api/v1/auth/login', 'POST', null, data),
        
    getCurrentUser: (token: string) => 
        apiClient<any>('/api/v1/auth/me', 'GET', token),
        
    getUserInfo: (token: string) =>
        apiClient<ApiTypes.UserInfoResponse>('/api/v1/user/info', 'GET', token),
};

const QueryAPI = {
    generateQuery: (token: string, data: ApiTypes.GenerateQueryRequest) =>
        apiClient<ApiTypes.QueryResponse>('/api/v1/query/', 'POST', token, data),

    submitQueryFeedback: (token: string, queryId: string, data: ApiTypes.FeedbackRequest) =>
        apiClient<void>(`/api/v1/query/${queryId}/feedback`, 'POST', token, data),
        
    getQueryHistory: (token: string, limit: number = 50) =>
        apiClient<ApiTypes.QueryResponse[]>(`/api/v1/query/history?limit=${limit}`, 'GET', token),
};

const IntegrationsAPI = {
    getSupportedIntegrations: () =>
        apiClient<string[]>('/api/v1/integrations/supported', 'GET'),
        
    testIntegration: (token: string, data: ApiTypes.TestIntegrationRequest) =>
        apiClient<ApiTypes.TestIntegrationResponse>('/api/v1/integrations/test', 'POST', token, data),

    listIntegrations: (token: string) =>
        apiClient<ApiTypes.IntegrationResponse[]>('/api/v1/integrations', 'GET', token),
        
    createIntegration: (token: string, data: ApiTypes.CreateIntegrationRequest) =>
        apiClient<ApiTypes.IntegrationResponse>('/api/v1/integrations', 'POST', token, data),
        
    syncIntegration: (token: string, integrationId: string, data: ApiTypes.SyncIntegrationRequest) =>
        apiClient<ApiTypes.SyncIntegrationResponse>(`/api/v1/integrations/${integrationId}/sync`, 'POST', token, data),
        
    deleteIntegration: (token: string, integrationId: string) =>
        apiClient<void>(`/api/v1/integrations/${integrationId}`, 'DELETE', token),
};

const TrainingAPI = {
    autoTrain: (token: string) =>
        apiClient<ApiTypes.AutoTrainResponse>('/api/v1/training/auto-train', 'POST', token),
        
    getTrainingStatus: (token: string) =>
        apiClient<ApiTypes.TrainingStatusResponse>('/api/v1/training/status', 'GET', token),

    trainCustom: (token: string, data: ApiTypes.TrainCustomRequest) =>
        apiClient<void>('/api/v1/training/train-custom', 'POST', token, data),
};

const InsightsAPI = {
    generateInsights: (token: string) =>
        apiClient<ApiTypes.GenerateInsightsResponse>('/api/v1/insights/generate', 'POST', token),
        
    listInsights: (token: string, params: ApiTypes.ListInsightsParams) => {
        const query = new URLSearchParams(params as any).toString();
        return apiClient<ApiTypes.InsightResponse[]>(`/api/v1/insights?${query}`, 'GET', token);
    },
    
    updateInsightStatus: (token: string, insightId: string, data: ApiTypes.UpdateInsightStatusRequest) =>
        apiClient<ApiTypes.InsightResponse>(`/api/v1/insights/${insightId}/status`, 'PATCH', token, data),

    deleteInsight: (token: string, insightId: string) =>
        apiClient<void>(`/api/v1/insights/${insightId}`, 'DELETE', token),
};

const PredictionsAPI = {
    getDashboardPredictions: (token: string) =>
        apiClient<ApiTypes.DashboardPredictionsResponse>('/api/v1/predictions/dashboard', 'GET', token),

    forecastRevenue: (token: string, data: ApiTypes.ForecastRevenueRequest) =>
        apiClient<ApiTypes.ForecastRevenueResponse>('/api/v1/predictions/revenue/forecast', 'POST', token, data),
        
    forecastBookingDemand: (token: string, data: ApiTypes.ForecastBookingDemandRequest) =>
        apiClient<any>(`/api/v1/predictions/bookings/forecast`, 'POST', token, data),
        
    identifyChurnRisk: (token: string, data: ApiTypes.IdentifyChurnRiskRequest) =>
        apiClient<any>(`/api/v1/predictions/churn/identify`, 'POST', token, data),
};

const RecommendationsAPI = {
    generateAllRecommendations: (token: string) =>
        apiClient<ApiTypes.GenerateAllRecommendationsResponse>('/api/v1/recommendations/generate', 'GET', token),

    getPromotionRecommendations: (token: string) =>
        apiClient<ApiTypes.RecommendationResponse[]>('/api/v1/recommendations/promotion', 'GET', token),

    getSchedulingRecommendations: (token: string) =>
        apiClient<ApiTypes.RecommendationResponse[]>('/api/v1/recommendations/scheduling', 'GET', token),

    getRetentionRecommendations: (token: string) =>
        apiClient<ApiTypes.RecommendationResponse[]>('/api/v1/recommendations/retention', 'GET', token),
        
    getInventoryRecommendations: (token: string) =>
        apiClient<ApiTypes.RecommendationResponse[]>('/api/v1/recommendations/inventory', 'GET', token),
        
    getPricingRecommendations: (token: string) =>
        apiClient<ApiTypes.RecommendationResponse[]>('/api/v1/recommendations/pricing', 'GET', token),
        
    updateRecommendationStatus: (token: string, recommendationId: string, data: ApiTypes.UpdateRecommendationStatusRequest) =>
        apiClient<ApiTypes.RecommendationResponse>(`/api/v1/recommendations/${recommendationId}/status`, 'PATCH', token, data),
};

export const API = {
    auth: AuthAPI,
    query: QueryAPI,
    integrations: IntegrationsAPI,
    training: TrainingAPI,
    insights: InsightsAPI,
    predictions: PredictionsAPI,
    recommendations: RecommendationsAPI,
};