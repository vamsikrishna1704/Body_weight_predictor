import React, { useState, useEffect, useRef } from 'react';
import QuestionComponent from './Questions';
import './Chatbot.css';

const ChatbotComponent = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [calories, setCalories] = useState(0);
  const [goal, setGoal] = useState('');
  const [ideal, setIdeal] = useState(0);
  const [weightDiff, setWeightDiff] = useState(0);
  const [category, setCategory] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const endOfChatRef = useRef(null);

  const [inputs, setInputs] = useState({
    height: '',
    heightUnit: '',
    age: '',
    gender: '',
    weight: '',
    weightUnit: '',
    activity: ''
  });

  const [inputSet, setInputSet] = useState({
    message: '',
    message1: '',
    message2: '',
    message3: '',
    message4: '',
    meals: ''
  });

  const questions = [
    "What is your height?",
    "What is your height unit? (cm/ft)",
    "How old are you?",
    "What is your gender? (m/f)",
    "What is your weight?",
    "What is your weight unit? (kg/lb)",
    "What is your activity level? (no active/little active/moderate active/active/very active/extra active)"
  ];

  const additionalQuestions = [
    "Continue?",
    `Based on your data, you are ${category}. Your ideal weight should be ${ideal} Kgs. Continue?`,
    `You have to ${goal} ${weightDiff} Kgs to reach a normal weight. Continue?`,
    "Want to know your calorie intake? Yes to continue.",
    `You need to consume ${calories} Calories/Day to achieve your goal. Yes to make diet plans`,
    "How many meals do you want to take? (between 2 or 3)",
    "Continue?"
  ];

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleNextStep = async (inputValue, fieldName) => {
    if (step <= questions.length + 1) {
      setInputs({ ...inputs, [fieldName]: inputValue });
      setChatHistory((prev) => [...prev, { type: 'bot', text: questions[step - 1] }, { type: 'user', text: inputValue }]);

      if (step === questions.length + 1) {
        const data = await onSubmit(inputs, 1);
        setCalories(data.predictedCalories);
        setGoal(data.goal);
        setCategory(data.bmiCategory);
        setIdeal(data.idealWeight);
        setWeightDiff(data.weightDifference);
        setStep(step + 1);
      }
      setStep(step + 1);
    } else {
      setInputSet({ ...inputSet, [fieldName]: inputValue });
      setChatHistory((prev) => [...prev, { type: 'bot', text: additionalQuestions[step - questions.length - 1] }, { type: 'user', text: inputValue }]);

      if (step === questions.length + additionalQuestions.length + 1) {
        const data = await onSubmit(inputSet, 2);
        const meals = [
          `Your Meal1: ${data.items1} of ${data.grams1}gms/mL.`,
          `Your Meal2: ${data.items2} of ${data.grams2}gms/mL.`
        ];
        if (data.meal === 3) {
          meals.push(`Your Meal3: ${data.items3} of ${data.grams3}gms/mL.`);
        }
        setChatHistory((prev) => [...prev, ...meals.map((m) => ({ type: 'bot', text: m }))]);
      }
      setStep(step + 1);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        <div className="chat-welcome">👋 Welcome User! Let's start.</div>
        {chatHistory.map((entry, index) => (
          <div key={index} className={`chat-message ${entry.type}`}>
            {entry.text}
          </div>
        ))}
        <div ref={endOfChatRef} />
      </div>
      {step <= questions.length + additionalQuestions.length + 1 && (
        <QuestionComponent
          key={step}
          question={step <= questions.length ? questions[step - 1] : additionalQuestions[step - questions.length - 1]}
          fieldName={step <= questions.length ? Object.keys(inputs)[step - 1] : Object.keys(inputSet)[step - questions.length - 1]}
          onAnswer={handleNextStep}
        />
      )}
    </div>
  );
};

export default ChatbotComponent;
