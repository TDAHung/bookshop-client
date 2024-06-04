import { Routes, Route } from 'react-router-dom';
import './App.scss';
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
import Cart from './pages/Cart';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import { PrivateRoute } from './components/Route';

function App() {
  return (
    <Routes>
      <Route path={pages.LOGIN} element={<Login />} />
      <Route path='/' element={<Dashboard />}>
        <Route path="/" element={<Home />} />
        <Route path={`${pages.BOOK}`} element={<Book />} />
        <Route path={`${pages.BOOK}/:id`} element={<BookDetail />} />
        <Route path={pages.AUTHOR} element={<Author />} />
        <Route path={`${pages.AUTHOR}/:id`} element={<AuthorDetail />} />
        <Route path={pages.CATEGORY} element={<Category />} />
        <Route path={`${pages.CATEGORY}/:id`} element={<CategoryDetail />} />
        <Route path={pages.CART} element={<Cart />} />
        <Route path={pages.ORDER} element={<Order />} />
      </Route>
    </Routes>
  );
}

export default App;
