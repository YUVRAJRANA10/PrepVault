import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/api'
const api = axios.create({ baseURL })
const TOKEN_KEY = 'prepvault_token'

api.interceptors.request.use((config) => {
	const token = localStorage.getItem(TOKEN_KEY)
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

export const getExperiences = (params) => api.get('/experiences', { params })
export const createExperience = (data) => {
	if (data instanceof FormData) {
		return api.post('/experiences', data, { headers: { 'Content-Type': 'multipart/form-data' } })
	}
	return api.post('/experiences', data)
}
export const updateExperience = (id, data) => api.put(`/experiences/${id}`, data)
export const deleteExperience = (id) => api.delete(`/experiences/${id}`)
export const getCommonQuestions = (company) => api.get(`/analytics/common-questions/${company}`)
export const getDifficultySummary = () => api.get('/analytics/difficulty-summary')
export const addComment = (id, text) => api.post(`/experiences/${id}/comments`, { text })
export const upvoteExperience = (id) => api.post(`/experiences/${id}/upvote`)
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)

export const setAuthToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const getAuthToken = () => localStorage.getItem(TOKEN_KEY)
export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY)

export const getMe = () => api.get('/user/me')
export const getUserExperiences = () => api.get('/user/my-experiences')
export const toggleFavorite = (experienceId) => api.post('/user/toggle-favorite', { experienceId })
