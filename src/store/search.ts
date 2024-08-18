import { defineStore } from 'pinia';
import axios from 'axios';
import { Criteria, Result } from '../types';

// Environment variables are loaded at build time and prepared for easier maintenance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MARKETPLACE_ID = import.meta.env.VITE_MARKETPLACE_ID;
const LOCALE = import.meta.env.VITE_LOCALE;
const GEOCODES = import.meta.env.VITE_GEOCODES;

export const useSearchStore = defineStore('search', {
  state: () => ({
    jwtToken: '',
    results: [] as Result[],
    loading: false,
    error: '',
    searchId: '',
    canLoadMore: false,
    totalResults: 0,
  }),

  actions: {
    async loginAnonymously(): Promise<void> {
      try {
        this.loading = true;
        this.error = '';

        // Perform an anonymous login to get a JWT token
        const response = await axios.post(`${API_BASE_URL}/loginAnonymously`);
        this.jwtToken = response.data.jwt_token;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          this.error = `Login failed: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
        } else {
          this.error = 'An unexpected error occurred while logging in.';
          console.error('Unhandled login error:', error);
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async searchRestaurants(criteria: Criteria): Promise<void> {
      // Ensure a valid JWT token is available
      if (!this.jwtToken) {
        await this.loginAnonymously();
      }
      this.loading = true;
      this.error = '';

      // Convert date and time to API-required format
      const formattedCriteria = {
        date: criteria.date.replace(/-/g, ''),
        time: criteria.time.replace(/:/g, ''),
        size: criteria.size,
      };

      try {
        // Request a search token with formatted criteria
        const response = await axios.post(
          `${API_BASE_URL}/search_token`,
          {
            criteria: formattedCriteria,
            marketplace_id: MARKETPLACE_ID,
            locale: LOCALE,
            geocodes: [GEOCODES],
          },
          {
            headers: {
              token: this.jwtToken,
            },
          },
        );
        this.searchId = response.data.search_id; // Save the search ID for subsequent requests
        await this.fetchResults(); // Fetch initial search results
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Check for token expiration error
          if (
            error.response.status === 400 &&
            error.response.data.message === '"Token expired"'
          ) {
            await this.loginAnonymously();
            return this.searchRestaurants(criteria); // Retry with new token
          }
          this.error = `Search failed: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
        } else if (!this.jwtToken) {
          this.error =
            'Missing authentication token. Please try logging in again.';
        } else {
          this.error = 'An unexpected error occurred during the search.';
          console.error('Unhandled search error:', error);
        }
      } finally {
        this.loading = false;
      }
    },

    async fetchResults(): Promise<void> {
      try {
        this.loading = true;
        this.error = '';

        // Request search results using the search ID
        const response = await axios.post(
          `${API_BASE_URL}/search_request`,
          { search_id: this.searchId },
          {
            headers: {
              token: this.jwtToken,
            },
          },
        );
        this.results = response.data.posts;
        this.totalResults = response.data.total;
        // Determine if more results can be fetched
        this.canLoadMore = this.results.length < this.totalResults;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Check for token expiration error
          if (
            error.response.status === 400 &&
            error.response.data.message === '"Token expired"'
          ) {
            await this.loginAnonymously();
            return this.fetchResults(); // Retry with new token
          }
          this.error = `Fetching results failed: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
        } else if (!this.searchId) {
          this.error = 'Search ID is missing. Please try searching again.';
        } else {
          this.error = 'An unexpected error occurred while fetching results.';
          console.error('Unhandled fetch results error:', error);
        }
      } finally {
        this.loading = false;
      }
    },

    async loadMoreResults(): Promise<void> {
      this.loading = true;
      this.error = '';

      try {
        // Request additional search results
        const response = await axios.post(
          `${API_BASE_URL}/search_request`,
          { search_id: this.searchId },
          {
            headers: {
              token: this.jwtToken,
            },
          },
        );
        if (response.data.posts.length < 1) {
          this.canLoadMore = false; // No more results available
          return;
        }
        this.results = [...this.results, ...response.data.posts]; // Append new results to existing ones
        this.canLoadMore = this.results.length < this.totalResults;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Check for token expiration error
          if (
            error.response.status === 400 &&
            error.response.data.message === '"Token expired"'
          ) {
            await this.loginAnonymously();
            return this.loadMoreResults(); // Retry with new token
          }
          this.error = `Loading more results failed: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
        } else {
          this.error =
            'An unexpected error occurred while loading more results.';
          console.error('Unhandled load more results error:', error);
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
