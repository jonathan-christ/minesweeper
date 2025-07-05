<script lang="ts">
// No props needed for now
</script>

<style>
.cloud-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/bg/clouds.png');
  background-repeat: repeat-x;
  background-size: 1000% auto;
  animation: scrollClouds 600s linear infinite;
  background-color: var(--color-blue-300, #aeefff);
  image-rendering: pixelated;
  z-index: -1;
}

@keyframes scrollClouds {
  from {
    background-position: 50% 0;
  }
  to {
    background-position: 150% 5%;
  }
}
</style>

<div class="cloud-background"></div> 