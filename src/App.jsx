import { useState, useEffect } from 'react'
import './App.css'
import SetupForm from './components/SetupForm';

function App() { 
  
  {/* This is the main App component that will render the setup form and handle the quiz logic
      State variables to manage categories, selected category, difficulty, questions, current question index,
      and whether the quiz is being shown or not*/}
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Holds the selected category ID
  const [difficulty, setDifficulty] = useState('easy'); //The default defficulty is easy, this holds what the user selects
  const [questions, setQuestions] = useState([]); // Hold the fetched questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Tracks what question the user is on 
  const [showQuiz, setShowQuiz] = useState(false); // defaults to the setup Menu 
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Tracks the answer the user has selected
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // Tracks if the answer is correct or not
  const [score, setScore] = useState(0); // Tracks the user's score
  const [timer, setTimer] = useState(0); // Timer for each question 
  const [submitted, setSubmitted] = useState(false); // Tracks if the form has been submitted
  const [playerName, setPlayerName] = useState(''); // Holds the player's name 
  const [nameSubmit, setNameSubmit] = useState(false); // Tracks if the player name has been submitted 
  const [timeOut, setTimeOut] = useState(false); // Timer for each question 
  const [quizCompleted, setQuizCompleted] = useState(false); // Tracks if the quiz has been completed
  const [shuffledAnswers, setShuffledAnswers] = useState([]); // Tracks if the answers should be shuffled
  const [isInitialized, setIsInitialized] = useState(false); // Tracks if the app has been initialized
 // const [showResumePrompt, setShowResumePrompt] = useState(false); // Tracks if the resume prompt should be shown when page is refreshed (v2?)

 // Trigger confetti when quiz is completed
  useEffect(() => {
    if (quizCompleted && window.confetti) {
      window.confetti();
    }
  }, [quizCompleted]);

  // useEffect fetches trivia categories from the API
  useEffect(() => {
  fetch('https://opentdb.com/api_category.php')
    .then(response => response.json())
    .then(data => {
      console.log("Fetched categories:", data.trivia_categories);
      setCategories(data.trivia_categories);
    })
    .catch(error => console.error('Error fetching categories:', error));
}, []);


  // Tells the app to start the quiz by fetching questions based on the selected category and difficulty level
  const handleStartQuiz = () => {
    if (!selectedCategory) { // If no category is selected, alert the user
      alert('Please select a category');
      return;
    }

    const url = `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`; // This URL fetches 10 questions from the selected category and difficulty level
    console.log('Quiz API URL:', url); // Log the URL to check if it's correct (visible in the console)

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results); // This will save the questions in state
        setCurrentQuestionIndex(0);
        setShowQuiz(true);          //Starts off the trivia q's
      })
      .catch((error) => {
        console.error('Error fetching trivia questions:' , error);
      });
  };

  // Timer logic - sets 20s countdown for each question
    useEffect(() => {
      if (!showQuiz || questions.length === 0) return;
      setTimer(20); // Reset to 20 seconds on each new question

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setSubmitted(true); //Locks in answers buttons
          setTimeOut(true); // Auto-submit when timer hits 0
          return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(countdown); // Cleanup on question change
}, [currentQuestionIndex, showQuiz, submitted, questions.length]); // added questions.length to dependencies

  // Shuffle answers function
 useEffect(() => {
  if (
    questions.length > 0 &&
    questions[currentQuestionIndex] &&
    questions[currentQuestionIndex].correct_answer &&
    questions[currentQuestionIndex].incorrect_answers
  ) {
    const currentQuestion = questions[currentQuestionIndex];
    const allAnswers = [
      ...currentQuestion.incorrect_answers,
      currentQuestion.correct_answer,
    ];
    const shuffled = allAnswers.sort(() => Math.random() - 0.5);
    setShuffledAnswers(shuffled);
  }
}, [currentQuestionIndex, questions]);

// Save the quiz state to local storage whenever the relevant state variables change
// This allows the quiz state to persist across page reloads
useEffect(() => {
  if (
    questions.length === 0 ||
    !playerName ||
    !nameSubmit 
  ) return; // Don't save if no questions or player name is set

  const quizState = {
    showQuiz,
    questions,
    currentQuestionIndex,
    score,
    selectedCategory,
    difficulty,
    playerName,
    nameSubmit, // Save the nameSubmit state to local storage
    timer, // Save the timer state to local storage
    quizCompleted, // Save the quizCompleted state to local storage
  };
  localStorage.setItem('quizState', JSON.stringify(quizState)); // Save the quiz state to local storage
}, [showQuiz, questions, currentQuestionIndex, score, selectedCategory, difficulty, playerName, nameSubmit, timer,quizCompleted]); // Save the quiz state whenever these variables change

useEffect(() => {
  const saved = localStorage.getItem('quizState');

  if (saved) {
    console.log('Saved quizState found:', saved); // Log the saved state for debugging
    try {
      const state = JSON.parse(saved);
      setShowQuiz(state.showQuiz);
      setQuestions(state.questions);
      setCurrentQuestionIndex(state.currentQuestionIndex);
      setScore(state.score);
      setSelectedCategory(state.selectedCategory);
      setDifficulty(state.difficulty);
      setPlayerName(state.playerName);
      setNameSubmit(state.nameSubmit);
      setTimer(state.timer);
      setQuizCompleted(state.quizCompleted || false); // Ensure quizCompleted is set to false if not present
    } 
    catch (err) {
      console.error('Error parsing saved quizState:', err);
      localStorage.removeItem('quizState');
    }
  }
  setIsInitialized(true);
}, []);

  // Check if the app is initialized before rendering
  if (!isInitialized) return null;

  
  return (
    <div className="app">
      {!showQuiz && !quizCompleted && (
        <h1 className="title">Welcome to The Debugger's Trivia App</h1>
      )} 
      {/* Show the title only if the quiz has not started yet */}
      {/* Show the name input screen only if nameSubmit is false */}
      {/* If the quiz is not started, show the setup form and start button */}
      
      {!showQuiz && !quizCompleted ?  ( //If showQuiz is false, then we show the setup form
        !nameSubmit ? (
        <div className="name-input">
          <h2>Enter your name to start the quiz:</h2>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Player Name"
          />
          <button
            onClick={() => {
              if (playerName.trim() === '') {
                alert('Please enter your name');
              } else {
                setNameSubmit(true); // Set nameSubmit to true to show the setup form
              }
            }}
          >
            Submit 
          </button>
        </div>
      ) : ( // If nameSubmit is true, show the setup form
        <>
        <h2 className="setup-title">Happy Trivia, {playerName}</h2>
        <SetupForm
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
        
        <button onClick={handleStartQuiz} disabled={!selectedCategory} className='start-quiz-button'>
          Start Quiz
        </button>
        </>
      )
      ) : null} 
      
      {/* else, if the quiz has started, we show the quiz questions */}
      {showQuiz && (
        <>
          {/* Code for the actual quiz questions */}

          {questions.length > 0 ? (
            <div className="question-container">
               <div className="quiz-header">
              
              {/* Show the current question number out of total questions */}
              <p className="question-number">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p> 
              
              {/* Display the current score */}
              <p className='score'>Score: {score}</p> 

              {/* Show the timer only if the question has not been submitted yet */}
              {!submitted && (
              <p className="timer">
                ⏱️ Time Left: {timer}s
                </p>
              )} 
              </div>

          {/* Display the current question, making sure the HTML formatting is correct. Allows for raw HTML to be inserted into the page*/}
              <h2 dangerouslySetInnerHTML={{
                __html: questions[currentQuestionIndex].question
                }} 
                /> 
              
              {/* Show the time's up message if the time has run out and the question has been submitted */}
              {submitted && timeOut &&
              <p className="times-up">
                Time's Up!
                <br /> 
                <br /> 
                The correct answer is: {selectedAnswer}
                </p>} 
              {/* Show the selected answer if the time has run out and the question has been submitted*/}
              
              {/* Display the answers as buttons, which will be highlighted based on whether they are correct or not */}
              <ul>
              {/* Shuffle the answers before displaying them */}
               {shuffledAnswers.map((answer, index) => (
                  <div key={index}>
                    
                    {/* Highlight the correct (green) and incorrect answers (red if chosen) */}
                      <button
                        className={`answer-button
                        ${
                          submitted
                            ? answer === questions[currentQuestionIndex].correct_answer
                              ? 'correct'
                              : answer === selectedAnswer
                              ? 'incorrect'
                              : 'disabled'
                            : answer === selectedAnswer
                            ? 'selected'  
                            : ''
                        }`}
                        onClick={() => {
                          if (!submitted) { // If no answer has been selected yet
                            setSelectedAnswer(answer); // Set the selected answer
                          }
                        }}
                        dangerouslySetInnerHTML={{ __html: answer }}
                      ></button>
                      <br />
                      <br />
                    </div> 
                  ))} 
              </ul>
          
              {/* Button to submit the answer, which will check if the answer is correct or not */}

              {!submitted && (
                <button 
                className='submit-button'
                  onClick={() => {
                    if (!selectedAnswer) {
                      alert('Please select an answer'); // If no answer is selected, alert the user
                      return;
                    }

                    setSubmitted(true); // Set submitted to true to disable the button
                    const correct = questions[currentQuestionIndex].correct_answer; // Get the correct answer for the current question
                    if (selectedAnswer === correct) {
                      setScore(prevScore => prevScore + 1); // If the answer is correct, increment the score
                      setIsAnswerCorrect(true); // Set to true if correct
                    } else {
                      setIsAnswerCorrect(false); // Set to false if incorrect
                    }

                  }}
                >
                  Submit 
                </button>
              )}
              {submitted && (
                <button
                  className='next-question-button'
                  onClick={() => {
                    if (currentQuestionIndex + 1 < questions.length) {
                      setCurrentQuestionIndex(prev => prev + 1); // If there are more questions, go to the next question
                      setSelectedAnswer(null); // Reset the selected answer for the next question
                      setSubmitted(false); // Reset the submitted state for the next question
                      setIsAnswerCorrect(null); // Reset the answer correctness state for the next question
                      setTimeOut(false); // Reset the timeout state for the next question
                      setTimer(20); // Reset the timer to 20 seconds for the next question
                    } else {
                      setQuizCompleted(true); // If there are no more questions, show the score screen
                      setShowQuiz(false); // Hide the quiz
                    }
                  }}
                >
                  {currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Finish Trivia'}
                </button>
              )}
            </div>
          ) : (
            <p className='loading-ellipses'>Loading<span className="dots"></span></p> //If questions are still being fetched, show elipses 
          )}
        </>
      )}
  
  {/* Final Score Screen */}
  {quizCompleted && (
    <div className="final-score-screen">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2278/2278992.png"
        alt="Trophy"
        className="trophy-icon"
      />
      <h2>Congratulations</h2>
      <p>Your Score</p>
      <h3 style={{ fontSize: '2rem', color: '#e63946' }}>
        {score} / {questions.length}
      </h3>
      <p>Ready for another round? Show this to your server and get 15% off your next appetizer!</p>
      
      
      <button
        className="play-again-button"
        onClick={() => {
          localStorage.removeItem('quizState'); // Clear the saved quiz state from local storage
          setQuizCompleted(false);
          setShowQuiz(false);
          setQuestions([]);
          setScore(0);
          setSelectedCategory(null);
          setDifficulty('easy');
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setSubmitted(false);
          setTimeOut(false);
        }}
      >
        Play Again
      </button>

      <button
        className="back-home-button"
        onClick={() => {
          setQuizCompleted(false);
          setNameSubmit(false);
          setShowQuiz(false);
          setQuestions([]);
          setScore(0);
          setDifficulty('easy');
          setPlayerName('');
          setSelectedCategory(null);
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setSubmitted(false);
          setTimeOut(false);
        }}
      >
        Back to Home
      </button>
    </div>
  )}
    </div>
  );
}
export default App;