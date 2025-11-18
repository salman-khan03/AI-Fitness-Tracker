import { useCallback, useEffect, useMemo, useState } from 'react'

export default function useAsync(asyncFunction, dependencies = []) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const memoDeps = useMemo(() => (Array.isArray(dependencies) ? dependencies : [dependencies]), [dependencies])
  const depsKey = useMemo(() => JSON.stringify(memoDeps), [memoDeps])

  const execute = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await asyncFunction()
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [asyncFunction])

  useEffect(() => {
    execute()
  }, [execute, depsKey])

  return { data, isLoading, error, refetch: execute }
}
