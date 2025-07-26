import React from 'react';
import { CurrencyConverter } from './components/CurrencyConverter';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <CurrencyConverter />
      </div>
    </div>
  );
}

export default App;