
import { axiosInstance } from "@/utils/axios-instance";
import { handleApiError } from "@/utils/error-handler";
import { RegisterFormData } from "@/validation/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const loginUser = async ( ipAddress: string, username: string, password: string
) => {
  const response = await axiosInstance.post(
    "/auth/login",{ipAddress, username, password}
  );
  
  return response.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ ipAddress, username, password}: {  ipAddress: string, username: string, password: string}) =>
    loginUser( ipAddress, username, password),
    onError: (error) => {
        handleApiError(error)
    },
  });
};

const passportLogin = async (username: string, password: string) => {
  const response = await axiosInstance.post(
    "/auth/passport-login",{ username, password}
  );
  return response.data;
}

export const usePassportLogin = () => {
  return useMutation({
    mutationFn: ({ username, password}: {  username: string, password: string}) =>
    passportLogin( username, password),
    onError: (error) => {
        handleApiError(error)
    },
  });
};

const logoutUser = async ( ) => {
  const response = await axiosInstance.post(
    "/auth/logout",
  );
  
  return response.data;
};

export const useLogout = () => {

  return useMutation({
    mutationFn: () =>
    logoutUser(),
    onError: (error) => {
      handleApiError(error);
    },
  });
};


const registerUser = async (
  data: RegisterFormData
) => {
  const response = await axiosInstance.post(
    "/auth/register",data
  );
  
  return response.data;
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) =>registerUser(data),
    onError: (error) => {
        handleApiError(error)
    },
  });
};


export const checkReferral = async (id: string): Promise<any> => { 
  const response = await axiosInstance.get(
    "/auth/getreferralusername",{params:{id}}
  )
  return response.data
  
};

export const useCheckReferral = (id: string) => {
  return useQuery({
    queryKey: ["check-referral",id],
    queryFn: () => checkReferral(id),
    retry: false,
    enabled: !!id
  });
};


















