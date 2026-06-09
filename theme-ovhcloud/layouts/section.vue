<script setup lang="ts">
import sectionWallpaper from '../wallpapers/section_wallpaper.png'

defineProps<{
  block?: string
  duration?: string
}>()
</script>

<template>
  <div class="slidev-layout ovh-section">
    <!-- Background image + Masterbrand blue overlay at 35% -->
    <div class="ovh-section-bg" :style="{ backgroundImage: `url(${sectionWallpaper})` }"></div>
    <div class="ovh-section-overlay"></div>

    <div class="ovh-section-content">
      <div v-if="block" class="ovh-pill ovh-pill-secondary">{{ block }}<span v-if="duration"> · {{ duration }}</span></div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Override the global .slidev-layout padding so the wallpaper truly fills the slide */
.ovh-section.slidev-layout {
  padding: 0 !important;
  margin: 0;
  background-color: var(--ovh-masterbrand-blue); /* fallback if image missing */
  color: var(--ovh-white);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.ovh-section-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.ovh-section-overlay {
  position: absolute;
  inset: 0;
  background-color: var(--ovh-masterbrand-blue);
  opacity: 0.35;
  z-index: 1;
}

.ovh-section-content {
  position: relative;
  z-index: 2;
  max-width: 60%;
  padding: 3rem 5rem;
  text-align: right;
}

.ovh-section :deep(h1) {
  color: var(--ovh-white);
  font-size: 2.6rem;
  border-bottom: none;
  margin-top: 1rem;
}

.ovh-section :deep(h3) {
  color: var(--ovh-sky-blue);
  font-weight: 400;
}

.ovh-section :deep(.ovh-pill) {
  background-color: var(--ovh-navy-blue);
  color: var(--ovh-white);
}
</style>
