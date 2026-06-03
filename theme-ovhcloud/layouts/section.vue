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
  background-color: #E8F4FF;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.ovh-section :deep(h1) {
  font-size: 2.6rem;
  border-bottom: none;
  margin-top: 1rem;
}

.ovh-section :deep(h3) {
  color: var(--ovh-gray-700);
  font-weight: 400;
}

.ovh-section-content {
  max-width: 80%;
}
</style>
