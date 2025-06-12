import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export const useQueryCacheWatcher = (queryKey: string[]) => {
  const queryClient = useQueryClient()
  const queryCache = queryClient.getQueryCache()

  useEffect(() => {
    const unsubscribe = queryCache.subscribe((event) => {
      const query = queryCache.find({ queryKey })
      if (!query) return

      if (event.type === 'updated' && event.query.queryKey.toString() === queryKey.toString()) {
        const state = event.query.state

        if (state.status === 'success') {
          console.log('Success:', state.data)
        } else if (state.status === 'error') {
          console.log('Error:', state.error)
        }

        console.log('Settled:', state.data, state.error)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [queryCache, queryKey])
}