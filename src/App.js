import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Common components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public screens
import Home from './screens/Home';
import ProductDetail from './screens/ProductDetail';
import Cart from './screens/Cart';
import Login from './screens/Login';
import Signup from './screens/Signup';
import AddDetailsWrapper from './components/AddDetailsWrapper';
import OrderSuccess from './screens/OrderSuccess';
import OrderHistory from './components/OrderHistory';
import Payment from './screens/Payment';
import Crousal from './screens/Crousal';
import Aboutus from './screens/Aboutus'; // ✅ Corrected import name

// Admin screens
import AddProduct from './screens/AddProducts';
import ProductList from './screens/ProductList';
import AdminOrders from './components/AdminOrder';
import AdminRoute from './screens/AdminRoute';

function App() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.userId;

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Home route with carousel */}
        <Route
          path="/"
          element={
            <>
              <Crousal />
              <Home />
            </>
          }
        />

        {/* Public Routes */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-details" element={<AddDetailsWrapper />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/about" element={<Aboutus />} /> {/* ✅ About Us Route */}

        {/* Admin Routes */}
        <Route
          path="/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/products"
          element={
            <AdminRoute>
              <ProductList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
