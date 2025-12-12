import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
