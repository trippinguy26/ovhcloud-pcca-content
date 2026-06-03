<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="ovh-notice">
    <div class="ovh-notice-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    </div>
    <div class="ovh-notice-body">
      <div v-if="title" class="ovh-notice-title">{{ title }}</div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ovh-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  background-color: var(--ods-color-information-050);
  border: 1px solid var(--ods-color-information-100);
  border-radius: var(--ods-border-radius-md);
  padding: 0.7rem 1rem;
  margin: 0.6rem 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--ods-color-neutral-900);
}

.ovh-notice-icon {
  color: var(--ods-color-information-500);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0.1rem;
}

.ovh-notice-body {
  flex: 1;
}

.ovh-notice-title {
  font-weight: 700;
  color: var(--ods-color-information-700);
  margin-bottom: 0.2rem;
}
</style>
