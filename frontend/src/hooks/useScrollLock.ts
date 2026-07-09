import { useEffect, useRef } from 'react'

export function useScrollLock(locked: boolean) {
  const scrollYRef = useRef(0)

  useEffect(() => {
    if (!locked) return

    scrollYRef.current = window.scrollY
    const { style } = document.body

    style.position = 'fixed'
    style.top = `-${scrollYRef.current}px`
    style.width = '100%'
    style.overflow = 'hidden'

    return () => {
      const scrollY = scrollYRef.current
      style.position = ''
      style.top = ''
      style.width = ''
      style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}
