import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookDetailsPage from './pages/BookDetailsPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/book/:workId' element={<BookDetailsPage />} />
    </Routes>
  )
}

export default App
