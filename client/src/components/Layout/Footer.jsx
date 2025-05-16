export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Marmato Food</h3>
            <p className="text-gray-400 mt-2">Delicious food delivered to your doorstep</p>
          </div>
          <div>
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Marmato Food. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
