import { useEffect, useState } from 'react'
import type { Book } from '../types/books'
import { searchBooks } from '../api/openLibrary'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard'
import useViewedBooks from '../hooks/useViewedBooks'

export default function LandingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Book[]>([])
  const navigate = useNavigate()
  const { viewedBooks } = useViewedBooks()
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(Number(searchParams.get('page')) ?? 1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const q = searchParams.get('q')
    const p = Math.max(1, Number(searchParams.get('page') ?? 1))
    if (!q) return
    setPage(p)
    fetchBooks(q, p)
  }, [searchParams])

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const term = searchValue.trim()
    if (!term) return
    console.log('handleSearch called, term:', term)
    setSearched(true)
    setSearchParams({ q: term, page: '1' })
  }

  async function fetchBooks(term: string, pageNum: number) {
    setLoading(true)
    setError(null)
    try {
      const { books, totalCount } = await searchBooks(term, pageNum)
      setResults(books)
      setTotalCount(totalCount)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 px-6 py-10 max-w-6xl mx-auto'>
      <h1 className='text-4xl font-bold text-gray-800 mb-8'>Book Search</h1>

      <form className='flex gap-3 mb-10' onSubmit={handleSearch}>
        <input
          className='flex-1 border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
          id='searchInput'
          placeholder='Search book...'
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
          }}
        />
        <button
          disabled={loading}
          className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Search
        </button>
      </form>
      {!searched && !loading && viewedBooks.length === 0 && (
        <p className='text-gray-400 text-center mt-10'>Search for a book to get started</p>
      )}
      {loading && <p className='text-gray-500 animate-pulse'>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      {!loading && results.length === 0 && searched && <p>No results found.</p>}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {results.map((book) => (
          <BookCard
            key={book.workId}
            onClick={() => navigate(`/book/${book.workId}`, { state: { book } })}
            book={book}
          />
        ))}
      </div>
      {results.length > 0 && (
        <div className='flex items-center gap-4 mt-6'>
          <button
            disabled={page === 1}
            onClick={() =>
              setSearchParams({ q: searchParams.get('q') ?? '', page: String(page - 1) })
            }
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Prev
          </button>
          <p className='text-gray-600'>
            {page} of {Math.ceil(totalCount / 10)}
          </p>
          <button
            disabled={page * 10 >= totalCount}
            onClick={() =>
              setSearchParams({ q: searchParams.get('q') ?? '', page: String(page + 1) })
            }
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Next
          </button>
        </div>
      )}
      {viewedBooks.length > 0 && (
        <>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 mt-10'>Previously viewed</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {viewedBooks.map((book) => (
              <BookCard
                key={book.workId}
                onClick={() => navigate(`/book/${book.workId}`, { state: { book } })}
                book={book}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
