import React, { useState, useEffect, useRef } from 'react';
import QuestionComponent from './Questions';
import './Chatbot.css'; // Assuming you have this CSS file

const ChatbotComponent = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [calories, setCalories] = useState(0)
  const [goal, setGoal] = useState('')
  const [ideal, setIdeal] = useState(0)
  const [weightDiff, setWeightdiff] = useState(0)
  const [category, setCategory] = useState('')
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
  })
  
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
    "Based on your data, you are "+category+". You ideal weight should be "+ideal+"Kgs. Continue?",
    "You have to "+goal+" "+weightDiff+"Kgs to become normal weight. Continue?",
    "Want to know your calories intake? Yes to continue.",
    'You have to take '+calories+' Calories/Day to achieve your goal. Yes to make diet plans',
    "How many meals you want to take?(between: 2 or 3)",
    "Continue?"
  ];

  const scrollToBottom = () => {
    endOfChatRef.current?.scrollIntoView();
  };

  useEffect(scrollToBottom, [chatHistory]);

  const handleNextStep = async (inputValue, fieldName) => {

    if (step <= questions.length + 1) {
      setInputs({ ...inputs, [fieldName]: inputValue });
      setChatHistory([...chatHistory, { question: questions[step - 1], answer: inputValue }]);
      if( step === questions.length + 1){
        const data = await onSubmit(inputs, 1);
        setCalories(data.predictedCalories);
        setGoal(data.goal);
        setCategory(data.bmiCategory);
        setIdeal(data.idealWeight);
        setWeightdiff(data.weightDifference);
        setStep(step + 1)
      }
      setStep(step + 1)
      console.log(step)
    }
    if (step > questions.length){
      setInputSet({ ...inputSet, [fieldName]: inputValue });
      setChatHistory([...chatHistory, { question: additionalQuestions[step - questions.length - 1], answer: inputValue }])
      if(step === questions.length + additionalQuestions.length + 1){
        const data = await onSubmit(inputSet, 2);
        const jsonLength = data.meal
        if (jsonLength == 2){
          setChatHistory([...chatHistory,
            {question: `Your Meal1: ${data.items1} of ${data.grams1}gms/mL.Continue?`, answer: inputValue},
            {question: `Your Meal2: ${data.items2} of ${data.grams2}gms/mL. Thank you user.`, answer: inputValue},])
          }else if(jsonLength == 3){
            setChatHistory([...chatHistory,
              {question: `Your Meal1: ${data.items1} of ${data.grams1}gms/mL.Continue?`, answer: inputValue},
              {question: `Your Meal2: ${data.items2} of ${data.grams2}gms/mL.Continue?`, answer: inputValue},
              {question: `Your Meal3: ${data.items3} of ${data.grams3}gms/mL.Thank you user.`, answer: inputValue}])
          }
      }
      setStep(step + 1)
    }   
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        <p>Welcome User. Let's start.</p>
        {chatHistory.map((entry, index) => (
          <div key={index} className="chat-entry">
            <div className="chat-question">Expert: {entry.question}</div>
            <div className="chat-answer">User: {entry.answer}</div>
          </div>
        ))}
        <div ref={endOfChatRef} />
      </div>
      {step <= (questions.length + additionalQuestions.length + 1) && 
        <QuestionComponent 
          key={step}
          question={step <= questions.length ? questions[step - 1] : additionalQuestions[step - questions.length - 1]}
          fieldName={step <= questions.length ? Object.keys(inputs)[step - 1] : Object.keys(inputSet)[step - questions.length -1]}
          onAnswer={handleNextStep} 
        />
      }
    </div>
  );
};

export default ChatbotComponent;
