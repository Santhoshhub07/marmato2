import OrderList from '../components/OrderList';

export default function Orders() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">All Orders</h1>
      <OrderList />
    </div>
  );
}
