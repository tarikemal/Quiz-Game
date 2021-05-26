import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import selectionData from "./data.js";
import axios from "axios";
import { categoryOptions, typeOptions, difficultyOptions } from "./data";

function SelectOptions({
  category,
  setCategory,
  difficulty,
  setDifficulty,
  type,
  setType,
}) {
  return (
    <section className="options-section">
      <div className="select-container">
        <label>Category</label>
        <select
          className="select-container__select"
          name="categories"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categoryOptions.map((option) => {
            return <option key={option.id}>{option.name}</option>;
          })}
        </select>
      </div>

      <div className="select-container">
        <label>Difficulty</label>
        <select
          className="select-container__select"
          name="difficulties"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {difficultyOptions.map((option) => {
            return <option key={option.id}>{option.name}</option>;
          })}
        </select>
      </div>

      <div className="select-container">
        <label>Type</label>
        <select
          className="select-container__select"
          name="types"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {typeOptions.map((option) => {
            return <option key={option.id}>{option.name}</option>;
          })}
        </select>
      </div>
    </section>
  );
}

function Points({ correct, wrong }) {
  return (
    <section className="points-section">
      <div className="points-section__wrong">
        {wrong}
        <br></br> wrong
      </div>
      <div className="points-section__correct">
        {correct}
        <br></br> correct
      </div>
    </section>
  );
}

function Question({
  questionData,
  fetchQuestion,
  category,
  difficulty,
  type,
  correct,
  wrong,
  setCorrect,
  setWrong,
  loading,
  setLoading,
}) {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    console.log(questionData);
    setQuestion(questionData.question);
    setCorrectAnswer(questionData.correct_answer);

    setLoading(false);
  }, [questionData]);

  const answers = [...questionData.incorrect_answers, correctAnswer];
  const shuffledAnswers = answers.sort((a, b) => 0.5 - Math.random());

  const handleClick = (answer, category, difficulty, type) => {
    setLoading(true);
    fetchQuestion(category, difficulty, type);
    if (answer === correctAnswer) setCorrect((correct) => correct + 1);
    else setWrong((wrong) => wrong + 1);
  };

  return (
    <section className="question-section">
      {loading ? (
        <div></div>
      ) : (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: question }} />
          <div className="question-section__answers">
            {shuffledAnswers.map((answer, index) => {
              return (
                <button
                  dangerouslySetInnerHTML={{ __html: answer }}
                  className="question-section__answer"
                  onClick={(e) =>
                    handleClick(answer, category, difficulty, type)
                  }
                />
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

function App() {
  const [category, setCategory] = useState("Any Category");
  const [difficulty, setDifficulty] = useState("Any Difficulty");
  const [type, setType] = useState("Any Type");

  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const [questionData, setQuestionData] = useState({});

  const [loading, setLoading] = useState(false);

  const fetchQuestion = async (category, difficulty, type) => {
    const selectedCategory = categoryOptions.find(
      (option) => option.name === category
    );
    const selectedDifficulty = difficultyOptions.find(
      (option) => option.name === difficulty
    );

    const selectedType = typeOptions.find((option) => option.name === type);

    let url = "https://opentdb.com/api.php?amount=1";

    if (selectedCategory.id !== "any") url += `&category=${c.id}`;
    if (selectedDifficulty.id !== "any") url += `&difficulty=${d.id}`;
    if (selectedType.id !== "any") url += `&type=${t.id}`;

    const response = await axios.get(url);
    const data = await response.data.results[0];

    setQuestionData(data);
  };

  useEffect(() => {
    setLoading(true);
    fetchQuestion(category, difficulty, type);
  }, [category, difficulty, type]);

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <SelectOptions
            category={category}
            setCategory={setCategory}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            type={type}
            setType={setType}
          />

          <Points correct={correct} wrong={wrong} />
        </div>

        <Question
          questionData={questionData}
          fetchQuestion={fetchQuestion}
          category={category}
          difficulty={difficulty}
          type={type}
          correct={correct}
          wrong={wrong}
          setCorrect={setCorrect}
          setWrong={setWrong}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}

export default App;
