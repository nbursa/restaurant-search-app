<template>
  <nav>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/search">Search</router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--background-color-light);
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

li {
  margin: 0;
}

a {
  color: white;
  text-decoration: none;
}

a.router-link-active {
  font-weight: bold;
}
</style>
