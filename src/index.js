import React, { useEffect, useState } from "react";
import { render } from "react-dom";

const Header = (props) => (
  <div className="header">
    <h1>
      {props.category} <p>Quiz App</p>
    </h1>
    <div className="score">
      <h4>Correct: {props.correct}</h4>
      <h4>Incorrect: {props.incorrect}</h4>
    </div>
  </div>
);

const Body = (props) => (
  <div className="body">
    <h2>{props.question}</h2>
    <ul>
      {props.answers.map((answer, i) => {
        return (
          <button
            key={i}
            onClick={props.handleVerifyAnswer}
            disabled={props.isCorrect !== null}
          >
            {answer}
          </button>
        );
      })}
    </ul>
  </div>
);

const ResultFrame = (props) => {
  let result;
  switch (props.isCorrect) {
    case true:
      result = (
        <div className="correct anime">
          <h3>Nice, Keep Going!</h3>
          <button onClick={props.handleNext}>Next</button>
        </div>
      );
      break;
    case false:
      result = (
        <div className="incorrect anime">
          <h3>Oh NO!!</h3>
          <button onClick={props.handleNext}>Next</button>
        </div>
      );
      break;
    default:
      result = <div />;
  }
  return result;
};
function App() {
  const [state, setState] = useState({
    question: "",
    answers: [],
    correctAnswer: "",
    isCorrect: null,
    correct: 0,
    incorrect: 0,
    category: ""
  });

  useEffect(() => loadData(), []);

  const loadData = () => {
    fetch("https://opentdb.com/api.php?amount=1")
      .then((res) => res.json())
      .then((data) => {
        setState({
          answers: answersPrepare(
            data.results[0].correct_answer,
            data.results[0].incorrect_answers
          ),
          question: data.results[0].question,
          category: data.results[0].category,
          correctAnswer: data.results[0].correct_answer
        });
      });
  };

  const answersPrepare = (corrAnswer, incorrAnswer) => {
    return incorrAnswer.concat(corrAnswer).sort();
  };

  const handleVerifyAnswer = (e) => {
    if (e.target.value === state.correctAnswer) {
      setState((prevState) => ({
        correct: { ...(prevState.correct + 1) },
        isCorrect: true
      }));
    } else {
      setState((prevState) => ({
        incorrect: { ...(prevState.incorrect + 1) },
        isCorrect: false
      }));
    }
  };

  const handleNext = () => {
    loadData();
    setState({ isCorrect: null });
  };

  return (
    <div>
      <Header
        category={state.category}
        correct={state.correct}
        incorrect={state.incorrect}
      />
      <Body
        answers={state.answers}
        question={state.question}
        handleVerifyAnswer={handleVerifyAnswer}
        isCorrect={state.isCorrect}
      />
      <ResultFrame isCorrect={state.isCorrect} handleNext={handleNext} />
    </div>
  );
}

render(<App />, document.getElementById("root"));
