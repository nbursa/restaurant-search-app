<template>
  <div class="home-page">
    <RouterLink to="/search" class="cta"><h1>Restaurant Search</h1></RouterLink>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
  components: { RouterLink },
});
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
h1 {
  font-size: 3rem;
}
</style>
