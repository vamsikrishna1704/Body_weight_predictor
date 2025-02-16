import React, { useState } from 'react';
import './Questions.css';

const QuestionComponent = ({ question, fieldName, onAnswer }) => {
  const [value, setValue] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAnswer();
  };

  const handleAnswer = () => {
    if (value.trim() !== '') {
      onAnswer(value, fieldName);
      setValue(''); // Clear input after sending
    }
  };

  return (
    <div className="question-container">
      <p>{question}</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your answer..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleAnswer}>Send</button>
      </div>
    </div>
  );
};

export default QuestionComponent;
