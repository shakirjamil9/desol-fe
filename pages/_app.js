import "@/styles/globals.css"
import queryClient from "@/utils/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Component {...pageProps} />;
    </QueryClientProvider>
  )
}
