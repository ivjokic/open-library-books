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
    <div className='min-h-screen flex flex-col md:flex-row'>
      {loading && <p className='text-gray-400 animate-pulse p-10'>Loading...</p>}
      {error && <p className='text-red-400 p-10'>{error}</p>}

      {details && book && (
        <>
          <div className='bg-gray-900 flex items-center justify-center md:justify-end p-10 w-full md:w-1/2'>
            <img
              className='w-80 h-120 object-cover rounded-lg shadow-md'
              src={`https://covers.openlibrary.org/b/id/${details.cover}-L.jpg`}
              alt={`Cover of ${details.title}`}
              loading='eager'
              decoding='async'
            />
          </div>
          <div className='bg-gray-800 w-full md:flex-1 flex flex-col justify-center p-10 gap-4'>
            <button
              aria-label='Back to search'
              className='self-start text-slate-500 hover:text-slate-400  font-semibold mb-4'
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
            <div className='flex flex-col gap-4 max-w-lg'>
              <h1 className='text-3xl font-bold text-white'>{details.title}</h1>
              <p className='text-gray-300'>
                <span className='font-semibold'>Author:</span> {book.author}
              </p>
              <p className='text-gray-300'>
                <span className='font-semibold'>Publisher:</span> {book.publisher}
              </p>
              <p className='text-gray-300'>
                <span className='font-semibold'>ISBN:</span> {book.isbn}
              </p>
              <p className='text-gray-400 leading-relaxed'>{details.description}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
