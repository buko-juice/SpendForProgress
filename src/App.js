import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import DonationProgressTracker from './DonationProgressTracker';
import './App.css';
import logo from './logo.png';

const STEPS = {
  ASK_PURCHASE: 0,
  ENTER_AMOUNT: 1,
  SHOW_DONATION: 2,
  CONFIRM_DONATION: 3,
  COMPLETE: 4
};

const CAMPAIGNS = [
  'Harris-Walz 2024',
  'Fair Fight',
  'Working Families Party',
  'Common Defense'
];

function App() {
  // Core state
  const [step, setStep] = useState(STEPS.ASK_PURCHASE);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [donationAmount, setDonationAmount] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState('');

  // Totals
  const [totalPurchases, setTotalPurchases] = useState(() => {
    const saved = localStorage.getItem('totalPurchases');
    return saved ? parseFloat(saved) : 0;
  });
  const [totalDonations, setTotalDonations] = useState(() => {
    const saved = localStorage.getItem('totalDonations');
    return saved ? parseFloat(saved) : 0;
  });

  // History
  const [purchaseHistory, setPurchaseHistory] = useState(() => {
    const saved = localStorage.getItem('purchaseHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('totalPurchases', totalPurchases.toString());
    localStorage.setItem('totalDonations', totalDonations.toString());
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
  }, [totalPurchases, totalDonations, purchaseHistory]);

  // Core functions
  const handleAmountSubmit = () => {
    const amount = parseFloat(purchaseAmount);
    if (amount > 0) {
      setTotalPurchases(prev => prev + amount);
      setDonationAmount(amount * 0.5);
      setStep(STEPS.SHOW_DONATION);
    }
  };

  const handleDonationConfirm = () => {
    if (selectedCampaign) {
      setTotalDonations(prev => prev + donationAmount);
      addToPurchaseHistory(parseFloat(purchaseAmount), donationAmount);
      setStep(STEPS.COMPLETE);
    }
  };

  const addToPurchaseHistory = (purchaseAmount, donationAmount) => {
    setPurchaseHistory(prev => [...prev, {
      date: new Date().toISOString(),
      purchase: purchaseAmount,
      donation: donationAmount,
      campaign: selectedCampaign
    }]);
  };

  const resetProcess = () => {
    setStep(STEPS.ASK_PURCHASE);
    setPurchaseAmount('');
    setDonationAmount(0);
    setSelectedCampaign('');
  };

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      localStorage.clear();
      setTotalPurchases(0);
      setTotalDonations(0);
      setPurchaseHistory([]);
      resetProcess();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Shop for Progress Logo" className="App-logo" />
        <h1>Shop for Progress</h1>
      </header>

      <div className="app-container">
        <main>
          {/* Progress Tracker */}
          <DonationProgressTracker 
            totalPurchases={totalPurchases}
            totalDonations={totalDonations}
          />

          {/* Current Totals */}
          <div className="totals-summary">
            <p>Total Purchases: ${totalPurchases.toFixed(2)}</p>
            <p>Total Donations: ${totalDonations.toFixed(2)}</p>
            <button onClick={() => setShowHistory(!showHistory)}>
              {showHistory ? 'Hide History' : 'View History'}
            </button>
          </div>

          {/* Purchase/Donation History */}
          {showHistory && (
            <section className="history">
              <h2>Purchase & Donation History</h2>
              {purchaseHistory.length === 0 ? (
                <p>No entries recorded yet.</p>
              ) : (
                <ul>
                  {purchaseHistory.map((entry, index) => (
                    <li key={index}>
                      {new Date(entry.date).toLocaleDateString()}: 
                      Purchase: ${entry.purchase.toFixed(2)} - 
                      Donated: ${entry.donation.toFixed(2)} to {entry.campaign}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Step-by-Step Process */}
          {step === STEPS.ASK_PURCHASE && (
            <section>
              <h2>Did you make a purchase?</h2>
              <button onClick={() => setStep(STEPS.ENTER_AMOUNT)}>
                Yes, Record Purchase
              </button>
            </section>
          )}

          {step === STEPS.ENTER_AMOUNT && (
            <section>
              <h2>How much did you spend?</h2>
              <input 
                type="number" 
                value={purchaseAmount} 
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="Enter amount in $"
              />
              <button onClick={handleAmountSubmit}>Submit</button>
            </section>
          )}

          {step === STEPS.SHOW_DONATION && (
            <section>
              <h2>Time to make a difference!</h2>
              <p>Based on your purchase of ${purchaseAmount}, consider donating:</p>
              <h3>${donationAmount.toFixed(2)} (50%)</h3>
              
              <div className="campaign-selection">
                <h3>Select a campaign:</h3>
                <select 
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                >
                  <option value="">Choose a campaign</option>
                  {CAMPAIGNS.map(campaign => (
                    <option key={campaign} value={campaign}>
                      {campaign}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleDonationConfirm}
                disabled={!selectedCampaign}
              >
                I Made My Donation
              </button>
            </section>
          )}

          {step === STEPS.COMPLETE && (
            <section>
              <h2>Thank you for your contribution!</h2>
              <p>Together we can make a difference! 🎉</p>
              <button onClick={resetProcess}>Record Another Purchase</button>
            </section>
          )}

{/* Manual Donation Entry */}
<section className="manual-entry">
  <h2>Add Manual Donation</h2>
  <div className="campaign-selection">
    <select 
      value={selectedCampaign}
      onChange={(e) => setSelectedCampaign(e.target.value)}
      className="campaign-select"
    >
      <option value="">Choose a campaign</option>
      {CAMPAIGNS.map(campaign => (
        <option key={campaign} value={campaign}>
          {campaign}
        </option>
      ))}
    </select>
  </div>
  <input 
    type="number" 
    value={purchaseAmount} 
    onChange={(e) => setPurchaseAmount(e.target.value)}
    placeholder="Enter donation amount in $"
  />
  <button 
    onClick={() => {
      const amount = parseFloat(purchaseAmount);
      if (amount > 0 && selectedCampaign) {
        setTotalDonations(prev => prev + amount);
        addToPurchaseHistory(0, amount);
        setPurchaseAmount('');
        setSelectedCampaign('');
        alert(`Successfully added $${amount.toFixed(2)} donation to ${selectedCampaign}`);
      } else {
        alert('Please enter an amount and select a campaign.');
      }
    }}
    disabled={!selectedCampaign || !purchaseAmount}
  >
    Add Donation
  </button>
</section>

          {/* Data Management */}
          <div className="privacy-disclaimer">
            <p>Privacy Notice: All data is stored locally on your device.</p>
            <button 
              onClick={debounce(clearAllData, 300)} 
              className="clear-data-btn"
            >
              Clear My Data
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;