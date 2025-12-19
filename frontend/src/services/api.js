/**
 * API Service Layer
 * Centralizes all API calls to the backend
 */
import { API_BASE_URL } from '../config/api';

/**
 * Property Service
 * Handles all property-related API calls
 */
export const propertyService = {
  /**
   * Get all properties
   * @returns {Promise<Object>} Promise resolving to properties data
   */
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/properties`);
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    return response.json();
  },

  /**
   * Get property details by ID
   * @param {string|number} id - Property ID
   * @returns {Promise<Object>} Promise resolving to property details
   */
  getDetails: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}/details`);
    if (!response.ok) {
      throw new Error('Failed to fetch property details');
    }
    return response.json();
  },

  /**
   * Get property by ID
   * @param {string|number} id - Property ID
   * @returns {Promise<Object>} Promise resolving to property data
   */
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch property');
    }
    return response.json();
  },
};
