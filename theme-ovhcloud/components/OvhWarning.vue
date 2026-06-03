<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="ovh-warning">
    <div class="ovh-warning-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </div>
    <div class="ovh-warning-body">
      <div v-if="title" class="ovh-warning-title">{{ title }}</div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ovh-warning {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  background-color: var(--ods-color-warning-050);
  border: 1px solid var(--ods-color-warning-100);
  border-radius: var(--ods-border-radius-md);
  padding: 0.7rem 1rem;
  margin: 0.6rem 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--ods-color-neutral-900);
}

.ovh-warning-icon {
  color: var(--ods-color-warning-600);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0.1rem;
}

.ovh-warning-body {
  flex: 1;
}

.ovh-warning-title {
  font-weight: 700;
  color: var(--ods-color-warning-700);
  margin-bottom: 0.2rem;
}
</style>
