import { useState, useEffect } from "react";
import './wordle.css';

const gameConfig = {
  attempts: 6,
  wordLength: 5,
  wordList: [],
};

let targetWord = "";
let currentAttempt = 0;
let currentPosition = 0;

async function fetchWordList() {
  try {
    const response = await fetch(
      "https://random-word-api.herokuapp.com/word?number=100"
    );
    const words = await response.json();
    gameConfig.wordList = words
      .map((word) => word.toUpperCase())
      .filter((word) => word.length === gameConfig.wordLength);

    if (gameConfig.wordList.length === 0) {
      console.warn("No 5-letter words found, using fallback list.");
      gameConfig.wordList = ["APPLE", "GRAPE", "MANGO", "PLUMB", "BERRY"];
    }
  } catch (error) {
    console.error("Error fetching words:", error);
    gameConfig.wordList = ["APPLE", "GRAPE", "MANGO", "PLUMB", "BERRY"];
  }

  targetWord = getRandomWord();
}

function getRandomWord() {
  return gameConfig.wordList[
    Math.floor(Math.random() * gameConfig.wordList.length)
  ];
}

function Wordle() {
  const [gridState, setGridState] = useState(Array.from({ length: gameConfig.attempts }, () =>
    Array(gameConfig.wordLength).fill("")
  ));
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWordList();

    // Check for theme in localStorage
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.add("dark-mode");
    }

    // Keydown event listener
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();

      // Handle letters
      if (/^[A-Z]$/.test(key)) {
        addLetterToGrid(key);
      }

      // Handle backspace
      if (key === "BACKSPACE") {
        removeLetterFromGrid();
      }

      // Handle enter
      if (key === "ENTER") {
        submitGuess();
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const addLetterToGrid = (letter) => {
    if (currentPosition < gameConfig.wordLength) {
      gridState[currentAttempt][currentPosition] = letter.toUpperCase();
      setGridState([...gridState]);
      currentPosition++;
    }
  };

  const removeLetterFromGrid = () => {
    if (currentPosition > 0) {
      currentPosition--;
      gridState[currentAttempt][currentPosition] = "";
      setGridState([...gridState]);
    }
  };

  const submitGuess = () => {
    const guess = gridState[currentAttempt].join("").toUpperCase();
    if (guess.length < gameConfig.wordLength) {
      setMessage("Word not complete.");
      return;
    }

    processGuess(guess);
    currentAttempt++;
    currentPosition = 0;
  };

  const processGuess = (guess) => {
    let feedback = evaluateWord(guess, targetWord);
    feedback.forEach((status, i) => {
      let cell = document.getElementById(`cell-${currentAttempt}-${i}`);
      if (cell) {
        cell.classList.add(status);
      }
    });
  
    if (guess === targetWord) {
      setMessage("🎉 You guessed the word!");
    } else if (currentAttempt === gameConfig.attempts - 1) {
      setMessage(`Game Over! The word was: ${targetWord}`);
    }
  };
  

  const evaluateWord = (guess, targetWord) => {
    let result = Array(gameConfig.wordLength).fill("incorrect");
    let targetLetters = targetWord.split("");

    guess.split("").forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        result[i] = "correct";
        targetLetters[i] = null;
      }
    });

    guess.split("").forEach((letter, i) => {
      if (result[i] === "incorrect" && targetLetters.includes(letter)) {
        result[i] = "misplaced";
        targetLetters[targetLetters.indexOf(letter)] = null;
      }
    });

    return result;
  };

  const toggleTheme = () => {
    const toggleButton = document.getElementById("mode-toggle");
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("light-mode")) {
      localStorage.setItem("theme", "light");
      toggleButton.textContent = "🌙"; // Moon icon for light mode
    } else {
      localStorage.setItem("theme", "dark");
      toggleButton.textContent = "🌞"; // Sun icon for dark mode
    }
  };

  return (
    <div className="game" id="game">
      <h1>Wordle</h1>
      <button id="mode-toggle" onClick={toggleTheme}>🌙</button>
      <div id="wordle-grid">
        {gridState.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((letter, colIndex) => (
              <div
                key={colIndex}
                id={`cell-${rowIndex}-${colIndex}`}
                className="letter"
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => addLetterToGrid("A")}>A</button>
        <button onClick={() => addLetterToGrid("B")}>B</button>
        <button onClick={() => addLetterToGrid("C")}>C</button>
        <button onClick={() => addLetterToGrid("D")}>D</button>
        <button onClick={() => addLetterToGrid("E")}>E</button>
        <button onClick={() => addLetterToGrid("F")}>F</button>
        <button onClick={() => addLetterToGrid("G")}>G</button>
        <button onClick={() => addLetterToGrid("H")}>H</button>
        <button onClick={() => addLetterToGrid("I")}>I</button>
        <button onClick={() => addLetterToGrid("J")}>J</button>
        <button onClick={() => addLetterToGrid("K")}>K</button>
        <button onClick={() => addLetterToGrid("L")}>L</button>
        <button onClick={() => addLetterToGrid("M")}>M</button>
        <button onClick={() => addLetterToGrid("N")}>N</button>
        <button onClick={() => addLetterToGrid("O")}>O</button>
        <button onClick={() => addLetterToGrid("P")}>P</button>
        <button onClick={() => addLetterToGrid("Q")}>Q</button>
        <button onClick={() => addLetterToGrid("R")}>R</button>
        <button onClick={() => addLetterToGrid("S")}>S</button>
        <button onClick={() => addLetterToGrid("T")}>T</button>
        <button onClick={() => addLetterToGrid("U")}>U</button>
        <button onClick={() => addLetterToGrid("V")}>V</button>
        <button onClick={() => addLetterToGrid("W")}>W</button>
        <button onClick={() => addLetterToGrid("X")}>X</button>
        <button onClick={() => addLetterToGrid("Y")}>Y</button>
        <button onClick={() => addLetterToGrid("Z")}>Z</button>

        <button onClick={removeLetterFromGrid}>Backspace</button>
        <button onClick={submitGuess}>Enter</button>
      </div>
      {message && <div>{message}</div>}
    </div>
  );
}

export default Wordle;
