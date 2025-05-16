import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import OrderForm from '../components/OrderForm';
import { orderService } from '../services/api';

export default function EditOrder() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If order is passed via location state, use it
    if (location.state?.order) {
      setOrder(location.state.order);
      setLoading(false);
      return;
    }

    // Otherwise fetch the order
    const fetchOrder = async () => {
      try {
        const orders = await orderService.getAllOrders();
        const foundOrder = orders.find(o => o._id === id);

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          toast.error('Order not found');
          setTimeout(() => navigate('/orders'), 3000);
        }
      } catch (err) {
        // Error is already handled by the API service
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, location.state, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error handling is now done via toast notifications

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">Edit Order</h1>
      <OrderForm existingOrder={order} />
    </div>
  );
}
