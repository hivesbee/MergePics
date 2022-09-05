import { Ref } from 'vue'

const _readImageFromFile = async (file: File): Promise<string | ArrayBuffer> => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  return await new Promise((resolve) =>
    reader.onload = () => resolve(reader.result)
  )
}

// _readImageFromFile と同じ
const readFile = async (file: File): Promise<string | ArrayBuffer> => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  return await new Promise((resolve) =>
    reader.onload = () => resolve(reader.result)
  )
}

const getImageSize = async (src: string): Promise<{
  width: number,
  height: number
}> => {
  const image = new Image()
  image.src = src

  return await new Promise((resolve) =>
    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight
      })
    }
  )
}

const _loadCanvasFromImage = async (elRef: Ref<HTMLCanvasElement>, imageSrc: string, parentElRef?: Ref<HTMLCanvasElement>): Promise<null> => {
  const image = new Image()
  image.src = imageSrc as string

  const context = elRef.value.getContext('2d')
  if (!context) {
    return
  }

  // const dWidth = parentElRef?.value ? parentElRef.value.width : elRef.value.width
  const dHeight = parentElRef?.value ? parentElRef.value.height : elRef.value.height

  return await new Promise((resolve) =>
    image.onload = () => {
      elRef.value.width = image.width
      elRef.value.height = image.height

      // 基準となる canvas が存在する場合、表示範囲を基準の canvas に合わせる
      
      const calcScale = () => {
        if (!parentElRef) {
          return 1
        }

        console.log()

        const direction = image.width > image.height ? 'width' : 'height'
        console.log('direction', direction)
        
        const isOver = image.width > parentElRef.value.width || image.height > parentElRef.value.height
        if (!isOver) {
          return 1
        }
        
        const scale = direction === 'width' ? parentElRef.value.width / image.width : parentElRef.value.height / image.height

        return scale
      }

      const scale = calcScale()
      console.log(scale, elRef.value.width * scale, elRef.value.height * scale)
      

      context.drawImage(image, 0, 0, image.width, image.height, 0, 0, elRef.value.width * scale, elRef.value.height * scale)
      resolve(null)
    }
  )
}

const loadImageFromFile = async (e: Event, elRef: Ref<HTMLCanvasElement>, parentElRef?: Ref<HTMLCanvasElement>) => {
  const file = (e.currentTarget as HTMLInputElement).files[0]

  const imageSrc = await _readImageFromFile(file)

  await _loadCanvasFromImage(elRef, imageSrc as string, parentElRef)
}

const loadImageFromCanvas = async (elRef: Ref<HTMLCanvasElement>): Promise<HTMLImageElement> => {
  const image = new Image()
  const context = elRef.value.getContext('2d')
  image.src = context.canvas.toDataURL()
  return await new Promise((resolve) =>
    image.onload = () => resolve(image)
  )
}

const saveImageFromCanvas = (elRef: Ref<HTMLCanvasElement>): void => {
  if (!document) {
    return
  }

  const a = document.createElement('a')
  a.href = elRef.value.toDataURL('image/png')
  a.download = 'image.png'
  a.click()
}

export {
  readFile,
  getImageSize,
  loadImageFromFile,
  loadImageFromCanvas,
  saveImageFromCanvas
}