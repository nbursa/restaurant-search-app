<template>
  <nav>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/search">Search</router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
nav {
  padding: 1rem;
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
  text-decoration: none;
}

a.router-link-active {
  font-weight: bold;
  text-shadow: aliceblue;
}
</style>
