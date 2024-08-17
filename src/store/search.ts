import { defineStore } from 'pinia';
import axios from 'axios';

interface Criteria {
  size: string;
  date: string;
  time: string;
}

interface RecommendedOption {
  id: string;
  method: string;
  text: string;
  time: string;
}

interface Result {
  post: {
    slug: string;
    venue_name: string;
    score: number;
  };
  availability: {
    page: {
      title: string;
      subtitle: string;
    };
    formattedRequest: {
      date: string;
      time: string;
      size: string;
      service: string;
    };
    recommended: RecommendedOption[];
  };
}

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
    async loginAnonymously() {
      try {
        this.loading = true;
        this.error = '';

        const response = await axios.post(`${API_BASE_URL}/loginAnonymously`);
        this.jwtToken = response.data.jwt_token;
      } catch (error) {
        console.error('Error:', error);
        this.error = 'Failed to log in anonymously.';
      } finally {
        this.loading = false;
      }
    },

    async searchRestaurants(criteria: Criteria) {
      if (!this.jwtToken) {
        await this.loginAnonymously();
      }
      this.loading = true;
      this.error = '';

      const formattedCriteria = {
        date: criteria.date.replace(/-/g, ''),
        time: criteria.time.replace(/:/g, ''),
        size: criteria.size,
      };

      try {
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
        this.searchId = response.data.search_id;
        await this.fetchResults();
      } catch (error) {
        console.error('Error:', error);
        this.error = 'Failed to search restaurants.';
      } finally {
        this.loading = false;
      }
    },

    async fetchResults() {
      try {
        this.loading = true;
        this.error = '';

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
        this.canLoadMore = this.results.length < this.totalResults;
      } catch (error) {
        console.error('Error:', error);
        this.error = 'Failed to fetch search results.';
      } finally {
        this.loading = false;
      }
    },

    async loadMoreResults() {
      this.loading = true;
      this.error = '';

      try {
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
          this.canLoadMore = false;
          return;
        }
        this.results = [...this.results, ...response.data.posts];
        this.canLoadMore = this.results.length < this.totalResults;
      } catch (error) {
        console.error('Error:', error);
        this.error = 'Failed to load more results.';
      } finally {
        this.loading = false;
      }
    },
  },
});
