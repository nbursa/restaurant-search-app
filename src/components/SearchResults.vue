<template>
  <h2>Search Results</h2>
  <div class="results">
    <div v-for="result in results" :key="result.post.slug" class="result">
      <h3>{{ result.post.venue_name }}</h3>
      <p>{{ result.availability.page.subtitle }}</p>
      <button @click="book(result.post)">Book Now</button>
    </div>
    <button v-if="canLoadMore" @click="loadMore">Load More</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Result {
  post: {
    slug: string;
    venue_name: string;
  };
  availability: {
    page: {
      subtitle: string;
    };
  };
}

export default defineComponent({
  props: {
    results: {
      type: Array as () => Result[],
      required: true,
    },
    canLoadMore: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['loadMore', 'bookNow'],
  setup(_, { emit }) {
    const loadMore = () => {
      emit('loadMore');
    };

    const book = (result: Result['post']) => {
      emit('bookNow', result);
    };

    return {
      loadMore,
      book,
    };
  },
});
</script>

<style scoped>
.results {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result {
  padding: 20px;
  border-radius: 10px;
  border: 1px solid grey;
}

@media screen and (min-width: 768px) {
  .results {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
