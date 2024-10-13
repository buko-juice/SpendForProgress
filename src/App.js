import React, { useState, useEffect } from 'react';

function App() {
  const [purchases, setPurchases] = useState([]);
  const [donationGoal, setDonationGoal] = useState(0);
  const [selectedCause, setSelectedCause] = useState('');
  const [newPurchase, setNewPurchase] = useState({ description: '', amount: '' });

  const causes = ['Education', 'Healthcare', 'Environment', 'Social Justice'];

  const addPurchase = () => {
    if (newPurchase.description && newPurchase.amount) {
      setPurchases([...purchases, { ...newPurchase, amount: parseFloat(newPurchase.amount) }]);
      setNewPurchase({ description: '', amount: '' });
    }
  };

  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const totalDonations = totalPurchases * 0.5;
  const progressPercentage = donationGoal > 0 ? (totalDonations / donationGoal) * 100 : 0;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#4a4a4a' }}>Spend For Progress</h1>
      
      <div>
        <h2>Set Donation Goal</h2>
        <input 
          type="number" 
          value={donationGoal} 
          onChange={(e) => setDonationGoal(parseFloat(e.target.value) || 0)}
          placeholder="Enter your donation goal"
        />
      </div>

      <div>
        <h2>Select Cause</h2>
        <select value={selectedCause} onChange={(e) => setSelectedCause(e.target.value)}>
          <option value="">Select a cause</option>
          {causes.map(cause => (
            <option key={cause} value={cause}>{cause}</option>
          ))}
        </select>
      </div>

      <div>
        <h2>Add Purchase</h2>
        <input 
          type="text" 
          value={newPurchase.description} 
          onChange={(e) => setNewPurchase({...newPurchase, description: e.target.value})}
          placeholder="Purchase description"
        />
        <input 
          type="number" 
          value={newPurchase.amount} 
          onChange={(e) => setNewPurchase({...newPurchase, amount: e.target.value})}
          placeholder="Amount"
        />
        <button onClick={addPurchase}>Add Purchase</button>
      </div>

      <div>
        <h2>Purchases</h2>
        <ul>
          {purchases.map((purchase, index) => (
            <li key={index}>{purchase.description}: ${purchase.amount.toFixed(2)}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Summary</h2>
        <p>Total Purchases: ${totalPurchases.toFixed(2)}</p>
        <p>Total Donations: ${totalDonations.toFixed(2)}</p>
        <p>Selected Cause: {selectedCause || 'None selected'}</p>
        <p>Progress towards goal: {progressPercentage.toFixed(2)}%</p>
        <div style={{ 
          width: '100%', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(progressPercentage, 100)}%`,
            backgroundColor: '#4CAF50',
            height: '20px'
          }}></div>
        </div>
      </div>
    </div>
  );
}

export default App;