// UserService.js
import createApiClient from "./api.service";
import {jwtDecode} from 'jwt-decode';

class UserService {
  constructor(baseUrl = "/api/staffs") {
    this.api = createApiClient(baseUrl);
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Decode the token
      const decodedToken = jwtDecode(token);

      // Get the user id from the decoded token
      const userId = decodedToken.userId
      // Use the user id to get the user's information
      const response = await this.api.get(`/${userId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default new UserService();
