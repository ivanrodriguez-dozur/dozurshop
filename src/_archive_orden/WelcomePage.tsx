'use client';

export default function WelcomePage() {
  return (
    <main className="bg-black min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-neon text-4xl font-bold mb-4">
        Find your dream style and start shopping here
      </h1>
      <p className="text-white text-lg mb-8">
        Get exclusive products only at Nikie, with the best offers and also a very complete
        collection.
      </p>
      <button
        className="bg-neon text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-neon transition"
        onClick={() => (window.location.href = '/home')}
      >
        Swipe to start
      </button>
    </main>
  );
}
