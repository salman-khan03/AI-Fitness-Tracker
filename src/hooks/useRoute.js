import { useCallback, useEffect, useMemo, useState } from 'react'

export const ROUTES = {
  dashboard: '/dashboard',
  workouts: '/workouts',
  routines: '/routines',
  reminders: '/reminders',
  settings: '/settings'
}

const DEFAULT_ROUTE = ROUTES.dashboard

function cleanPath(value) {
  if (!value || value === '#') {
    return DEFAULT_ROUTE
  }
  if (value.startsWith('#')) {
    return value.slice(1)
  }
  return value
}

export function useRoute() {
  const [path, setPath] = useState(() => cleanPath(window.location.hash))

  useEffect(() => {
    function handleHashChange() {
      setPath(cleanPath(window.location.hash))
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = useCallback((nextPath) => {
    const pathName = nextPath.startsWith('/') ? nextPath : `/${nextPath}`
    window.location.hash = pathName
  }, [])

  const activeRoute = useMemo(() => {
    const match = Object.values(ROUTES).find((route) => path.startsWith(route))
    return match || DEFAULT_ROUTE
  }, [path])

  return { path: activeRoute, navigate }
}
