<script setup lang="ts">
defineProps<{
  moduleId?: string
  slideId?: string
}>()
</script>

<template>
  <div class="slidev-layout ovh-two-cols">
    <slot name="default" />
    <div class="ovh-cols-grid">
      <div class="ovh-col ovh-col-left">
        <slot name="left" />
      </div>
      <div class="ovh-col ovh-col-right">
        <slot name="right" />
      </div>
    </div>
    <div class="ovh-footer">
      <span class="ovh-brand">OVHcloud</span>
      <span v-if="moduleId || slideId">{{ moduleId }}<span v-if="slideId"> · {{ slideId }}</span></span>
    </div>
  </div>
</template>

<style scoped>
.ovh-two-cols {
  display: flex;
  flex-direction: column;
}

.ovh-cols-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  flex: 1;
  margin-top: 1rem;
}

.ovh-col {
  padding: 1rem 0;
}
</style>
