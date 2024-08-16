<template>
  <Navigation />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Navigation from "./components/Navigation.vue"
</script>

<style scoped></style>
