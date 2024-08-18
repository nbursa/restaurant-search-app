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
import { Criteria, Result, RecommendedOption } from '../types';

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

    const bookNow = ({
      result,
      option,
    }: {
      result: Result;
      option: RecommendedOption;
    }) => {
      alert(
        `Booking at ${result.post.venue_name}, ${option.text} at ${option.time}`,
      );
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
  align-items: center;
  justify-content: center;
  max-width: 1268px;
  margin: 0 auto;
}
</style>
