import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'
export const getRootFolder = async () => {
  const response = await axios.get(`${API_BASE_URL}/folders`)
  return response.data
}
export const getFolderChildren = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/folders/${id}/children`)
  return response.data
}
export const getFolderTree = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/folders/${id}/tree`)
  return response.data
}
