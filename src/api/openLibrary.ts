import type { RawBook, Book, BookDetails } from '../types/books'

export async function searchBooks(title: string): Promise<Book[]> {
  const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const books = data.docs
    .filter((book: RawBook) => book.cover_i)
    .map(
      (book: RawBook): Book => ({
        workId: book.key.replace('/works/', ''),
        title: book.title,
        cover: book.cover_i,
        author: book.author_name?.[0] ?? 'Unknown',
        isbn: book.isbn?.[0] ?? 'N/A',
        publisher: book.publisher?.[0] ?? 'N/A',
      }),
    )

  return books
}

export async function getBookDetails(workId: string, signal?: AbortSignal): Promise<BookDetails> {
  const res = await fetch(`https://openlibrary.org/works/${workId}.json`, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return {
    title: data.title,
    description:
      typeof data.description === 'string' ? data.description : (data.description?.value ?? ''),
    cover: data.covers?.[0],
  }
}
