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
  BillCalendarParams,
} from "@/types/bill";

// Create Bill
const createBill = async (data: CreateBillData) => {
  const response = await axiosInstance.post("/bill/create", data);
  return response.data;
};

export const useCreateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBillData) => createBill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill-summary"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-bills"] });
      queryClient.invalidateQueries({ queryKey: ["overdue-bills"] });
    },
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBillData) => updateBill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill-summary"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-bills"] });
      queryClient.invalidateQueries({ queryKey: ["overdue-bills"] });
    },
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkPaidData) => markPaid(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill-summary"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-bills"] });
      queryClient.invalidateQueries({ queryKey: ["overdue-bills"] });
    },
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkUnpaidData) => markUnpaid(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill-summary"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-bills"] });
      queryClient.invalidateQueries({ queryKey: ["overdue-bills"] });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Archive Bill
const archiveBill = async (data: { id: string }) => {
  const response = await axiosInstance.post("/bill/delete", data);
  return response.data;
};

export const useArchiveBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) => archiveBill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill-summary"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-bills"] });
      queryClient.invalidateQueries({ queryKey: ["overdue-bills"] });
    },
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


const getBillCalendar = async (params: BillCalendarParams) => {
  const response = await axiosInstance.get("/bill/calendar", { params });
  return response.data;
};

export const useBillCalendar = (params?: BillCalendarParams) => {
  return useQuery({
    queryKey: ["bill-calendar", params],
    queryFn: () => getBillCalendar(params || {}),
    enabled: true,
  });
}
