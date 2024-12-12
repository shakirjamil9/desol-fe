import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  InputLabel,
  IconButton,
  MenuItem,
} from "@mui/material"
import { styled } from "@mui/system"
import { useDropzone } from "react-dropzone"
import DeleteIcon from "@mui/icons-material/Delete"
import { useMutation } from "@tanstack/react-query"
import { createVehicle } from "@/services/vehicleService"
import { toast } from "react-toastify"

const schema = yup.object().shape({
  carModel: yup
    .string()
    .required("Car Model is required")
    .min(3, "Minimum 3 characters required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Must be a positive number"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{11}$/, "Must be exactly 11 digits"),
  city: yup
    .string()
    .required("City is required")
    .min(3, "Minimum 3 characters required"),
  maxPictures: yup
    .number()
    .required("Max number of pictures is required")
    .min(1, "At least 1 picture")
    .max(10, "No more than 10 pictures"),
  pictures: yup
    .array()
    .of(yup.mixed())
    .max(yup.ref("maxPictures"), "Too many pictures uploaded"),
})

const Thumbnail = styled("img")(({ theme }) => ({
  width: "80px",
  height: "80px",
  objectFit: "cover",
  margin: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}))

const VehicleForm = () => {
  const [thumbnails, setThumbnails] = useState([])
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      carModel: "",
      price: 150,
      city: "",
      phone: "",
      maxPictures: 2,
      pictures: [],
    },
  })

  const maxPictures = watch("maxPictures")

  const { mutate, isLoading } = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      toast.success("Vehicle created successfully")
      reset()
      setThumbnails([])
    },
    onError: error => {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred."
      toast.error(errorMessage)
    },
  })

  const onSubmit = data => {
    mutate(data)
  }

  const handleDrop = acceptedFiles => {
    if (acceptedFiles.length + thumbnails.length > parseInt(maxPictures)) {
      alert("You cannot upload more pictures than the specified maximum!")
      return
    }

    const newThumbnails = acceptedFiles.map(file => URL.createObjectURL(file))
    setThumbnails(prev => [...prev, ...newThumbnails])
    setValue("pictures", [...watch("pictures"), ...acceptedFiles])
  }

  const handleDelete = index => {
    const currentFiles = watch("pictures") || []
    const updatedFiles = currentFiles.filter((_, i) => i !== index)
    setThumbnails(
      updatedFiles.map(file =>
        typeof file === "string" ? file : URL.createObjectURL(file)
      )
    )
    setValue("pictures", updatedFiles)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
    multiple: true,
  })

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Submit Your Vehicle Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="carModel"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Car Model"
                  fullWidth
                  error={!!errors.carModel}
                  helperText={errors.carModel?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price"
                  type="number"
                  fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  label="Phone Number"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="City"
                  fullWidth
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="maxPictures"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Max Number of Pictures"
                  fullWidth
                  error={!!errors.maxPictures}
                  helperText={errors.maxPictures?.message}
                  select
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="pictures">Upload Pictures</InputLabel>
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed #ccc",
                padding: 2,
                textAlign: "center",
                cursor: "pointer",
                marginBottom: 2,
              }}
            >
              <input {...getInputProps()} />
              <Typography variant="body2">
                Drag and drop files here, or click to select
              </Typography>
            </Box>
            {errors.pictures && (
              <Typography color="error" variant="body2">
                {errors.pictures.message}
              </Typography>
            )}
            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
              {thumbnails.map((src, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <Thumbnail src={src} alt={`Thumbnail ${index + 1}`} />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                    }}
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={isLoading}
              type="submit"
              variant="contained"
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default VehicleForm
