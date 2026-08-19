import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-dark-bg text-ink dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
