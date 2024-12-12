import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField, Button, Box, Typography } from "@mui/material"
import { loginUser } from "@/services/authService"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
})

const LoginForm = () => {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: data => {
      localStorage.setItem('token', data.token)
      toast.success("Login successful!")
      setTimeout(() => {
        router.push("/vehicle-details")
      }, 1500)
    },
    onError: error => {
      console.log(error, "error")
      toast.error(error.response?.data?.message || "Login failed.")
    },
  })

  const onSubmit = data => {
    loginMutation.mutate(data)
    // Handle login logic here (e.g., make API call)
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              fullWidth
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              margin="normal"
            />
          )}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Box>
  )
}

export default LoginForm
