import React from 'react';

const DonationProgressTracker = () => {
  // Get values from localStorage with fallbacks to 0
  const totalPurchases = parseFloat(localStorage.getItem('totalPurchases')) || 0;
  const totalDonations = parseFloat(localStorage.getItem('totalDonations')) || 0;

  // Calculate the donation percentage
  const targetDonationAmount = totalPurchases * 0.5;
  const donationPercentage = totalPurchases === 0 
    ? 0 
    : (totalDonations / targetDonationAmount) * 100;

  // Determine status
  const isOnTrack = donationPercentage >= 100;

  return (
    <div className="border rounded-lg p-4 mb-6" style={{ borderColor: isOnTrack ? '#22c55e' : '#3b82f6' }}>
      <h2 className="text-lg font-semibold mb-3">Donation Progress</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-600 text-sm">Total Purchases</p>
          <p className="font-medium">${totalPurchases.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Total Donations</p>
          <p className="font-medium">${totalDonations.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Target (50%)</p>
          <p className="font-medium">${targetDonationAmount.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Current Percentage</p>
          <p className="font-medium">{donationPercentage.toFixed(1)}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded h-2 mb-2">
        <div 
          className="h-full rounded" 
          style={{ 
            width: `${Math.min(donationPercentage, 100)}%`,
            backgroundColor: isOnTrack ? '#22c55e' : '#3b82f6'
          }}
        />
      </div>

      <p className="text-sm" style={{ color: isOnTrack ? '#16a34a' : '#2563eb' }}>
        {isOnTrack 
          ? "You're meeting or exceeding your donation target! 🎉" 
          : `${(100 - donationPercentage).toFixed(1)}% more to reach your target`}
      </p>
    </div>
  );
};

export default DonationProgressTracker;