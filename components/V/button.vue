<template>
  <button class="vButton" type="button" :disabled="disabled" @click="click">
    <slot />
  </button>
</template>

<script setup lang="ts">
  const props = defineProps<{
    disabled: boolean
  }>()

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  const click = (e: Event) => {
    emit('click')
  }
</script>

<style lang="scss" scoped>
.vButton {
  @apply px-2 py-1 text-gray-600 border bg-gray-50 border-gray-600 cursor-pointer rounded;
  @apply transition-all duration-200 ease-out;
}

.vButton:hover {
  @apply text-gray-50 bg-gray-900;
}

.vButton:disabled {
  @apply text-gray-50 bg-gray-600 cursor-not-allowed;
}
</style>
