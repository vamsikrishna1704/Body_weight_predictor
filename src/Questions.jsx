import React, { useState } from 'react';
import './Questions.css'; // New CSS import

const QuestionComponent = ({ question, fieldName, onAnswer }) => {
  const [value, setValue] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnswer();
    }
  };

  const handleAnswer = () => {
    onAnswer(value, fieldName);
  };

  return (
    <div className="question-container">
      <p>{question}</p>
      <div className="input-container">
        <input type="text" onKeyDown={handleKeyPress} value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={handleAnswer}>Send</button>
      </div>
    </div>
  );
};

export default QuestionComponent;
