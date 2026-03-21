'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Game } from '@/types'

export function useRealtimeGames(initialGames: Game[]) {
  const [games, setGames] = useState<Game[]>(initialGames)
  const [updatedId, setUpdatedId] = useState<number | null>(null)

  const handleUpdate = useCallback((payload: { new: Game }) => {
    const updated = payload.new
    setGames(prev =>
      prev.map(g => (g.id === updated.id ? { ...g, ...updated } : g))
    )
    setUpdatedId(updated.id)
    setTimeout(() => setUpdatedId(null), 1500)
  }, [])

  const handleInsert = useCallback((payload: { new: Game }) => {
    setGames(prev => {
      if (prev.find(g => g.id === payload.new.id)) return prev
      return [...prev, payload.new]
    })
  }, [])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('games-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'games' },
        handleUpdate
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'games' },
        handleInsert
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [handleUpdate, handleInsert])

  // Sync if parent pushes fresh initialGames (e.g. after navigation)
  useEffect(() => {
    setGames(initialGames)
  }, [initialGames])

  return { games, updatedId }
}
