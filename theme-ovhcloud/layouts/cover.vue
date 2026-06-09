<script setup lang="ts">
import logoWhite from '../assets/ovhcloud-logo-white.png'
import coverWallpaper from '../wallpapers/cover_wallpaper.png'

defineProps<{
  moduleId?: string
  duration?: string
}>()
</script>

<template>
  <div class="slidev-layout ovh-cover">
    <!-- Background image + Masterbrand blue overlay at 45% -->
    <div class="ovh-cover-bg" :style="{ backgroundImage: `url(${coverWallpaper})` }"></div>
    <div class="ovh-cover-overlay"></div>

    <!-- Content sits above both layers -->
    <img :src="logoWhite" class="ovh-cover-logo" alt="OVHcloud" />
    <div class="ovh-cover-content">
      <div v-if="moduleId" class="ovh-pill">Module {{ moduleId }}<span v-if="duration"> · {{ duration }}</span></div>
      <slot />
    </div>
    <div class="ovh-cover-brand">OVHcloud — Public Cloud — Core Associate</div>
  </div>
</template>

<style scoped>
/* Override the global .slidev-layout padding so the wallpaper truly fills the slide */
.ovh-cover.slidev-layout {
  padding: 0 !important;
  margin: 0;
  background-color: var(--ovh-masterbrand-blue); /* fallback if image missing */
  color: var(--ovh-white);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.ovh-cover-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.ovh-cover-overlay {
  position: absolute;
  inset: 0;
  background-color: var(--ovh-masterbrand-blue);
  opacity: 0;
  z-index: 1;
}

.ovh-cover-logo,
.ovh-cover-content,
.ovh-cover-brand {
  position: relative;
  z-index: 2;
}

.ovh-cover-logo {
  position: absolute;
  top: 3rem;
  left: 5rem;
  height: 32px;
  width: auto;
}

.ovh-cover-content {
  padding: 7rem 5rem 4rem 5rem;
}

.ovh-cover :deep(h1) {
  color: var(--ovh-white);
  font-size: 3.2rem;
  border-bottom: none;
  margin-top: 1.5rem;
  margin-bottom: 0.6rem;
  font-weight: 700;
}

.ovh-cover :deep(h2) {
  color: var(--ovh-sky-blue);
  font-size: 1.6rem;
  font-weight: 400;
}

.ovh-cover :deep(.ovh-pill) {
  background-color: var(--ovh-navy-blue);
  color: var(--ovh-white);
}

.ovh-cover-brand {
  position: absolute;
  bottom: 1.5rem;
  left: 5rem;
  font-size: 0.8rem;
  color: var(--ovh-sky-blue);
  letter-spacing: 0.05em;
}
</style>
