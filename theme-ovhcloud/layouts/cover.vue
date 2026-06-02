<script setup lang="ts">
defineProps<{
  moduleId?: string
  duration?: string
}>()
</script>

<template>
  <div class="slidev-layout ovh-cover">
    <div class="ovh-cover-content">
      <div v-if="moduleId" class="ovh-pill">Module {{ moduleId }}<span v-if="duration"> · {{ duration }}</span></div>
      <slot />
    </div>
    <div class="ovh-cover-brand">OVHcloud — Public Cloud — Core Associate</div>
  </div>
</template>

<style scoped>
.ovh-cover {
  background-color: var(--ovh-masterbrand-blue);
  color: var(--ovh-white);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem 5rem;
}

.ovh-cover :deep(h1) {
  color: var(--ovh-white);
  font-size: 3.4rem;
  border-bottom: none;
  margin-top: 1.5rem;
  margin-bottom: 0.6rem;
}

.ovh-cover :deep(h2) {
  color: var(--ovh-light-blue);
  font-size: 1.6rem;
  font-weight: 400;
}

.ovh-cover :deep(.ovh-pill) {
  background-color: var(--ovh-neon-blue);
  color: var(--ovh-white);
}

.ovh-cover-brand {
  position: absolute;
  bottom: 1.5rem;
  left: 5rem;
  font-size: 0.8rem;
  color: var(--ovh-light-blue);
  letter-spacing: 0.05em;
}
</style>
