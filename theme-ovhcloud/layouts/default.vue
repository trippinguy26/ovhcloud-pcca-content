<script setup lang="ts">
import logoColor from '../assets/ovhcloud-logo-color.png'

defineProps<{
  moduleId?: string
  slideId?: string
  docName?: string
}>()
</script>

<template>
  <div class="slidev-layout ovh-default">
    <slot />
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
