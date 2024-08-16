<template>
  <div class="home-page">
    <h1>Home page</h1>
    <p>
      <RouterLink to="/search">Search Restaurants</RouterLink>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router';

export default defineComponent({
  components: {RouterLink},
  setup() {}
})
</script>

<style scoped>
.search-page {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

input[type='number'],
input[type='date'],
input[type='time'] {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  padding: 10px 20px;
  margin-top: 20px;
}

.loading {
  margin-top: 20px;
  font-weight: bold;
}

.error {
  color: red;
  margin-top: 20px;
}

.results {
  margin-top: 20px;
}

.results ul {
  list-style-type: none;
  padding: 0;
}

.results li {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
