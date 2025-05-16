import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import Orders from './pages/Orders';
import NewOrder from './pages/NewOrder';
import EditOrder from './pages/EditOrder';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="orders" element={<Orders />} />
            <Route path="new-order" element={<NewOrder />} />
            <Route path="edit-order/:id" element={<EditOrder />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}