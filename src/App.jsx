import { useState, useEffect } from 'react'
import './App.css'
import SetupForm from './components/SetupForm';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false); // defaults to the setup Menu 

  useEffect(() => {
  fetch('https://opentdb.com/api_category.php')
    .then(response => response.json())
    .then(data => {
      console.log("Fetched categories:", data.trivia_categories);
      setCategories(data.trivia_categories);
    })
    .catch(error => console.error('Error fetching categories:', error));
}, []);


  const handleStartQuiz = () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    const url = `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`;
    console.log('Quiz API URL:', url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results); // This will save the questions in state
        setCurrentQuestionIndex(0);
        setShowQuiz(true); //Starts off the trivia q's
      })
      .catch((error) => {
        console.error('Error fetching trivia questions:' , error);
      });
  };

  return (
    <div className="app">
      <h1>Welcome to our Trivia App</h1>
      {!showQuiz ? (
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
      ) : (
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
      )}
    </div>
  );
}

export default App;
