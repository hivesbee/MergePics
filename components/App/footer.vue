<template>
  <footer class="appFooter">
    <a class="appFooter_donate" href="https://ofuse.me/841e3e01" target="_blank" rel="noopener">Donate</a>
  </footer>
</template>

<style lang="scss" scoped>
.appFooter {
  @apply fixed bottom-0 flex justify-end w-full px-4 py-2;
  @apply text-gray-50 bg-gray-900;
}

.appFooter_donate {
  @apply underline;
}
</style>
