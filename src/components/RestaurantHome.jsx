import React from 'react';

const RestaurantHome = () => {
  return (
    <div className="bg-stone-50 text-stone-900 font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center py-6 px-8 md:px-16 absolute w-full z-20 text-white">
        <div className="text-2xl font-bold tracking-widest uppercase">Gourmet</div>
        <div className="hidden md:flex space-x-8 font-medium">
          {['Menu', 'Story', 'Reservations'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-amber-400 transition">{item}</a>
          ))}
        </div>
        <button className="border border-white px-6 py-2 hover:bg-white hover:text-stone-900 transition">
          Book Table
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center text-center">
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80" 
          className="absolute inset-0 w-full h-full object-cover brightness-50" 
          alt="Fine Dining" 
        />
        <div className="relative z-10 text-white px-4">
          <span className="text-amber-400 tracking-[0.3em] uppercase text-sm">Experience Excellence</span>
          <h1 className="text-6xl md:text-8xl mt-4 mb-6 font-serif">Culinary Art</h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl font-light mb-8">Where traditional flavors meet modern innovation.</p>
          <button className="bg-amber-500 text-stone-900 px-10 py-4 font-bold text-lg hover:bg-amber-400 transition shadow-xl">
            Explore Our Menu
          </button>
        </div>
      </header>
    </div>
  );
};

export default RestaurantHome;