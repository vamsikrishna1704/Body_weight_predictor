import React, { useState } from 'react';
import ChatbotComponent from './Chatbot.jsx';
import './App.css';

function App() {

  const[calories, setCalories] = useState(0)

  const handleFormSubmit = async (formData , value) => {
    if(value == 1){
      try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        setCalories(data.predictedCalories)
        return data; // Return the calorie prediction
      } catch (error) {
        console.error('Error:', error);
      }
    }else {
      try {
        const response = await fetch('http://127.0.0.1:5000/diet-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        return data; // Return the calorie prediction
      } catch (error) {
        console.error('Error:', error);
      }
    }   
  };

  return (
    <div className="App">
      <div className='Container'>
        <div className='head'>
          <h1>Daily Health Navigator</h1>
        </div>
        <div className='body'>
          <ChatbotComponent onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>  
  );
}

export default App;
