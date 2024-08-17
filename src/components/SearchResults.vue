<template>
  <div v-if="error" class="error">{{ error }}</div>
  <div class="results-container">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="results.length" class="results">
      <div v-for="result in results" :key="result.post.slug" class="result">
        <div class="result-title">
          <h3>{{ result.post.venue_name }}</h3>
          <div class="small">Score: {{ result.post.score.toFixed(2) }}</div>
        </div>
        <p>
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
        <button
          @click="book(result)"
          :disabled="selectedOption(result) === null"
        >
          Book Now
        </button>
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

    const loadMore = () => {
      emit('loadMore');
    };

    const selectedOption = (result: Result): RecommendedOption | null => {
      const selectedOptionIndex = selectedOptions.value[result.post.slug];
      if (selectedOptionIndex !== undefined && selectedOptionIndex !== null) {
        return result.availability.recommended[selectedOptionIndex];
      }
      return null;
    };

    const book = (result: Result) => {
      const option = selectedOption(result);
      if (option) {
        alert(`Booking at ${result.post.venue_name} at ${option.time}`);
        emit('bookNow', result);
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
  overflow-y: auto;
}

.result {
  padding: 20px;
  border-radius: 10px;
  border: 1px solid grey;
  flex: 1 1 calc(100% - 20px);
}

.result-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result-options {
  margin-bottom: 20px;
}

.load-more {
  width: 100%;
  align-self: center;
  margin-top: 20px;
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
    justify-content: center;
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
