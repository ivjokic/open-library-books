import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import useViewedBooks from '../hooks/useViewedBooks'
import type { BookDetails, Book } from '../types/books'
import { getBookDetails } from '../api/openLibrary'

export default function BookDetailsPage() {
  const { workId } = useParams()
  const { addViewedBook } = useViewedBooks()
  const location = useLocation()
  const book: Book | undefined = location.state?.book
  const [details, setDetails] = useState<BookDetails | null>(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    async function getDetails(id: string) {
      setError(null)
      setLoading(true)
      try {
        const data = await getBookDetails(id, controller.signal)
        setDetails(data)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError('Failed to load book details.')
      } finally {
        setLoading(false)
      }
    }
    if (!workId) return
    getDetails(workId)
    return () => controller.abort()
  }, [workId])

  useEffect(() => {
    if (book) addViewedBook(book)
  }, [book, addViewedBook])

  return (
    <div className='min-h-screen bg-gray-50 px-6 py-10 max-w-4xl mx-auto'>
      {loading && <p className='text-gray-500 animate-pulse'>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      <button
        aria-label='Back to search'
        className='mb-6 text-blue-500 hover:text-blue-700 font-semibold'
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      {details && book && (
        <div className='flex gap-10'>
          <img
            className='w-64 h-96 object-cover rounded-lg shadow-md flex-shrink-0'
            src={`https://covers.openlibrary.org/b/id/${details.cover}-L.jpg`}
            alt={`Cover of ${details.title}`}
            loading='eager'
            decoding='async'
          />

          <div className='flex flex-col gap-4'>
            <h1 className='text-3xl font-bold text-gray-800'>{details.title}</h1>
            <p className='text-gray-600'>
              <span className='font-semibold'>Author:</span> {book.author}
            </p>
            <p className='text-gray-600'>
              <span className='font-semibold'>Publisher:</span> {book.publisher}
            </p>
            <p className='text-gray-600'>
              <span className='font-semibold'>ISBN:</span> {book.isbn}
            </p>
            <p className='text-gray-500 leading-relaxed'>{details.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
