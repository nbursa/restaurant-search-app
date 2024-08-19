<template>
  <div v-if="error" class="error">{{ error }}</div>

  <div class="toggle-container">
    <label>
      <input type="checkbox" v-model="useInfiniteScroll" />
      Infinite Scrolling
    </label>
  </div>

  <div class="results-container" @scroll="handleScroll">
    <Loader :visible="!!results.length && loading" position="fixed" />
    <transition-group :name="'fade-up'" tag="div" class="results">
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
            v-for="(option, optionIndex) in result.availability.recommended"
            :key="optionIndex"
            class="result-option"
          >
            <label>
              <input
                type="radio"
                :name="`booking-option`"
                :value="optionIndex"
                :checked="
                  selectedSlug === result.post.slug &&
                  selectedOptionIndex === optionIndex
                "
                @change="selectOption(result.post.slug, optionIndex)"
              />
              {{ option.text }} at {{ option.time }}
            </label>
          </div>
        </div>
        <div class="result-controls">
          <button
            @click="book(result)"
            :disabled="
              selectedSlug !== result.post.slug || selectedOptionIndex === null
            "
          >
            Book Now
          </button>
          <button
            v-if="selectedSlug === result.post.slug"
            class="clear-result"
            @click="clearSelection"
          >
            Clear
          </button>
        </div>
      </div>
    </transition-group>
  </div>
  <button
    v-if="!useInfiniteScroll && results.length > 0 && canLoadMore"
    class="load-more"
    @click="loadMore"
  >
    Load More
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useSearchStore } from '../store/search';
import Loader from './Loader.vue';
import { Result } from '../types';

export default defineComponent({
  components: {
    Loader,
  },
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
    const selectedSlug = ref<string | null>(null);
    const selectedOptionIndex = ref<number | null>(null);
    const useInfiniteScroll = ref<boolean>(true);

    const searchStore = useSearchStore();

    const selectOption = (resultSlug: string, optionIndex: number) => {
      selectedSlug.value = resultSlug;
      selectedOptionIndex.value = optionIndex;
    };

    const clearSelection = () => {
      selectedSlug.value = null;
      selectedOptionIndex.value = null;
    };

    const book = (result: Result) => {
      if (
        selectedSlug.value === result.post.slug &&
        selectedOptionIndex.value !== null
      ) {
        const option =
          result.availability.recommended[selectedOptionIndex.value];
        emit('bookNow', { result, option });
      } else {
        alert('Please select a booking option.');
      }
    };

    const loadMore = () => {
      emit('loadMore');
    };

    // Debounce function to limit the rate of scroll events
    const debounce = (func: Function, delay: number) => {
      let timeout: ReturnType<typeof setTimeout>;
      return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
      };
    };

    const handleScroll = debounce((event: Event) => {
      const target = event.target as HTMLElement;
      if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
        if (useInfiniteScroll.value && !loading.value && canLoadMore.value) {
          loadMore();
        }
      }
    }, 200);

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
    const canLoadMore = computed(() => searchStore.canLoadMore);

    return {
      loadMore,
      book,
      selectedSlug,
      selectedOptionIndex,
      formatString,
      loading,
      error,
      clearSelection,
      selectOption,
      handleScroll,
      useInfiniteScroll,
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

.toggle-container {
  margin-bottom: 20px;
  text-align: center;
}

.results-container {
  position: relative;
  overflow-y: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result {
  padding: 20px;
  border-radius: 10px;
  border: 1px solid grey;
  flex: 1 1 calc(100% - 20px);
  opacity: 0;
  transform: translateY(0);
  animation: fadeInUp 0.5s forwards ease-out;
  animation-delay: var(--delay);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease-out;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
