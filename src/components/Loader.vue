<template>
  <div v-if="visible" :class="['loader-overlay', position]">
    <div :class="['loader', sizeClass]"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'Loader',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    position: {
      type: String as PropType<'absolute' | 'sticky' | 'fixed'>,
      default: 'absolute',
    },
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'medium',
    },
  },
  computed: {
    sizeClass(): string {
      return `loader-${this.size}`;
    },
  },
});
</script>

<style scoped>
.loader-overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
  z-index: 1001;
  overflow: hidden;
  min-height: inherit;
  min-width: 100%;
  pointer-events: none;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: rgba(255, 255, 255, 1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader-small {
  width: 30px;
  height: 30px;
}

.loader-medium {
  width: 40px;
  height: 40px;
}

.loader-large {
  width: 50px;
  height: 50px;
}

.absolute {
  position: absolute;
}

.fixed {
  position: fixed;
}

.relative {
  position: relative;
}

.sticky {
  position: sticky;
  top: 0;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
