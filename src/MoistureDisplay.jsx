// MoistureDisplay.js
import React, { useState, useEffect } from 'react';

const MoistureDisplay = () => {
  const [moisture, setMoisture] = useState(0);
  const [voltage, setVoltage] = useState(0.0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://your_server_address/data"); // Replace with your Pico's API
      const data = await response.json();
      setMoisture(data.moisture);
      setVoltage(data.voltage);
    };

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-800 mb-4">Plant Moisture Monitor</h1>
        <p className="text-lg text-green-700">Moisture Level: <span className="font-semibold">{moisture}</span></p>
        <p className="text-lg text-green-700">Voltage: <span className="font-semibold">{voltage.toFixed(2)}V</span></p>
        <div className="mt-4">
          {moisture < 300 ? (
            <p className="text-red-500 font-bold">Warning: Soil is dry!</p>
          ) : (
            <p className="text-green-500 font-bold">Soil moisture is good.</p>
          )}
        </div>
      </div>
      <img src="https://www.creativefabrica.com/wp-content/uploads/2022/02/17/Spring-Decorative-Plant-Graphic-Design-Graphics-25400672-1.jpg" alt="Tree and Plant" className="mt-6 w-52 h-40" />
    </div>
  );
};

export default MoistureDisplay;
