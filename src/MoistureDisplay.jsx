// MoistureDisplay.js
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MoistureDisplay = () => {
  const [moisture, setMoisture] = useState(null);
  const [voltage, setVoltage] = useState(null);
  const [error, setError] = useState(null);
  const [relayStatus, setRelayStatus] = useState(false); // Add relay status state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://152.58.179.185:80/data");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMoisture(data.moisture);
        setVoltage(data.voltage);
        setError(null);
      } catch (error) {
        setError("Failed to fetch data.");
        console.error("Fetch error:", error);
      }
    };
//hello
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    fetchData();
    return () => clearInterval(interval);
  }, []);

  const handleRelayToggle = async () => {
    try {
      const response = await fetch('http://152.58.179.185:80/relay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        // Toggle the relay status locally
        const newRelayStatus = !relayStatus;
        setRelayStatus(newRelayStatus); 
        
        // Show different toast messages based on the new relay status
        if (newRelayStatus) {
          toast.success("Relay turned ON"); // Message for turning on
        } else {
          toast.warning("Relay turned OFF"); // Message for turning off
        }
      } else {
        throw new Error('Failed to toggle relay');
      }
    } catch (error) {
      console.error('Relay toggle error:', error);
      toast.error("Failed to toggle relay."); // Show error toast
    }
  };

  const calculateMoisturePercentage = (moistureValue) => {
    return Math.min(100, Math.max(0, (moistureValue / 65535) * 100));
  };

  const moisturePercentage = moisture !== null ? calculateMoisturePercentage(moisture) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <ToastContainer hideProgressBar={true} theme='colored' />
      <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-md w-full h-1/2 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-green-800 mb-4">Plant Moisture Monitor</h1>
        {error && <p className="text-red-500 font-bold">{error}</p>}
        {moisture === null || voltage === null ? (
          <p className="text-lg text-green-700">Loading data...</p>
        ) : (
          <>
            <div className="gauge my-6">
              <svg width="200" height="150" viewBox="0 0 200 100">
                <path
                  d="M 10 90 A 90 90 0 0 1 190 90"
                  fill="none"
                  stroke="#ddd"
                  strokeWidth="20"
                />
                <path
                  d="M 10 90 A 90 90 0 0 1 190 90"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="20"
                  strokeDasharray={`${moisturePercentage * 2.9}, 180`}
                />
                <text x="100" y="70" textAnchor="middle" fontSize="20" fill="#333">
                  {Math.round(moisturePercentage)}%
                </text>
              </svg>
            </div>
            <p className="text-lg text-green-700">Voltage: <span className="font-semibold">{voltage.toFixed(2)}V</span></p>
            <div className="mt-4">
              {moisture < 300 ? (
                <p className="text-red-500 font-bold">Warning: Soil is dry!</p>
              ) : (
                <p className="text-green-500 font-bold">Soil moisture is good.</p>
              )}
            </div>
            {/* Relay Control Button */}
            <button
              onClick={handleRelayToggle}
              className={`mt-4 px-6 py-2 font-bold text-white rounded-lg ${relayStatus ? 'bg-red-500' : 'bg-green-500'}`}
            >
              {relayStatus ? 'Turn Relay Off' : 'Turn Relay On'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MoistureDisplay;
