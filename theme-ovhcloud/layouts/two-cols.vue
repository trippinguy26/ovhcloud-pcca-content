<script setup lang="ts">
import logoColor from '../assets/ovhcloud-logo-color.png'

defineProps<{
  moduleId?: string
  slideId?: string
  docName?: string
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
      <img :src="logoColor" class="ovh-footer-logo" alt="OVHcloud" />
      <div class="ovh-footer-separator"></div>
      <div class="ovh-footer-docname">
        {{ docName || 'OVHcloud — Public Cloud — Core Associate' }}
        <span v-if="moduleId"> · Module {{ moduleId }}</span>
        <span v-if="slideId"> · {{ slideId }}</span>
      </div>
      <div class="ovh-footer-page">
        <span class="slidev-page-number"></span>
      </div>
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
