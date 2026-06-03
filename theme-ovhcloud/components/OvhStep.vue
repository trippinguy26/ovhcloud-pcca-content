<script setup lang="ts">
defineProps<{
  step: number | string
  title?: string
}>()
</script>

<template>
  <div class="ovh-step">
    <div class="ovh-step-marker">{{ step }}</div>
    <div class="ovh-step-body">
      <div v-if="title" class="ovh-step-title">{{ title }}</div>
      <div class="ovh-step-content"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.ovh-step {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin: 0.5rem 0;
}

.ovh-step-marker {
  flex-shrink: 0;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background-color: var(--ods-color-primary-700);
  color: var(--ods-color-neutral-000);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
}

.ovh-step-body {
  flex: 1;
  padding-top: 0.15rem;
}

.ovh-step-title {
  font-weight: 700;
  color: var(--ods-color-neutral-900);
  font-size: 0.95rem;
  margin-bottom: 0.15rem;
}

.ovh-step-content {
  font-size: 0.85rem;
  color: var(--ods-color-neutral-700);
  line-height: 1.4;
}
</style>
