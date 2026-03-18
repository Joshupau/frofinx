// /api/v1/budget routes

import { axiosInstance } from "@/utils/axios-instance";
import { handleApiError } from "@/utils/error-handler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateBudgetData,
  UpdateBudgetData,
  ListBudgetsParams,
  CurrentBudgetsParams,
  BudgetStatusParams,
} from "@/types/budget";

// Create Budget
const createBudget = async (data: CreateBudgetData) => {
  const response = await axiosInstance.post("/budget/create", data);
  return response.data;
};

export const useCreateBudget = () => {
  return useMutation({
    mutationFn: (data: CreateBudgetData) => createBudget(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// List Budgets
const listBudgets = async (params: ListBudgetsParams) => {
  const response = await axiosInstance.get("/budget/list", { params });
  return response.data;
};

export const useListBudgets = (params?: ListBudgetsParams) => {
  return useQuery({
    queryKey: ["budgets", params],
    queryFn: () => listBudgets(params || {}),
    enabled: true,
  });
};

// Update Budget
const updateBudget = async (data: UpdateBudgetData) => {
  const response = await axiosInstance.post("/budget/update", data);
  return response.data;
};

export const useUpdateBudget = () => {
  return useMutation({
    mutationFn: (data: UpdateBudgetData) => updateBudget(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Get Current Budgets
const getCurrentBudgets = async (params: CurrentBudgetsParams) => {
  const response = await axiosInstance.get("/budget/current", { params });
  return response.data;
};

export const useCurrentBudgets = (params?: CurrentBudgetsParams) => {
  return useQuery({
    queryKey: ["current-budgets", params],
    queryFn: () => getCurrentBudgets(params || {}),
    enabled: true,
  });
};

// Check Budget Status
const checkBudgetStatus = async (params: BudgetStatusParams) => {
  const response = await axiosInstance.get("/budget/status", { params });
  return response.data;
};

export const useBudgetStatus = (params?: BudgetStatusParams) => {
  return useQuery({
    queryKey: ["budget-status", params],
    queryFn: () => checkBudgetStatus(params || { id: "" }),
    enabled: !!params?.id,
  });
};

// Get Budget Summary
const getBudgetSummary = async () => {
  const response = await axiosInstance.get("/budget/summary");
  return response.data;
};

export const useBudgetSummary = () => {
  return useQuery({
    queryKey: ["budget-summary"],
    queryFn: () => getBudgetSummary(),
    enabled: true,
  });
};

const getPerformance = async () => {
  const response = await axiosInstance.get("/budget/performance");
  return response.data;
}

export const useBudgetPerformance = () => {
  return useQuery({
    queryKey: ["budget-performance"],
    queryFn: () => getPerformance(),
    enabled: true,
  });
}

const getSuggestions = async () => {
  const response = await axiosInstance.get("/budget/suggestions");
  return response.data;
}

export const useBudgetSuggestions = () => {
  return useQuery({
    queryKey: ["budget-suggestions"],
    queryFn: () => getSuggestions(),
    enabled: true,
  });
}

export const rolloverBudget = async (id: string) => {
  const response = await axiosInstance.post("/budget/rollover", { id });
  return response.data;
}

export const useRolloverBudget = () => {
  return useMutation({
    mutationFn: (id: string) => rolloverBudget(id),
    onError: (error) => {
      handleApiError(error);
    },
  });
}

