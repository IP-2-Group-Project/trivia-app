import { useState, useEffect } from 'react'
import './App.css'
import SetupForm from './components/SetupForm';

{/* To do:

Highlight Correct and Incorrect Answers in red or green, I have the code 
to determine if the answer is correct or not, but I need to implement it so its visible to the user
            
Add a timer for each question

Show the score at the end of the quiz
           
Add a "Back to Setup" button to reset the quiz
            
Have a back button?

*/}

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
  const [timer, setTimer] = useState(0); // Timer for each question (not implemented yet)
  const [submitted, setSubmitted] = useState(false); // Tracks if the form has been submitted

  {/*useEffect fetches trivia categories from the API */}

  useEffect(() => {
  fetch('https://opentdb.com/api_category.php')
    .then(response => response.json())
    .then(data => {
      console.log("Fetched categories:", data.trivia_categories);
      setCategories(data.trivia_categories);
    })
    .catch(error => console.error('Error fetching categories:', error));
}, []);

  {/* Tells the app to start the quiz by fetching questions based on the selected category and difficulty level */}
  const handleStartQuiz = () => {
    if (!selectedCategory) { // If no category is selected, alert the user
      alert('Please select a category');
      return;
    }

    {/*Need to change URL to 15 questions instead of 10*/}

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

  return (
    <div className="app">
      {!showQuiz && (
        <h1 className="title">Welcome to The Debugger's Trivia App</h1>
      )} {/* Show the title only if the quiz has not started yet */}
     
     {/* If the quiz is not started, show the setup form and start button */}
      
      {!showQuiz ? ( //If showQuiz is false, then we show the setup form
        <>
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
      ) : ( //else, if the quiz has started, we show the quiz questions
      <>

      {/* Code for the actual quiz questions */}

      {questions.length > 0 ? (
        <div className="question-container">
      
      {/* Display the current question, making sure the HTML formatting is correct. Allows for raw HTML to be inserted into the page*/}
          <h2 dangerouslySetInnerHTML={{__html: questions[currentQuestionIndex].question}} /> {/* This will display the current question */}

          <p>Score: {score}</p> {/* Display the current score */}

          <ul>
            {[...questions[currentQuestionIndex].incorrect_answers, questions[currentQuestionIndex].correct_answer]
              .sort(() => Math.random() - 0.5) // This will shuffle the answers
              .map((answer, index) => (       
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
            } else {
              alert('Quiz completed!'); // If there are no more questions, alert the user
              setShowQuiz(false); // Reset the quiz state to show the setup form again  
            }
          }}
          >
            Next Question
          </button>
        )}
        </div>
      ) : (
        <p>...</p> //If questions are still being fetched, show elipses (Will animate later) 
      )}
      </>
      )}
    </div>
  );
}
export default App;
