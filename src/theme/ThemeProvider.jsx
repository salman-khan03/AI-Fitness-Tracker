import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext({
  theme: 'system',
  toggleTheme: () => {}
})

const STORAGE_KEY = 'brogram-theme-preference'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'system'
    }
    return localStorage.getItem(STORAGE_KEY) || 'system'
  })

  useEffect(() => {
    function applyTheme(nextTheme) {
      if (nextTheme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
        return
      }
      document.documentElement.setAttribute('data-theme', nextTheme)
    }

    applyTheme(theme)

    if (theme === 'system') {
      localStorage.removeItem(STORAGE_KEY)
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = () => applyTheme('system')
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    }

    localStorage.setItem(STORAGE_KEY, theme)
    return undefined
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => {
      if (current === 'light') return 'dark'
      if (current === 'dark') return 'system'
      return 'light'
    })
  }

  const value = useMemo(() => ({ theme, toggleTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext)
}
