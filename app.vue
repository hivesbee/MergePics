<template>
  <app-header class="mb-12" />
  <main class="container">
    <div class="uploadCard_container">
      <app-upload-card id="frameFile" @change="loadFrameImage">
        1. フレーム画像をアップロード
      </app-upload-card>
      <app-upload-card id="contentFile" @change="loadContentImage">
        2. コンテンツ画像をアップロード
      </app-upload-card>
    </div>

    <div class="canvasContainer" ref="canvasContainerRef" :style="containerStyle">
      <img class="canvasContainer_frameImg" :src="imageFrame.src" :style="imageFrame.style" />
      <img class="canvasContainer_contentImg" ref="imageContentRef" :src="imageContent.src" :style="imageContent.style" />
    </div>

    <div class="canvasContainerEditor">
      <label for="bringFront" class="canvasContainerEditor_label">
        <input id="bringFront" type="checkbox" v-model="isBringFront" />
        フレーム画像を最前面に表示（プレビューの確認ができます）
      </label>
      <p class="canvasContainerEditor_note">
        ※ コンテンツ画像のサイズはフレーム画像の最大幅を参照して収まるように表示されます
      </p>
    </div>

    <v-button class="w-6/12 mb-12" :disabled="isDisabled" @click="saveImage">作成</v-button>
  </main>
  <app-footer />
</template>

<script setup lang="ts">
  import { useDraggable, useElementBounding } from '@vueuse/core'
  import { readFile, getImageSize } from '@/modules/loadImage'

  // canvasContainer 定義 
  const canvasContainerRef = ref<HTMLDivElement | null>(null)
  const canvasContainerBounding = useElementBounding(canvasContainerRef)
  const containerStyle = reactive({
    width: '800px',
    height: '600px'
  })

  const isBringFront = ref<boolean>(false)

  
  // imagaFrame 系の定義・処理
  const imageFrame = reactive({
    src: null,
    image: null,
    width: 0,
    height: 0,
    style: computed(() => ({
      width: `${imageFrame.width}px`,
      height: `${imageFrame.height}px`,
      zIndex: isBringFront.value ? 1 : 'auto'
    }))
  })

  const loadFrameImage = async (e: Event) => {
    const file = (e.currentTarget as HTMLInputElement).files[0]

    imageFrame.src = URL.createObjectURL(file)
    imageFrame.image = await readFile(file) as string

    const { width, height } = await getImageSize(imageFrame.image)

    imageFrame.width = width
    imageFrame.height = height

    containerStyle.width = `${width}px`
    containerStyle.height = `${height}px`
  }

  // imageContent 系の定義・処理
  const imageContentRef = ref<HTMLCanvasElement | null>(null)
  const contentDraggable = useDraggable(imageContentRef, {
    initialValue: { x: 10, y: 10 },
    preventDefault: true,
    stopPropagation: true,
    onStart: () => {
      imageContent.isStartDrag = true
    }
  })

  const imageContent = reactive({
    src: null,
    image: null,
    isStartDrag: false,
    left: computed(() => contentDraggable.x.value - (imageContent.isStartDrag ? canvasContainerBounding.left.value + window?.pageXOffset ?? 0 : 0)),
    top: computed(() => contentDraggable.y.value - (imageContent.isStartDrag  ? canvasContainerBounding.top.value + window?.pageYOffset ?? 0 : 0)),
    width: 0,
    height: 0,
    style: computed(() => {
      return {
        position: 'absolute',
        left: `${imageContent.left}px`,
        top: `${imageContent.top}px`,
        width: `${imageContent.width}px`,
        height: `${imageContent.height}px`,
      }
    })
  })

  const loadContentImage = async(e: Event) => {
    const file = (e.currentTarget as HTMLInputElement).files[0]
    imageContent.src = URL.createObjectURL(file)

    imageContent.image = await readFile(file) as string
    const { width, height } = await getImageSize(imageContent.image)

    const direction = width > height ? 'horizontal' : 'vertical'
    const scale = direction === 'horizontal' ? imageFrame.width / width : imageFrame.height / height

    imageContent.width = width * scale
    imageContent.height = height * scale
  }


  // 作成ボタン系の定義
  const isDisabled = computed(() => !imageFrame.src || !imageContent.src)

  const saveImage = async () => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.width = imageFrame.width
    canvas.height = imageFrame.height

    // content の描画
    const iContent = new Image()
    iContent.src = imageContent.image
    await new Promise((resolve) => iContent.onload = () => { resolve(null) })
    context.drawImage(iContent, imageContent.left, imageContent.top, imageContent.width, imageContent.height)

    // frame の描画
    const iFrame = new Image()
    iFrame.src = imageFrame.image
    await new Promise((resolve) => iFrame.onload = () => { resolve(null) })
    context.drawImage(iFrame, 0, 0, imageFrame.width, imageFrame.height)

    // 保存
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'image.png'
    a.click()
  }
</script>

<style lang="scss">
  body {
    @apply bg-gray-200;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

<style lang="scss" scoped>
.container {
  @apply flex flex-col items-center w-10/12 m-auto;
}

.uploadCard_container {
  @apply w-full flex mb-12 justify-between;
}

.header {
  color: #fff;
  background-color: #010103;
}

.canvasContainer {
  @apply relative overflow-hidden mb-12;

  background: linear-gradient(45deg, #a9a9a9 25%, transparent 25%, transparent 75%, #a9a9a9 75%),
            linear-gradient(45deg, #a9a9a9 25%, transparent 25%, transparent 75%, #a9a9a9 75%);
  background-color: #696969;
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
}

.canvasContainer_frameImg {
  position: absolute;
  max-width: none;
}

.canvasContainer_contentImg {
  position: absolute;
  max-width: none;
}

.canvasContainerEditor {
  @apply mb-12 leading-6;
}

.canvasContainerEditor_label {
  @apply inline-block mb-2;
}

.canvasContainerEditor_note {
  @apply text-sm;
}

</style>