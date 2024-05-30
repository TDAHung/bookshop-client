import { Routes, Route } from 'react-router-dom';
import './App.scss'
import Home from './pages/Home';
import Author from './pages/Author';
import { pages } from './utils/constant';
import Order from './pages/Order';
import Category from './pages/Category';
import Header from './components/Header';
import Book from './pages/Book';
import BookDetail from './pages/Book/BookDetail';
import CategoryDetail from './pages/Category/CategoryDetail';
import AuthorDetail from './pages/Author/AuthorDetail';

function App() {
  return (
    <main>
      <Header />
      <div className="container mx-auto p-4 px-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={`${pages.BOOK}`} element={<Book />} />
          <Route path={`${pages.BOOK}/:id`} element={<BookDetail />} />
          <Route path={pages.AUTHOR} element={<Author />} />
          <Route path={`${pages.AUTHOR}/:id`} element={<AuthorDetail />} />
          <Route path={pages.CATEGORY} element={<Category />} />
          <Route path={`${pages.CATEGORY}/:id`} element={<CategoryDetail />} />
          <Route path={pages.ORDER} element={<Order />} />
        </Routes>
      </div>
    </main>
  )
}

export default App
