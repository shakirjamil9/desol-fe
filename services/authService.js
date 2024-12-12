import axiosInstance from "@/utils/axiosInstance"

export const loginUser = async data => {
  const response =  await axiosInstance.post("/v1/auth/login", data)
  return response.data
}
