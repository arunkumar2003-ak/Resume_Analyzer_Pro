import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const checkHealth = () => api.get('/health')
export const registerUser = (data) => api.post('/register', data)
export const loginUser = (data) => api.post('/login', data)
export const getMe = () => api.get('/me')

export const uploadResume = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const getHistory = () => api.get('/history')

export const analyzeResume = (resumeId) => api.post(`/analyze/${resumeId}`)
export const getAnalysis = (resumeId) => api.get(`/analysis/${resumeId}`)
export const downloadReport = (resumeId) =>
  api.get(`/analysis/${resumeId}/download`, { responseType: 'blob' })

export const createOrder = (data) => api.post('/payment/create-order', data)
export const verifyPayment = (data) => api.post('/payment/verify', data)

export const getAdminStats = () => api.get('/admin/stats')

export default api
