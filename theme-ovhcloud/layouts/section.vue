<script setup lang="ts">
defineProps<{
  block?: string
  duration?: string
}>()
</script>

<template>
  <div class="slidev-layout ovh-section">
    <div class="ovh-section-content">
      <div v-if="block" class="ovh-pill ovh-pill-secondary">{{ block }}<span v-if="duration"> · {{ duration }}</span></div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ovh-section {
  background-color: var(--ovh-sky-blue);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.ovh-section :deep(h1) {
  font-size: 2.8rem;
  border-bottom: none;
  margin-top: 1rem;
}

.ovh-section-content {
  max-width: 80%;
}
</style>
