import React from 'react';

const DonationProgressTracker = ({ totalPurchases, totalDonations }) => {
  // Calculate donation targets
  const targetDonation = totalPurchases * 0.5; // 50% of purchases
  const progressPercentage = totalPurchases === 0 
    ? 0 
    : Math.min((totalDonations / targetDonation) * 100, 100);
  const isOnTrack = totalDonations >= targetDonation;

  return (
    <div className="donation-target">
      <h3>Donation Progress</h3>
      <p>Target (50% of Purchases): ${targetDonation.toFixed(2)}</p>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className={isOnTrack ? 'status-on-track' : 'status-behind'}>
        {isOnTrack 
          ? "🎉 You're meeting your donation target!" 
          : `📊 Need $${(targetDonation - totalDonations).toFixed(2)} more in donations`
        }
      </p>
    </div>
  );
};

export default DonationProgressTracker;