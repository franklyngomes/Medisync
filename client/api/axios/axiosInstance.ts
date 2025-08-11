import axios from 'axios'

const baseURL = "http://localhost:5000/api"

export const axiosInstance = axios.create({
  baseURL
})

export const reportApi = axios.create({
  baseURL: "http://localhost:5000/report"
})