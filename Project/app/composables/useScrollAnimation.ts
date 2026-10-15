import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollAnimation(threshold = 0.15) {
    const isVisible = ref(false)
    const elementRef = ref<HTMLElement | null>(null)

    let observer: IntersectionObserver | null = null

    onMounted(() => {
        if (typeof window === 'undefined' || !elementRef.value) return
        observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    isVisible.value = true
                    observer?.disconnect()
                }
            },
            { threshold }
        )
        observer.observe(elementRef.value)
    })

    onUnmounted(() => {
        observer?.disconnect()
    })

    return { isVisible, elementRef }
}
