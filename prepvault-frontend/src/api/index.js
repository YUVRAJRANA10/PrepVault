import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getExperiences = (params) => api.get('/experiences', { params })
export const createExperience = (data) => api.post('/experiences', data)
export const updateExperience = (id, data) => api.put(`/experiences/${id}`, data)
export const deleteExperience = (id) => api.delete(`/experiences/${id}`)
export const getCommonQuestions = (company) => api.get(`/analytics/common-questions/${company}`)
export const getDifficultySummary = () => api.get('/analytics/difficulty-summary')
