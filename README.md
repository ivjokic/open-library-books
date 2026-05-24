# Book Search

A React application for searching books using the [Open Library API](https://openlibrary.org).

**Live demo:** [open-library-books.vercel.app](https://open-library-books.vercel.app)

## Features

- Search books by title with paginated results
- View detailed information about a selected book (cover, author, publisher, ISBN, description)
- Previously viewed books persisted in localStorage

## Tech stack

- React 19, TypeScript
- React Router v7
- Tailwind CSS v4
- Vite

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
  api/            — all fetch logic (searchBooks, getBookDetails)
  components/     — BookCard
  hooks/          — useViewedBooks (localStorage state)
  pages/          — LandingPage, BookDetailsPage
  types/          — RawBook, Book, BookDetails
```

## Key decisions

**API layer separation** — all fetch logic is in `api/openLibrary.ts`. Components receive clean, typed data and never deal with raw API responses.

**Two-type pattern** — `RawBook` mirrors the API response (arrays, snake_case). `Book` is the clean mapped type used in components.

**location.state for passing data between pages** — author, publisher, and ISBN are only available in the search response, not in the Works API. These are passed via React Router state to avoid extra API calls.

**useCallback in useViewedBooks** — `addViewedBook` uses the functional `setViewedBooks(prev => ...)` form so it doesn't depend on the current state value. This makes the function stable across renders and safe to include in `useEffect` dependency arrays.

## Notes

This project was built with AI assistance, used as a learning and pair-programming tool. All decisions and code were reviewed, understood, and verified.
