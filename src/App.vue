<template>
  <Navigation class="nav" />
  <RouterView class="main" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navigation from './components/Navigation.vue';
</script>
