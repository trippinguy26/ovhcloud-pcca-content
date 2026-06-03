<script setup lang="ts">
defineProps<{
  title?: string
  href?: string
}>()
</script>

<template>
  <a v-if="href" :href="href" class="ovh-card ovh-card-link">
    <div class="ovh-card-body">
      <div v-if="title" class="ovh-card-title">{{ title }}</div>
      <div class="ovh-card-content"><slot /></div>
    </div>
    <div class="ovh-card-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </div>
  </a>
  <div v-else class="ovh-card">
    <div class="ovh-card-body">
      <div v-if="title" class="ovh-card-title">{{ title }}</div>
      <div class="ovh-card-content"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.ovh-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
  background-color: var(--ods-color-neutral-000);
  border: 1px solid var(--ods-color-neutral-200);
  border-radius: var(--ods-border-radius-md);
  padding: 0.9rem 1.1rem;
  margin: 0.4rem 0;
  text-decoration: none;
  color: var(--ods-color-neutral-900);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ovh-card-link:hover {
  border-color: var(--ods-color-primary-500);
  box-shadow: 0 2px 6px rgba(0, 14, 156, 0.08);
}

.ovh-card-body {
  flex: 1;
}

.ovh-card-title {
  font-weight: 700;
  color: var(--ods-color-primary-700);
  font-size: 0.95rem;
  margin-bottom: 0.15rem;
}

.ovh-card-content {
  font-size: 0.82rem;
  color: var(--ods-color-neutral-700);
  line-height: 1.4;
}

.ovh-card-arrow {
  color: var(--ods-color-primary-500);
  flex-shrink: 0;
}
</style>
