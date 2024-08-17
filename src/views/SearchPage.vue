<template>
  <div class="search-page">
    <h1>Restaurant Search</h1>
    <SearchForm
      :results="results.length > 0"
      @submit="performSearch"
      @reset="resetSearch"
    />
    <SearchResults
      :results="results"
      :canLoadMore="canLoadMore"
      @loadMore="loadMore"
      @bookNow="bookNow"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
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

    const resetSearch = () => {
      searchStore.results = [];
    };

    const loadMore = async () => {
      await searchStore.loadMoreResults();
    };

    const results = computed(() => searchStore.results);
    const canLoadMore = computed(() => searchStore.canLoadMore);

    const bookNow = (result: any) => {
      alert(`Booking at ${result.venue_name} at ${result.subtitle}`);
    };

    return {
      performSearch,
      resetSearch,
      loadMore,
      bookNow,
      results,
      canLoadMore,
    };
  },
});
</script>

<style scoped>
h1 {
  font-size: 2rem;
  text-align: center;
}
.search-page {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
}
</style>
