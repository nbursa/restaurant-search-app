<template>
  <div class="home-page">
    <h1>Home page</h1>
    <RouterLink to="/search">Search Restaurants</RouterLink>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  components: { RouterLink },
});
</script>

<style scoped></style>
