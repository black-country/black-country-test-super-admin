<template>
<main>
    <section v-if="loading">
      <div class="rounded-md p-4 w-full mx-auto">
        <div class="animate-pulse flex space-x-4">
          <div class="h-44 w-full bg-slate-200 rounded col-span-1"></div>
        </div>
      </div>
    </section>
    <div v-else-if="images && !loading" class="container mx-auto p-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Main large image on the left -->
            <div class="relative h-[600px] overflow-hidden rounded-lg cursor-pointer" @click="openCarousel(0)">
                <img :src="images[0]" alt="Property Image"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>

            <!-- Right side 2x2 grid -->
            <div class="grid grid-cols-2 gap-4">
                <div v-for="(image, index) in displayedImages" :key="index" @click="openCarousel(index + 1)"
                    class="relative h-[290px] overflow-hidden rounded-lg cursor-pointer">
                    <img :src="image" :alt="`Property Image ${index + 1}`"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>

                <!-- View All button with blurred background -->
                <div @click="openCarousel(0)"
                    class="relative h-[290px] overflow-hidden rounded-lg cursor-pointer group">
                    <!-- Blurred background image -->
                    <img :src="lastDisplayedImage" alt="Background"
                        class="absolute inset-0 w-full h-full object-cover blur-sm brightness-50 group-hover:scale-105 transition-transform duration-300" />
                    <!-- Dark overlay -->
                    <div class="absolute inset-0 bg-black bg-opacity-20"></div>
                    <!-- Text content -->
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-white text-xl font-semibold">View all +{{ totalRemainingImages }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Carousel Modal -->
        <Teleport to="body">
            <div v-if="isCarouselOpen"
                class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                <div class="relative w-full h-full flex items-center justify-center">
                    <!-- Close button -->
                    <button @click="closeCarousel"
                        class="absolute top-4 right-4 text-white p-2 z-10">
                        <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_6053_216954)">
                                <rect x="8" y="2" width="52" height="52" rx="26" fill="black" fill-opacity="0.7"
                                    shape-rendering="crispEdges" />
                                <path d="M39.8327 22.167L28.166 33.8337M28.166 22.167L39.8327 33.8337" stroke="white"
                                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <filter id="filter0_d_6053_216954" x="0" y="0" width="68" height="68"
                                    filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="6" />
                                    <feGaussianBlur stdDeviation="4" />
                                    <feComposite in2="hardAlpha" operator="out" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
                                    <feBlend mode="normal" in2="BackgroundImageFix"
                                        result="effect1_dropShadow_6053_216954" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6053_216954"
                                        result="shape" />
                                </filter>
                            </defs>
                        </svg>

                    </button>

                    <!-- Previous button -->
                    <button @click="previousImage"
                        class="absolute left-4 text-white p-2">
                        <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_6053_216957)">
                                <rect x="8" y="2" width="52" height="52" rx="26" fill="black" fill-opacity="0.7"
                                    shape-rendering="crispEdges" />
                                <path d="M27.334 28H40.6673" stroke="white" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path
                                    d="M31.5006 32.1663C31.5006 32.1663 27.334 29.0977 27.334 27.9997C27.334 26.9017 31.5007 23.833 31.5007 23.833"
                                    stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <filter id="filter0_d_6053_216957" x="0" y="0" width="68" height="68"
                                    filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="6" />
                                    <feGaussianBlur stdDeviation="4" />
                                    <feComposite in2="hardAlpha" operator="out" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
                                    <feBlend mode="normal" in2="BackgroundImageFix"
                                        result="effect1_dropShadow_6053_216957" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6053_216957"
                                        result="shape" />
                                </filter>
                            </defs>
                        </svg>

                    </button>

                    <!-- Image container -->
                    <div class="w-full h-full flex items-center justify-center p-4">
                        <img :src="images[currentImageIndex]" :alt="`Property Image ${currentImageIndex + 1}`"
                            class="max-h-[90vh] max-w-[90vw] object-contain" />
                    </div>

                    <!-- Next button -->
                    <button @click="nextImage" class="absolute right-4 text-white p-2">
                        <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_6053_216959)">
                                <rect x="8" y="2" width="52" height="52" rx="26" fill="black" fill-opacity="0.7"
                                    shape-rendering="crispEdges" />
                                <path d="M40.6673 28H27.334" stroke="white" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path
                                    d="M36.5 32.1663C36.5 32.1663 40.6667 29.0977 40.6667 27.9997C40.6667 26.9017 36.5 23.833 36.5 23.833"
                                    stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <filter id="filter0_d_6053_216959" x="0" y="0" width="68" height="68"
                                    filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="6" />
                                    <feGaussianBlur stdDeviation="4" />
                                    <feComposite in2="hardAlpha" operator="out" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
                                    <feBlend mode="normal" in2="BackgroundImageFix"
                                        result="effect1_dropShadow_6053_216959" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6053_216959"
                                        result="shape" />
                                </filter>
                            </defs>
                        </svg>

                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</main>
</template>

<!-- <script setup lang="ts">
const props = defineProps({
    property: {
      type: Object
    },
    images: {
      type: Array
    },
    loading: {
      type: Boolean
    }
  })


const displayedImages = computed(() => {
    return props?.images?.slice(1, 4) // Show only 3 images in grid
})

const lastDisplayedImage = computed(() => {
    return props?.images[props?.images?.length - 1] // Use last image for View All background
})

const totalRemainingImages = computed(() => {
    return props?.images?.length - displayedImages?.value?.length - 1 // -1 for main image
})

const isCarouselOpen = ref(false)
const currentImageIndex = ref(0)

const openCarousel = (index: number) => {
    currentImageIndex.value = index
    isCarouselOpen.value = true
    document.body.style.overflow = 'hidden'
}

const closeCarousel = () => {
    isCarouselOpen.value = false
    document.body.style.overflow = 'auto'
}

const nextImage = () => {
    if (currentImageIndex.value < props?.images?.length - 1) {
        currentImageIndex.value++
    } else {
        currentImageIndex.value = 0
    }
}

const previousImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--
    } else {
        currentImageIndex.value = props?.images?.length - 1
    }
}

// Handle keyboard navigation
onMounted(() => {
    const handleKeydown = (e: KeyboardEvent) => {
        if (!isCarouselOpen.value) return

        switch (e.key) {
            case 'ArrowRight':
                nextImage()
                break
            case 'ArrowLeft':
                previousImage()
                break
            case 'Escape':
                closeCarousel()
                break
        }
    }

    window.addEventListener('keydown', handleKeydown)

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown)
    })
})
</script> -->



<script setup lang="ts">
const props = defineProps({
    property: {
        type: Object
    },
    images: {
        type: Array as () => string[]
    },
    loading: {
        type: Boolean
    }
})

// Cache for preloaded images
const imageCache = ref(new Set<string>())

// Preload a single image
const preloadImage = (src: string) => {
    if (!src || imageCache.value.has(src)) return

    const img = new Image()
    img.src = src
    img.onload = () => {
        imageCache.value.add(src)
    }
}

// Preload adjacent images
const preloadAdjacentImages = (currentIndex: number) => {
    if (!props.images) return

    // Preload next image
    if (currentIndex < props.images.length - 1) {
        preloadImage(props.images[currentIndex + 1])
    }

    // Preload previous image
    if (currentIndex > 0) {
        preloadImage(props.images[currentIndex - 1])
    }

    // Wrap around preloading
    if (currentIndex === 0) {
        preloadImage(props.images[props.images.length - 1])
    }
    if (currentIndex === props.images.length - 1) {
        preloadImage(props.images[0])
    }
}

// Preload initial visible images
const preloadVisibleImages = () => {
    if (!props.images) return

    // Preload main image and displayed grid images
    preloadImage(props.images[0])
    displayedImages.value?.forEach(img => preloadImage(img))
}

const displayedImages = computed(() => {
    return props.images?.slice(1, 4)
})

const lastDisplayedImage = computed(() => {
    return props.images?.[props.images.length - 1]
})

const totalRemainingImages = computed(() => {
    return (props.images?.length || 0) - (displayedImages.value?.length || 0) - 1
})

const isCarouselOpen = ref(false)
const currentImageIndex = ref(0)

// Enhanced open carousel with preloading
const openCarousel = (index: number) => {
    currentImageIndex.value = index
    isCarouselOpen.value = true
    document.body.style.overflow = 'hidden'
    
    // Preload adjacent images when carousel opens
    preloadAdjacentImages(index)
}

const closeCarousel = () => {
    isCarouselOpen.value = false
    document.body.style.overflow = 'auto'
}

// Enhanced navigation with preloading
const nextImage = () => {
    if (currentImageIndex.value < (props.images?.length || 0) - 1) {
        currentImageIndex.value++
    } else {
        currentImageIndex.value = 0
    }
    preloadAdjacentImages(currentImageIndex.value)
}

const previousImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--
    } else {
        currentImageIndex.value = (props.images?.length || 0) - 1
    }
    preloadAdjacentImages(currentImageIndex.value)
}

// Watch for images prop changes
watch(() => props.images, (newImages) => {
    if (newImages) {
        // Clear cache when images change
        imageCache.value.clear()
        // Preload new visible images
        preloadVisibleImages()
    }
}, { immediate: true })

// Watch current image index for preloading
watch(currentImageIndex, (newIndex) => {
    preloadAdjacentImages(newIndex)
})

// Keyboard navigation
onMounted(() => {
    const handleKeydown = (e: KeyboardEvent) => {
        if (!isCarouselOpen.value) return

        switch (e.key) {
            case 'ArrowRight':
                nextImage()
                break
            case 'ArrowLeft':
                previousImage()
                break
            case 'Escape':
                closeCarousel()
                break
        }
    }

    window.addEventListener('keydown', handleKeydown)
    
    // Initial preload of visible images
    preloadVisibleImages()

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown)
    })
})
</script>