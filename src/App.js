import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
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
  { name: "Harris-Walz 2024", url: "https://secure.actblue.com/donate/joe-biden-3" },
  { name: "Fair Fight", url: "https://secure.actblue.com/donate/ff-web" },
  { name: "Working Families Party", url: "https://secure.actblue.com/donate/wfppac_general?refcode=NatWebsite-button" },
  { name: "Common Defense", url: "https://commondefense.us/donate" },
];

function App() {
  const [step, setStep] = useState(STEPS.ASK_PURCHASE);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [donationAmount, setDonationAmount] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(() => {
    const saved = localStorage.getItem('totalPurchases');
    return saved ? parseFloat(saved) : 0;
  });
  const [totalDonations, setTotalDonations] = useState(() => {
    const saved = localStorage.getItem('totalDonations');
    return saved ? parseFloat(saved) : 0;
  });
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [manualDonationAmount, setManualDonationAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('totalPurchases', totalPurchases.toString());
    localStorage.setItem('totalDonations', totalDonations.toString());
  }, [totalPurchases, totalDonations]);

  const handleYesPurchase = () => {
    setStep(STEPS.ENTER_AMOUNT);
    setShowEncouragement(false);
  };

  const handleNoPurchase = () => {
    setStep(STEPS.ASK_PURCHASE);
    setShowEncouragement(false);
  };

  const handleAmountSubmit = () => {
    const amount = parseFloat(purchaseAmount);
    if (amount > 0) {
      setTotalPurchases(prev => prev + amount);
      setDonationAmount(amount * 0.5);
      setStep(STEPS.SHOW_DONATION);
      setShowEncouragement(false);
    }
  };

  const handleDonationConfirm = (confirmed) => {
    if (confirmed) {
      setTotalDonations(prev => prev + donationAmount);
      setStep(STEPS.COMPLETE);
      setShowEncouragement(false);
    } else {
      setShowEncouragement(true);
    }
  };

  const resetProcess = () => {
    setStep(STEPS.ASK_PURCHASE);
    setPurchaseAmount('');
    setDonationAmount(0);
    setShowEncouragement(false);
  };

  const handleManualDonationSubmit = () => {
    const amount = parseFloat(manualDonationAmount);
    if (amount > 0) {
      setTotalDonations(prev => prev + amount);
      setManualDonationAmount('');
      alert(`Successfully added $${amount.toFixed(2)} to total donations.`);
    } else {
      alert('Please enter a valid donation amount.');
    }
  };

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      requestIdleCallback(() => {
        localStorage.removeItem('totalPurchases');
        localStorage.removeItem('totalDonations');
        
        requestAnimationFrame(() => {
          setTotalPurchases(0);
          setTotalDonations(0);
          
          setTimeout(() => {
            alert("All data has been cleared.");
          }, 0);
        });
      });
    }
  };

  const debouncedClearAllData = debounce(clearAllData, 300);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Shop for Progress 2024 Logo" className="App-logo" />
        <h1>Shop for Progress 2024</h1>
      </header>
      <div className="app-container">
        <main>
          <div className="totals-summary">
            <p>Total Purchases: ${totalPurchases.toFixed(2)}</p>
            <p>Total Donations: ${totalDonations.toFixed(2)}</p>
          </div>

          {step === STEPS.ASK_PURCHASE && (
            <section className="purchase-question">
              <h2>Did you make a non-essential purchase just now?</h2>
              <button onClick={handleYesPurchase}>Yes</button>
              <button onClick={handleNoPurchase}>No</button>
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
              <h2>Time to donate!</h2>
              <p>Based on your purchase of ${purchaseAmount}, consider donating at least:</p>
              <h3>${donationAmount.toFixed(2)}</h3>
              <p>to a progressive political campaign.</p>
              <h3>Choose a campaign:</h3>
              <ul>
                {CAMPAIGNS.map((campaign, index) => (
                  <li key={index}>
                    <a href={campaign.url} target="_blank" rel="noopener noreferrer">{campaign.name}</a>
                  </li>
                ))}
              </ul>
              <h3>Did you make your donation?</h3>
              <button onClick={() => handleDonationConfirm(true)}>Yes</button>
              <button onClick={() => handleDonationConfirm(false)}>Not yet</button>
              {showEncouragement && (
                <div className="encouragement-message">
                  <p>Every donation, no matter how small, makes a difference! Your support can help create the change we want to see. Why not take a moment to contribute now?</p>
                </div>
              )}
            </section>
          )}

          {step === STEPS.COMPLETE && (
            <section>
              <h2>Awesome work!</h2>
              <p>You're Shopping for Progress in 2024. 🎉</p>
              <button onClick={resetProcess}>Start Over</button>
            </section>
          )}

          <section className="manual-donation">
            <h2>Add Manual Donation</h2>
            <p className="manual-donation-explanation">
              Use this section to add donations you've made outside of this app. 
              This helps keep your total donations accurate if you've contributed directly to campaigns.
            </p>
            <input 
              type="number" 
              value={manualDonationAmount} 
              onChange={(e) => setManualDonationAmount(e.target.value)}
              placeholder="Enter donation amount"
            />
            <button onClick={handleManualDonationSubmit}>Add Donation</button>
          </section>

          <div className="privacy-disclaimer">
            <p>Privacy Notice: All data is stored locally on your device. No personal information is sent to or stored on our servers.</p>
            <button onClick={debouncedClearAllData} className="clear-data-btn">Clear My Data</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;