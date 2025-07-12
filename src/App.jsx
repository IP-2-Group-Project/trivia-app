import { useState, useEffect } from 'react';
import './App.css';
import SetupForm from './components/SetupForm';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then((response) => response.json())
      .then((data) => setCategories(data.trivia_categories))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const current = questions[currentQuestionIndex];
      const allAnswers = [...current.incorrect_answers, current.correct_answer];
      const shuffled = allAnswers.sort(() => Math.random() - 0.5);
      setShuffledAnswers(shuffled);
    }
  }, [currentQuestionIndex, questions]);

  const handleStartQuiz = () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    const url = `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results);
        setCurrentQuestionIndex(0);
        setShowQuiz(true);
      })
      .catch((error) => {
        console.error('Error fetching trivia questions:', error);
      });
  };

  return (
    <div className="app">
      {!showQuiz && <h1 className="title">Welcome to The Debugger's Trivia App</h1>}

      {!showQuiz ? (
        <>
          <SetupForm
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
          />
          <button onClick={handleStartQuiz} disabled={!selectedCategory} className="start-quiz-button">
            Start Quiz
          </button>
        </>
      ) : (
        <>
          {questions.length > 0 ? (
            <div className="question-container">
              <h2 dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex].question }} />
              <p>Score: {score}</p>
              <ul>
                {shuffledAnswers.map((answer, index) => (
                  <div key={index}>
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
                        if (!submitted) {
                          setSelectedAnswer(answer);
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: answer }}
                    ></button>
                    <br />
                    <br />
                  </div>
                ))}
              </ul>
              {!submitted && (
                <button
                  className="submit-button"
                  onClick={() => {
                    if (!selectedAnswer) {
                      alert('Please select an answer');
                      return;
                    }
                    setSubmitted(true);
                    const correct = questions[currentQuestionIndex].correct_answer;
                    if (selectedAnswer === correct) {
                      setScore((prevScore) => prevScore + 1);
                    }
                    setIsAnswerCorrect(selectedAnswer === correct);
                  }}
                >
                  Submit
                </button>
              )}
              {submitted && (
                <button
                  className="next-question-button"
                  onClick={() => {
                    if (currentQuestionIndex + 1 < questions.length) {
                      setCurrentQuestionIndex((prev) => prev + 1);
                      setSelectedAnswer(null);
                      setSubmitted(false);
                      setIsAnswerCorrect(null);
                    } else {
                      alert('Quiz completed!');
                      setShowQuiz(false);
                    }
                  }}
                >
                  Next Question
                </button>
              )}
            </div>
          ) : (
            <p>...</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
