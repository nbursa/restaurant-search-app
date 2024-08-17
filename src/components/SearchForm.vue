<template>
  <div v-if="results" class="search-status">
    <div>
      Results for inquiry: {{ `${size} guests, on ${date}, at ${time}` }}
    </div>
    <button @click="resetSearch">New Search</button>
  </div>
  <form v-else @submit.prevent="submitSearch" class="form">
    <div class="form-group">
      <label for="size">Number of Guests</label>
      <input type="number" id="size" v-model="size" required />
    </div>
    <div class="form-group">
      <label for="date">Date of Reservation</label>
      <input type="date" id="date" v-model="date" required />
    </div>
    <div class="form-group">
      <label for="time">Time</label>
      <input type="time" id="time" v-model="time" required />
    </div>
    <button type="submit" class="submit-button">Search</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    results: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['submit', 'reset'],
  setup(_, { emit }) {
    const size = ref<number>(2);

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);
    const currentTimeString = currentTime.toTimeString().slice(0, 5);

    const date = ref<string>(currentDateString);
    const time = ref<string>(currentTimeString);

    const submitSearch = () => {
      emit('submit', {
        size: String(size.value),
        date: date.value,
        time: time.value,
      });
    };

    const resetSearch = () => {
      size.value = 2;
      date.value = currentDateString;
      time.value = currentTimeString;
      emit('reset');
    };

    return {
      size,
      date,
      time,
      submitSearch,
      resetSearch,
    };
  },
});
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 45px;
}

.submit-button {
  padding: 10px 20px;
  border: none;
  height: 50px;
  border-radius: 5px;
  cursor: pointer;
}

.search-status {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

@media (min-width: 520px) and (max-width: 767px) {
  .form {
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }

  .form-group {
    margin-bottom: 0;
  }

  label {
    font-size: 0.75em;
  }

  input {
    padding: 8px;
    font-size: 0.75em;
  }

  .submit-button {
    padding: 8px 16px;
    font-size: 0.75em;
    align-self: self-end;
    height: 47px;
  }
}

@media (min-width: 768px) {
  .form {
    flex-direction: row;
    gap: 10px;
    align-items: flex-end;
    max-width: 768px;
    margin: 0 auto;
  }

  .form-group {
    flex: 1;
    margin-bottom: 0;
  }

  .submit-button {
    flex: 1;
    margin-top: 0;
    height: 47px;
  }
}
</style>
