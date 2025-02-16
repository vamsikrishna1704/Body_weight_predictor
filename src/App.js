import React, { useState } from 'react';
import ChatbotComponent from './Chatbot.jsx';
import './App.css';

function App() {
  const [calories, setCalories] = useState(0);

  const handleFormSubmit = async (formData, value) => {
    const url = value === 1 ? 'http://127.0.0.1:5000/predict' : 'http://127.0.0.1:5000/diet-plan';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (value === 1) setCalories(data.predictedCalories);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <div className="Container">
        <div className="head">
          <h1>Daily Health Navigator</h1>
        </div>
        <div className="body">
          <ChatbotComponent onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
}

export default App;
