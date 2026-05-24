import type { Book } from '../types/books'

type Props = {
  book: Book
  onClick: () => void
}

export default function BookCard({ book, onClick }: Props) {
  return (
    <button
      type='button'
      className='bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow overflow-hidden text-left w-full p-0'
      onClick={onClick}
    >
      <img
        className='w-full h-64 object-cover rounded-t-lg'
        src={`https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`}
        alt={`Cover of ${book.title}`}
      />
      <div className='p-3'>
        <span className='block font-semibold text-gray-800'>{book.title}</span>
        <span className='block text-sm text-gray-500'>{book.author}</span>
      </div>
    </button>
  )
}
