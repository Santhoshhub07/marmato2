import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { orderService } from '../services/api';
import OrderCard from './OrderCard';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      // Error is already handled by the API service
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderDelete = (deletedOrderId) => {
    setOrders(orders.filter(order => order._id !== deletedOrderId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error handling is now done via toast notifications

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600">No orders found</h3>
        <p className="mt-2 text-gray-500">Place an order to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map(order => (
        <OrderCard
          key={order._id}
          order={order}
          onDelete={handleOrderDelete}
        />
      ))}
    </div>
  );
}
