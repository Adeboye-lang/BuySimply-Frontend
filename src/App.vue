<script setup lang="ts">
import Login from './components/Login.vue'
</script>

<template>
  <Login />
</template>

<style>
/* Global resets to ensure the page takes up the full viewport */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
}
</style>
