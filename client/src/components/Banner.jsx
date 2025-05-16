export default function Banner() {
  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">Delicious Food Delivered</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl text-center">
          Order your favorite meals and have them delivered right to your doorstep
        </p>
        <a 
          href="#order-section" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
        >
          Order Now
        </a>
      </div>
    </div>
  );
}
