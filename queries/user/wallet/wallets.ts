// /api/v1/wallet routes

import { axiosInstance } from "@/utils/axios-instance";
import { handleApiError } from "@/utils/error-handler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateWalletData,
  UpdateWalletData,
  AdjustBalanceData,
  ArchiveWalletData,
  ListWalletsParams,
  GetWalletParams,
} from "@/types/wallet";

// Create Wallet
const createWallet = async (data: CreateWalletData) => {
  const response = await axiosInstance.post("/wallet/create", data);
  return response.data;
};

export const useCreateWallet = () => {
  return useMutation({
    mutationFn: (data: CreateWalletData) => createWallet(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// List Wallets
const listWallets = async (params: ListWalletsParams) => {
  const response = await axiosInstance.get("/wallet/list", { params });
  return response.data;
};

export const useListWallets = (params?: ListWalletsParams) => {
  return useQuery({
    queryKey: ["wallets", params],
    queryFn: () => listWallets(params || {}),
    enabled: true,
  });
};

// Get Wallet by ID
const getWallet = async (params: GetWalletParams) => {
  const response = await axiosInstance.get("/wallet/get", { params });
  return response.data;
};

export const useGetWallet = (params?: GetWalletParams) => {
  return useQuery({
    queryKey: ["wallet", params],
    queryFn: () => getWallet(params || { id: "" }),
    enabled: !!params?.id,
  });
};

// Update Wallet
const updateWallet = async (data: UpdateWalletData) => {
  const response = await axiosInstance.post("/wallet/update", data);
  return response.data;
};

export const useUpdateWallet = () => {
  return useMutation({
    mutationFn: (data: UpdateWalletData) => updateWallet(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Adjust Balance
const adjustBalance = async (data: AdjustBalanceData) => {
  const response = await axiosInstance.post("/wallet/adjust-balance", data);
  return response.data;
};

export const useAdjustBalance = () => {
  return useMutation({
    mutationFn: (data: AdjustBalanceData) => adjustBalance(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Archive Wallet
const archiveWallet = async (data: ArchiveWalletData) => {
  const response = await axiosInstance.post("/wallet/archive", data);
  return response.data;
};

export const useArchiveWallet = () => {
  return useMutation({
    mutationFn: (data: ArchiveWalletData) => archiveWallet(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Get Total Balance
const getTotalBalance = async (params: ListWalletsParams) => {
  const response = await axiosInstance.get("/wallet/total-balance", { params });
  return response.data;
};

export const useTotalBalance = (params?: ListWalletsParams) => {
  return useQuery({
    queryKey: ["wallet-total-balance", params],
    queryFn: () => getTotalBalance(params || {}),
    enabled: true,
  });
};
