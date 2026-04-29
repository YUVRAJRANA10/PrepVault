import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({ baseURL: API_URL })

function normalizeExperience(experience) {
  if (!experience) return experience

  const submittedBy = typeof experience.submittedBy === 'object'
    ? experience.submittedBy?.username || experience.submittedBy?.email || 'Anonymous'
    : experience.submittedBy

  return {
    ...experience,
    id: experience.id || experience._id,
    submittedBy
  }
}

function normalizeExperiencePayload(response) {
  if (!response.config.url?.includes('/experiences')) return response

  if (Array.isArray(response.data?.data)) {
    response.data.data = response.data.data.map(normalizeExperience)
  } else if (response.data?.data) {
    response.data.data = normalizeExperience(response.data.data)
  }

  return response
}

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => normalizeExperiencePayload(response),
  (error) => {
    return Promise.reject(error)
  }
)

// Auth endpoints
export const signup = (data) => api.post('/auth/signup', data)
export const login = (data) => api.post('/auth/login', data)

// Experience endpoints
export const getExperiences = (params) => api.get('/experiences', { params })
export const createExperience = (data) => api.post('/experiences', data)
export const updateExperience = (id, data) => api.put(`/experiences/${id}`, data)
export const deleteExperience = (id) => api.delete(`/experiences/${id}`)

// Analytics endpoints
export const getCommonQuestions = (company) => api.get(`/analytics/common-questions/${company}`)
export const getDifficultySummary = () => api.get('/analytics/difficulty-summary')
