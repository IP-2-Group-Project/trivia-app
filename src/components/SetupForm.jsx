import React from "react";

function SetupForm({ categories, selectedCategory, onCategorySelect, difficulty, onDifficultyChange }) {
  return (
    <div className="setup-form">
      <h3>Let's choose!</h3>

      {/* Category Picker */}
      <div>
        <label>Category:</label><br />
        <select value={selectedCategory || ''} onChange={(e) => onCategorySelect(e.target.value)}>
          <option value="">--Choose a Category--</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Difficulty Picker */}
      <div style={{ marginTop: '1rem' }}>
        <label>Difficulty Levels:</label><br />
        <select value={difficulty} onChange={(e) => onDifficultyChange(e.target.value)}>
          <option value="">--Choose a Difficulty--</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  );
}

export default SetupForm;
