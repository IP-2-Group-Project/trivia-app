import { useState, useEffect } from 'react'
import './App.css'
import SetupForm from './components/SetupForm';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');

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

    // Fetch quiz data or navigate to quiz screen here
  };

  return (
    <div className="app">
      <h1>Welcome to our Trivia App</h1>
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
    </div>
  );
}

export default App;
