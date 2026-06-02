<script setup lang="ts">
defineProps<{
  moduleId?: string
  slideId?: string
}>()
</script>

<template>
  <div class="slidev-layout ovh-default">
    <slot />
    <div class="ovh-footer">
      <span class="ovh-brand">OVHcloud</span>
      <span v-if="moduleId || slideId">{{ moduleId }}<span v-if="slideId"> · {{ slideId }}</span></span>
    </div>
  </div>
</template>
