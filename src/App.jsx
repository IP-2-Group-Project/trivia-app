import { useState, useEffect } from 'react'
import './App.css'
import SetupForm from './components/SetupForm';

function App() { 
  
  {/* This is the main App component that will render the setup form and handle the quiz logic
      State variables to manage categories, selected category, difficulty, questions, current question index,
      and whether the quiz is being shown or not*/}
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false); // defaults to the setup Menu 

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

  {/* This function tells the app to start the quiz by fetching questions based on the selected category and difficulty level */}
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
      <h1>Welcome to our Trivia App</h1>
     
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
        
        <button onClick={handleStartQuiz} disabled={!selectedCategory}>
          Start Quiz
        </button>
        </>
      ) : ( //else, if the quiz has started, we show the quiz questions
      <>

      {/* This is the code for the actual quiz questions */}

      {questions.length > 0 ? (
        <div className="question-container">
      
      {/* Display the current question, making sure the HTML formatting is correct. Allows for raw HTML to be inserted into the page*/}
          <h2 dangerouslySetInnerHTML={{__html: questions[currentQuestionIndex].question}} /> {/* This will display the current question */}

          <ul>
            {[...questions[currentQuestionIndex].incorrect_answers, questions[currentQuestionIndex].correct_answer]
              .sort(() => Math.random() - 0.5) // This will shuffle the answers
              .map((answer, index) => (       
                <div key={index}>
                  <button dangerouslySetInnerHTML={{__html: answer}} /> {/* This will display the answer options as buttons */}
                  <br />
                  <br />
                </div> 
              ))} 
          </ul>
      
            {/* To do:

            Highlight Correct and Incorrect Answers in red or green, I have the code 
            to determine if the answer is correct or not, but I need to implement it so its visible to the user
            
            Add a timer for each question
            
            Show the score at the end of the quiz
           
            Add a "Back to Setup" button to reset the quiz
            
            Have a back button?

             */}


          <button onClick={() => {
            if (currentQuestionIndex + 1 < questions.length) {
              setCurrentQuestionIndex(prev => prev + 1); // If there are more questions, go to the next question
            } else {
              alert('Quiz completed!'); // If there are no more questions, alert the user
              setShowQuiz(false); // Reset the quiz state to show the setup form again  
            }
          }}
          >
            Next Question
          </button>
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
