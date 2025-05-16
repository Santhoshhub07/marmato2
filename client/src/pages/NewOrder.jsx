import OrderForm from '../components/OrderForm';

export default function NewOrder() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">Place a New Order</h1>
      <OrderForm />
    </div>
  );
}
