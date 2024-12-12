import axiosInstance from "@/utils/axiosInstance"

export const createVehicle = async data => {
  const formData = new FormData()
  formData.append("carModel", data.carModel)
  formData.append("price", data.price)
  formData.append("city", data.city)
  formData.append("phone", data.phone)
  data.pictures.forEach(file => formData.append("pictures", file))

  const res = await axiosInstance.post("/v1/vehicles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("key")}`,
    },
  })
  res.data
}
