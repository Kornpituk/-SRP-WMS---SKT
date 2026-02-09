import { urlApi } from '@/api'
import axios from '@axios'

class UserService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_URL || process.env.VUE_APP_API_URL,
    })
  }

  /**
   * Get current user information
   * @param {string} accessToken - JWT access token
   * @returns {Promise} User data
   */
  async getCurrentUser(accessToken) {
    try {
      const response = await this.apiClient.get('/api/v1/User/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error('Error fetching user info:', error)
      throw error
    }
  }
}

export default new UserService()
