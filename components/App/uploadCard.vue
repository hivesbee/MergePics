<template>
  <div class="uploadCardContainer">
    <label :for="id" class="uploadCardContainer_label">
      <slot />
    </label>
    <input :id="id" class="uploadCardContainer_file" type="file" @change="change" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    id: string
  }>()

  const emit = defineEmits<{
    (e: 'change', ev: Event): void
  }>()

  const change = (e: Event) => {
    emit('change', e)
  }
</script>

<style lang="scss" scoped>
.uploadCardContainer {
  @apply w-5/12 p-4 bg-gray-50 drop-shadow-sm;
}

.uploadCardContainer_label {
  @apply block mb-4;
}

.uploadCardContainer_file {
  @apply file:px-2 file:py-1 file:mr-4;
  @apply file:text-gray-600 text-gray-600 file:text-sm text-sm;
  @apply file:bg-gray-50 file:border file:border-gray-600 file:cursor-pointer file:rounded;
  @apply file:transition-all file:duration-200 file:ease-out;
}

.uploadCardContainer_file:hover {
  @apply file:text-gray-50 file:bg-gray-900;
}
</style>