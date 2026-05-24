export type RawBook = {
  title: string
  cover_i: number
  author_name: string[]
  isbn: string[]
  publisher: string[]
  key: string
}

export type Book = {
  workId: string
  title: string
  cover: number
  author: string
  isbn: string
  publisher: string
}

export type BookDetails = {
  title: string
  description: string
  cover: number | undefined
}
