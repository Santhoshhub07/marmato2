import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/api';

export default function OrderForm({ existingOrder = null }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: existingOrder?.name || '',
    phone: existingOrder?.phone || '',
    city: existingOrder?.city || '',
    pincode: existingOrder?.pincode || '',
    food: existingOrder?.food || '',
    category: existingOrder?.category || 'Vegetarian', // Default to Vegetarian
    photo: null, // Will be set to File object when user selects a file
  });

  // Store the existing image URL separately
  const [existingImageUrl, setExistingImageUrl] = useState(existingOrder?.photoUrl || '');

  // Food categories
  const foodCategories = [
    'Vegetarian',
    'Non-Vegetarian',
    'Vegan',
    'Dessert',
    'Beverage'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Just store the file object, not the base64 data
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!formData.city.trim() || !formData.pincode.trim()) {
      toast.error('Please enter your complete address');
      return;
    }

    if (!formData.food.trim()) {
      toast.error('Please enter the food item');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a food category');
      return;
    }

    // For new orders, require a photo
    // For existing orders, either a new photo or the existing one is fine
    if (!formData.photo && !existingOrder) {
      toast.error('Please upload a food photo');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a FormData object to send the file
      const formDataToSend = new FormData();

      // Add all text fields
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('phone', formData.phone.trim());
      formDataToSend.append('city', formData.city.trim());
      formDataToSend.append('pincode', formData.pincode.trim());
      formDataToSend.append('food', formData.food.trim());
      formDataToSend.append('category', formData.category);

      // Add the file if it's a File object
      if (formData.photo instanceof File) {
        formDataToSend.append('photo', formData.photo);
      } else if (existingOrder) {
        // If we're updating an existing order and no new photo was selected,
        // we don't need to send the photo again - the server will keep the existing one
        console.log('Using existing photo, not sending a new one');
      } else {
        // This should not happen due to our validation above
        toast.error('Please select a photo');
        setIsSubmitting(false);
        return;
      }

      // Log the form data to debug
      console.log('Form data being sent:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'photo' ? 'File object' : pair[1]));
      }

      if (existingOrder?._id) {
        // Add the ID for updates
        formDataToSend.append('_id', existingOrder._id);
        await orderService.updateOrder(formDataToSend);
        toast.success('Order updated successfully!');
      } else {
        await orderService.createOrder(formDataToSend);
        toast.success('Order placed successfully!');
      }
      navigate('/orders');
    } catch (err) {
      // Show the specific error message from the server if available
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(`Error: ${err.response.data.error}`);
      } else {
        toast.error('Failed to submit the form. Please try again.');
      }
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md" id="order-section">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
        {existingOrder ? 'Update Order' : 'Place Your Order'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="food" className="block text-sm font-medium text-gray-700 mb-1">
              Food Item
            </label>
            <input
              type="text"
              id="food"
              name="food"
              value={formData.food}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Food Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {foodCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
            Food Photo
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {/* Show image preview */}
          {(formData.photo || existingOrder?.photoUrl) && (
            <div className="mt-2">
              <img
                src={formData.photo instanceof File
                  ? URL.createObjectURL(formData.photo)
                  : existingOrder?.photoUrl || ''}
                alt="Food preview"
                className="h-40 object-cover rounded-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                }}
              />
              {existingOrder?.photoUrl && !formData.photo && (
                <p className="text-sm text-gray-500 mt-1">
                  Current image will be kept unless you select a new one
                </p>
              )}
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400"
          >
            {isSubmitting ? 'Submitting...' : existingOrder ? 'Update Order' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
