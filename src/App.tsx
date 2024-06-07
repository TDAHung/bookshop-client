import { Routes, Route } from 'react-router-dom';
import './App.scss';
import Home from './pages/Home';
import Author from './pages/Author';
import { pages } from './utils/constant';
import Order from './pages/Order';
import Category from './pages/Category';
import Book from './pages/Book';
import BookDetail from './pages/Book/BookDetail';
import CategoryDetail from './pages/Category/CategoryDetail';
import AuthorDetail from './pages/Author/AuthorDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import { PublicRoute, PrivateRoute } from './components/Route';
import { AuthContext, AuthProvider } from './contexts/authContext';
import OrderConfirm from './pages/Order/OrderConfirm';
import OrderDetail from "./pages/Order/OrderDetail/";
import About from './pages/About';
import Register from './pages/Register';
import { useContext } from 'react';
import OrderConfirmCookie from './pages/Order/OrderConfirmCookie';

function App() {
  const user = useContext(AuthContext);
  return (
    <Routes>
      <Route path={pages.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
      <Route path={pages.REGISTER} element={<PublicRoute><Register /></PublicRoute>} />
      <Route path='/' element={
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      }>
        <Route path="/" element={<Home />} />
        <Route path={`${pages.BOOK}`} element={<Book />} />
        <Route path={`${pages.BOOK}/:id`} element={<BookDetail />} />
        <Route path={pages.AUTHOR} element={<Author />} />
        <Route path={`${pages.AUTHOR}/:id`} element={<AuthorDetail />} />
        <Route path={pages.CATEGORY} element={<Category />} />
        <Route path={`${pages.CATEGORY}/:id`} element={<CategoryDetail />} />
        <Route path={pages.CART} element={<Cart />} />
        <Route path={pages.ORDERS} element={<Order />} />
        <Route path={pages.ORDER} element={<PrivateRoute><OrderConfirm /></PrivateRoute>} />
        <Route path={pages.COOKIE_ORDER} element={<OrderConfirmCookie />} />
        <Route path={`${pages.ORDER}/:id`} element={<OrderDetail />} />
        <Route path={pages.ABOUT} element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
