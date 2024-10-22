import React, { useState, useEffect } from 'react';
import DonationProgressTracker from './DonationProgressTracker';
import './App.css';

const STEPS = {
  ASK_PURCHASE: 'ASK_PURCHASE',
  ENTER_AMOUNT: 'ENTER_AMOUNT',
  SHOW_DONATION: 'SHOW_DONATION',
  CONFIRM_DONATION: 'CONFIRM_DONATION',
  COMPLETE: 'COMPLETE'
};

const CAMPAIGNS = [
  'Harris-Walz 2024',
  'Fair Fight',
  'Working Families Party',
  'Common Defense'
];

function App() {
  // State management
  const [step, setStep] = useState(STEPS.ASK_PURCHASE);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [donationAmount, setDonationAmount] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [totalPurchases, setTotalPurchases] = useState(() => {
    const saved = localStorage.getItem('totalPurchases');
    return saved ? parseFloat(saved) : 0;
  });
  const [totalDonations, setTotalDonations] = useState(() => {
    const saved = localStorage.getItem('totalDonations');
    return saved ? parseFloat(saved) : 0;
  });
  const [donationHistory, setDonationHistory] = useState(() => {
    const saved = localStorage.getItem('donationHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever totals change
  useEffect(() => {
    localStorage.setItem('totalPurchases', totalPurchases.toString());
    localStorage.setItem('totalDonations', totalDonations.toString());
    localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
  }, [totalPurchases, totalDonations, donationHistory]);

  const handleYesPurchase = () => {
    setStep(STEPS.ENTER_AMOUNT);
  };

  const handleNoPurchase = () => {
    setStep(STEPS.ASK_PURCHASE);
    setPurchaseAmount('');
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
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
      setDonationHistory(prev => [...prev, {
        date: new Date().toISOString(),
        amount: donationAmount,
        campaign: selectedCampaign
      }]);
      setStep(STEPS.COMPLETE);
    }
  };

  const handleManualDonationSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    const campaign = e.target.campaign.value;
    if (amount > 0 && campaign) {
      setTotalDonations(prev => prev + amount);
      setDonationHistory(prev => [...prev, {
        date: new Date().toISOString(),
        amount: amount,
        campaign: campaign
      }]);
      e.target.reset();
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      setTotalPurchases(0);
      setTotalDonations(0);
      setDonationHistory([]);
      setPurchaseAmount('');
      setDonationAmount(0);
      setSelectedCampaign('');
      setStep(STEPS.ASK_PURCHASE);
      localStorage.clear();
    }
  };

  const resetStep = () => {
    setStep(STEPS.ASK_PURCHASE);
    setPurchaseAmount('');
    setDonationAmount(0);
    setSelectedCampaign('');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Shop for Progress 2024</h1>
      
      {/* Donation Progress Tracker */}
      <DonationProgressTracker />

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        {step === STEPS.ASK_PURCHASE && (
          <div>
            <h2 className="text-xl mb-4">Did you make a non-essential purchase today?</h2>
            <div className="space-x-4">
              <button
                onClick={handleYesPurchase}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Yes
              </button>
              <button
                onClick={handleNoPurchase}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        )}

        {step === STEPS.ENTER_AMOUNT && (
          <form onSubmit={handleAmountSubmit}>
            <h2 className="text-xl mb-4">How much did you spend?</h2>
            <input
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Continue
            </button>
          </form>
        )}

        {step === STEPS.SHOW_DONATION && (
          <div>
            <h2 className="text-xl mb-4">
              Consider donating ${donationAmount.toFixed(2)} (50% of your purchase)
            </h2>
            <div className="mb-4">
              <label className="block mb-2">Select a campaign:</label>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="border p-2 rounded w-full"
                required
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
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              I Made My Donation
            </button>
          </div>
        )}

        {step === STEPS.COMPLETE && (
          <div>
            <h2 className="text-xl mb-4">Thank you for your donation!</h2>
            <button
              onClick={resetStep}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Track Another Purchase
            </button>
          </div>
        )}

        {/* Manual Donation Entry */}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-xl mb-4">Add Manual Donation</h2>
          <form onSubmit={handleManualDonationSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Amount:</label>
              <input
                type="number"
                name="amount"
                className="border p-2 rounded w-full"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Campaign:</label>
              <select
                name="campaign"
                className="border p-2 rounded w-full"
                required
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
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Donation
            </button>
          </form>
        </div>

        {/* Donation History */}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-xl mb-4">Donation History</h2>
          {donationHistory.length > 0 ? (
            <div className="space-y-2">
              {donationHistory.map((donation, index) => (
                <div key={index} className="border p-2 rounded">
                  <p>Amount: ${donation.amount.toFixed(2)}</p>
                  <p>Campaign: {donation.campaign}</p>
                  <p>Date: {new Date(donation.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No donations recorded yet.</p>
          )}
        </div>

        {/* Clear Data Button */}
        <div className="mt-8 pt-8 border-t">
          <button
            onClick={clearAllData}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;