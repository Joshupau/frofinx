// /api/v1/categories routes

import { axiosInstance } from "@/utils/axios-instance";
import { handleApiError } from "@/utils/error-handler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateCategoryData,
  UpdateCategoryData,
  ArchiveCategoryData,
  ListCategoriesParams,
} from "@/types/category";

// Create Category
const createCategory = async (data: CreateCategoryData) => {
  const response = await axiosInstance.post("/category/create", data);
  return response.data;
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: (data: CreateCategoryData) => createCategory(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// List Categories
const listCategories = async (params: ListCategoriesParams) => {
  const response = await axiosInstance.get("/category/list", { params });
  return response.data;
};

export const useListCategories = (params?: ListCategoriesParams) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => listCategories(params || {}),
    enabled: true,
  });
};

// Update Category
const updateCategory = async (data: UpdateCategoryData) => {
  const response = await axiosInstance.post("/category/update", data);
  return response.data;
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: (data: UpdateCategoryData) => updateCategory(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Archive Category
const archiveCategory = async (data: ArchiveCategoryData) => {
  const response = await axiosInstance.post("/category/archive", data);
  return response.data;
};

export const useArchiveCategory = () => {
  return useMutation({
    mutationFn: (data: ArchiveCategoryData) => archiveCategory(data),
    onError: (error) => {
      handleApiError(error);
    },
  });
};

// Get Category Summary
const getCategorySummary = async () => {
  const response = await axiosInstance.get("/category/summary");
  return response.data;
};

export const useCategorySummary = () => {
  return useQuery({
    queryKey: ["category-summary"],
    queryFn: () => getCategorySummary(),
    enabled: true,
  });
};