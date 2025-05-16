import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/api';

export default function OrderCard({ order, onDelete }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/edit-order/${order._id}`, { state: { order } });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setIsDeleting(true);
      try {
        await orderService.deleteOrder(order._id);
        onDelete(order._id);
        toast.success('Order deleted successfully!');
      } catch (error) {
        // Error is already handled by the API service
        console.error('Error deleting order:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img
          src={order.photoUrl}
          alt={order.food}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{order.food}</h3>
        <div className="space-y-1 text-gray-600 mb-4">
          <p><span className="font-medium">Customer:</span> {order.name}</p>
          <p><span className="font-medium">Phone:</span> {order.phone}</p>
          <p><span className="font-medium">Location:</span> {order.city}, {order.pincode}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:bg-red-400"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
