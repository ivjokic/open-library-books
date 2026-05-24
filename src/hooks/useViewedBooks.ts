import { useState, useCallback } from 'react'
import type { Book } from '../types/books'

export default function useViewedBooks() {
  const [viewedBooks, setViewedBooks] = useState<Book[]>(() => {
    const stored = localStorage.getItem('viewedBooks')
    return stored ? JSON.parse(stored) : []
  })

  const addViewedBook = useCallback((book: Book) => {
    setViewedBooks((prev) => {
      if (prev.some((b) => b.workId === book.workId)) return prev
      const updated = [book, ...prev]
      localStorage.setItem('viewedBooks', JSON.stringify(updated))
      return updated
    })
  }, [])

  return { viewedBooks, addViewedBook }
}
