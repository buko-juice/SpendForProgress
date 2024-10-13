import React from 'react';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 min-h-screen text-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">#SpendForProgress</h1>
          <div>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-full mr-2">Log In</button>
            <button className="bg-purple-700 px-4 py-2 rounded-full">Sign Up</button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Turn Your Purchases into Progress</h2>
          <p className="text-xl">Join thousands making a difference with every dollar spent.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <TrendingUp className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Your Impact</h3>
            <p>See how your everyday purchases translate into meaningful donations.</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <Users className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Join a Community</h3>
            <p>Connect with like-minded individuals committed to progressive causes.</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <DollarSign className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Amplify Your Giving</h3>
            <p>Maximize your impact by aligning your spending with your values.</p>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-semibold">
            Start Your Pledge Today
          </button>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center">
        <p>&copy; 2024 #SpendForProgress. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
