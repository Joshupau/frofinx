// /api/v1/bill routes

import { axiosInstance } from "@/utils/axios-instance";
import { handleApiError } from "@/utils/error-handler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateBillData,
  UpdateBillData,
  MarkPaidData,
  MarkUnpaidData,
  ListBillsParams,
  UpcomingBillsParams,
} from "@/types/bill";

// Create Bill
const createBill = async (data: CreateBillData) => {
  const response = await axiosInstance.post("/bill/create", data);
  return response.data;
};

export const useCreateBill = () => {
  return useMutation({
    mutationFn: (data: CreateBillData) => createBill(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// List Bills
const listBills = async (params: ListBillsParams) => {
  const response = await axiosInstance.get("/bill/list", { params });
  return response.data;
};

export const useListBills = (params?: ListBillsParams) => {
  return useQuery({
    queryKey: ["bills", params],
    queryFn: () => listBills(params || {}),
    enabled: true,
  });
};

// Update Bill
const updateBill = async (data: UpdateBillData) => {
  const response = await axiosInstance.post("/bill/update", data);
  return response.data;
};

export const useUpdateBill = () => {
  return useMutation({
    mutationFn: (data: UpdateBillData) => updateBill(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Mark Bill as Paid
const markPaid = async (data: MarkPaidData) => {
  const response = await axiosInstance.post("/bill/mark-paid", data);
  return response.data;
};

export const useMarkBillPaid = () => {
  return useMutation({
    mutationFn: (data: MarkPaidData) => markPaid(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Mark Bill as Unpaid
const markUnpaid = async (data: MarkUnpaidData) => {
  const response = await axiosInstance.post("/bill/mark-unpaid", data);
  return response.data;
};

export const useMarkBillUnpaid = () => {
  return useMutation({
    mutationFn: (data: MarkUnpaidData) => markUnpaid(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Get Upcoming Bills
const getUpcomingBills = async (params: UpcomingBillsParams) => {
  const response = await axiosInstance.get("/bill/upcoming", { params });
  return response.data;
};

export const useUpcomingBills = (params?: UpcomingBillsParams) => {
  return useQuery({
    queryKey: ["upcoming-bills", params],
    queryFn: () => getUpcomingBills(params || {}),
    enabled: true,
  });
};

// Get Overdue Bills
const getOverdueBills = async () => {
  const response = await axiosInstance.get("/bill/overdue");
  return response.data;
};

export const useOverdueBills = () => {
  return useQuery({
    queryKey: ["overdue-bills"],
    queryFn: () => getOverdueBills(),
    enabled: true,
  });
};

// Get Bill Summary
const getBillSummary = async () => {
  const response = await axiosInstance.get("/bill/summary");
  return response.data;
};

export const useBillSummary = () => {
  return useQuery({
    queryKey: ["bill-summary"],
    queryFn: () => getBillSummary(),
    enabled: true,
  });
};
