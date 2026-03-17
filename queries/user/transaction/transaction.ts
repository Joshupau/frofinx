// /api/v1/transaction routes

import { axiosInstance, axiosInstanceFormData } from "@/utils/axios-instance";
import { handleApiError } from "@/utils/error-handler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateTransactionData,
  ListTransactionsParams,
  UpdateTransactionData,
  DeleteTransactionData,
  GetMonthlyReportParams,
  GetCategoryBreakdownParams,
  ImportTransactionsData,
  transactionsSummaryParams,
  quickStatsTransactionParams,
} from "@/types/transaction";

// Create Transaction
const createTransaction = async (data: CreateTransactionData) => {
  const response = await axiosInstance.post("/transaction/create", data);
  return response.data;
};

export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: (data: Parameters<typeof createTransaction>[0]) =>
      createTransaction(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// List Transactions
const listTransactions = async (params: ListTransactionsParams) => {
  const response = await axiosInstance.get("/transaction/list", { params });
  return response.data;
};

export const useListTransactions = (params?: ListTransactionsParams) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => listTransactions(params || {}),
    enabled: true,
  });
};

// Update Transaction
const updateTransaction = async (data: UpdateTransactionData) => {
  const response = await axiosInstance.post("/transaction/update", data);
  return response.data;
};

export const useUpdateTransaction = () => {
  return useMutation({
    mutationFn: (data: Parameters<typeof updateTransaction>[0]) =>
      updateTransaction(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Delete Transaction
const deleteTransaction = async (data: { id: string }) => {
  const response = await axiosInstance.post("/transaction/delete", data);
  return response.data;
};

export const useDeleteTransaction = () => {
  return useMutation({
    mutationFn: (data: Parameters<typeof deleteTransaction>[0]) =>
      deleteTransaction(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Get Monthly Report
const getMonthlyReport = async (params: GetMonthlyReportParams) => {
  const response = await axiosInstance.get("/transaction/report/monthly", { params });
  return response.data;
};

export const useMonthlyReport = (params?: GetMonthlyReportParams) => {
  return useQuery({
    queryKey: ["transaction-monthly-report", params],
    queryFn: () => getMonthlyReport(params || {}),
    enabled: true,
  });
};

// Get Category Breakdown
const getCategoryBreakdown = async (params: GetCategoryBreakdownParams) => {
  const response = await axiosInstance.get("/transaction/report/category", { params });
  return response.data;
};

export const useCategoryBreakdown = (params?: GetCategoryBreakdownParams) => {
  return useQuery({
    queryKey: ["transaction-category-breakdown", params],
    queryFn: () => getCategoryBreakdown(params || { type: 'expense' }),
    enabled: true,
  });
};


// Import Transactions
const importTransactions = async (data: ImportTransactionsData) => {
  const response = await axiosInstanceFormData.post("/transaction/import", data);
  return response.data;
}

export const useImportTransactions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof importTransactions>[0]) =>
      importTransactions(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

const getSummary = async (params: transactionsSummaryParams) => {
  const response = await axiosInstance.get("/transaction/summary", { params });
  return response.data;
}

export const useTransactionsSummary = (params?: transactionsSummaryParams) => {
  return useQuery({
    queryKey: ["transactions-summary", params],
    queryFn: () => getSummary(params || {}),
    enabled: true,
  });
}

const getQuickStats = async (params: quickStatsTransactionParams) => {
  const response = await axiosInstance.get("/transaction/quick-stats", { params });
  return response.data;
}

export const useQuickStats = (params?: quickStatsTransactionParams) => {
  return useQuery({
    queryKey: ["transactions-quick-stats", params],
    queryFn: () => getQuickStats(params || { period: 'month' }),
    enabled: true,
  });
}

const getTransactionTags = async () => {
  const response = await axiosInstance.get("/transaction/tags");
  return response.data;
}

export const useTransactionTags = () => {
  return useQuery({
    queryKey: ["transaction-tags"],
    queryFn: () => getTransactionTags(),
    enabled: true,
  });
}
