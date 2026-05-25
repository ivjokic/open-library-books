import type { Book } from '../types/books'

type Props = {
  book: Book
  onClick: () => void
}

export default function BookCard({ book, onClick }: Props) {
  return (
    <button
      type='button'
      className='bg-gray-900 flex flex-col rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow overflow-hidden text-left w-full p-0'
      onClick={onClick}
    >
      <img
        className='block w-full h-64 object-cover object-top'
        src={`https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`}
        alt={`Cover of ${book.title}`}
        loading='lazy'
        decoding='async'
      />
      <div className='p-3'>
        <span className='block font-semibold text-gray-300'>{book.title}</span>
        <span className='block text-sm text-gray-400'>{book.author}</span>
      </div>
    </button>
  )
}
