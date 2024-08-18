<template>
  <div v-if="error" class="error">{{ error }}</div>
  <div class="results-container">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="results.length" class="results">
      <div
        v-for="(result, index) in results"
        :key="result.post.slug"
        :style="{ '--delay': `${index * 0.1}s` }"
        class="result"
      >
        <div class="result-title">
          <h3>{{ result.post.venue_name }}</h3>
          <div class="small">Score: {{ result.post.score.toFixed(2) }}</div>
        </div>
        <p class="result-text">
          {{ result.availability.page.title }}
          {{
            formatString(
              result.availability.page.subtitle,
              result.availability.formattedRequest.date,
              result.availability.formattedRequest.time,
              result.availability.formattedRequest.size,
            )
          }}
        </p>
        <div class="result-options">
          <div
            v-for="(option, index) in result.availability.recommended"
            :key="index"
            class="result-option"
          >
            <label>
              <input
                type="radio"
                :name="`booking-option-${result.post.slug}`"
                :value="index"
                v-model="selectedOptions[result.post.slug]"
              />
              {{ option.text }} at {{ option.time }}
            </label>
          </div>
        </div>
        <div class="result-controls">
          <button
            @click="book(result)"
            :disabled="selectedOption(result) === null"
          >
            Book Now
          </button>
          <button
            v-if="selectedOption(result)"
            class="clear-result"
            @click="clearSelection(result)"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
  <button
    v-if="results.length > 0 && canLoadMore"
    class="load-more"
    @click="loadMore"
  >
    Load More
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useSearchStore } from '../store/search';
import { RecommendedOption, Result } from '../types';

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
    const selectedOptions = ref<Record<string, number | null>>({});

    const searchStore = useSearchStore();

    const selectedOption = (result: Result): RecommendedOption | null => {
      const selectedOptionIndex = selectedOptions.value[result.post.slug];
      if (selectedOptionIndex !== undefined && selectedOptionIndex !== null) {
        return result.availability.recommended[selectedOptionIndex];
      }
      return null;
    };

    const clearSelection = (result: Result) => {
      selectedOptions.value[result.post.slug] = null;
    };

    const loadMore = () => {
      emit('loadMore');
    };

    const book = (result: Result) => {
      const option = selectedOption(result);
      if (option) {
        emit('bookNow', { result, option });
      } else {
        alert('Please select a booking option.');
      }
    };

    const formatString = (
      template: string,
      dateValue: string,
      timeValue: string,
      sizeValue: string,
    ) => {
      return template
        .replace('%date%', dateValue)
        .replace('%time%', timeValue)
        .replace('%size%', sizeValue);
    };

    const loading = computed(() => searchStore.loading);
    const error = computed(() => searchStore.error);

    return {
      loadMore,
      book,
      selectedOptions,
      selectedOption,
      formatString,
      loading,
      error,
      clearSelection,
    };
  },
});
</script>

<style scoped>
h2 {
  font-size: 2rem;
  margin: 2rem auto;
  text-align: center;
}

.results-container {
  overflow-y: auto;
  margin-top: 20px;
}

.results {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.result {
  padding: 20px;
  border-radius: 10px;
  border: 1px solid grey;
  flex: 1 1 calc(100% - 20px);
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s forwards;
  animation-delay: var(--delay);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
  }
}

.result-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.result-title h3 {
  margin: 0;
  font-size: 1.5rem;
}

.result-title .small {
  font-size: 13px;
}

.result-text {
  font-size: 0.9rem;
}

.result-options {
  margin-bottom: 20px;
}

.result-option label {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
}

.result-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.loading {
  background-color: rgba(255, 255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
  position: sticky;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.error {
  color: red;
  text-align: center;
}

@media screen and (min-width: 768px) {
  .result {
    max-width: calc(50% - 10px);
  }

  .results {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .load-more {
    width: fit-content;
  }
}

@media screen and (min-width: 1052px) {
  .result {
    max-width: calc(33% - 10px);
  }
}
</style>
