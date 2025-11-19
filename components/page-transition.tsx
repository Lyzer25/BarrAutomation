'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Start zoom-out animation
    setIsAnimating(true)

    const timeout = setTimeout(() => {
      // Update content at midpoint of animation
      setDisplayChildren(children)
      
      // Small delay then zoom back in
      setTimeout(() => {
        setIsAnimating(false)
      }, 50)
    }, 300)

    return () => clearTimeout(timeout)
  }, [pathname, children])

  return (
    <div
      className={`page-transition ${isAnimating ? 'page-zoom-out' : 'page-zoom-in'}`}
      style={{
        transformOrigin: 'center center',
      }}
    >
      {displayChildren}
    </div>
  )
}
