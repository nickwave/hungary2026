<template>
  <v-overlay :model-value="loader.isVisible" class="align-center justify-center">
    <v-progress-circular
      color="rgb(255,213,0)"
      :size="70"
      :width="8"
      :model-value="loader.progress"
    ></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts" setup>
import { loader } from '@/store';
</script>
