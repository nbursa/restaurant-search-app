<template>
  <div class="search-page">
    <h1>Restaurant Search</h1>
    <SearchForm @submit="performSearch" />

    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">{{ error }}</div>

    <SearchResults
      v-if="results.length > 0"
      :results="results"
      :canLoadMore="canLoadMore"
      @loadMore="loadMore"
      @bookNow="bookNow"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSearchStore } from '../store/search';
import SearchForm from '../components/SearchForm.vue';
import SearchResults from '../components/SearchResults.vue';

interface Criteria {
  size: string;
  date: string;
  time: string;
}

export default defineComponent({
  components: {
    SearchForm,
    SearchResults,
  },
  setup() {
    const searchStore = useSearchStore();
    const performSearch = async (criteria: Criteria) => {
      await searchStore.searchRestaurants(criteria);
    };

    const loadMore = async () => {
      await searchStore.loadMoreResults();
    };

    const bookNow = (result: any) => {
      alert(`Booking at ${result.venue_name} at ${result.subtitle}`);
    };

    return {
      performSearch,
      loadMore,
      bookNow,
      results: searchStore.results,
      loading: searchStore.loading,
      error: searchStore.error,
      canLoadMore: searchStore.canLoadMore,
    };
  },
});
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
}
.error {
  color: red;
  text-align: center;
}
</style>
