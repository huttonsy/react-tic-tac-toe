import React, { useState, useEffect } from "react";
import "../hangman/Hangman.css";

const Hangman = () => {
const [word, setWord] = useState("");
const [guessed, setGuessed] = useState([]);
const [wrong, setWrong] = useState(0);
const [currentLetter, setCurrentLetter] = useState("");
const maxWrong = 6;

const fetchNewWord = () => {
    fetch("https://it3049c-hangman.fly.dev/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setWord(data[0].toLowerCase());
        } else if (typeof data === "object" && data.word) {
          setWord(data.word.toLowerCase());
        } else {
          console.warn("Unexpected API response format:", data);
          setWord("fallback");
        }
        setGuessed([]);
        setWrong(0);
        setCurrentLetter("");
      })
      .catch((error) => {
        console.error("Error fetching word:", error);
        setWord("fallback");
      });
  };

useEffect(() => {
fetchNewWord();
}, []);

console.log("Current word:", word);

const displayWord = word
.split("")
.map((letter) => (guessed.includes(letter) ? letter : "_"))
.join(" ");

const handleKeyPress = (e) => {
if (e.key === "Enter" && /^[a-zA-Z]$/.test(currentLetter)) {
const letter = currentLetter.toLowerCase();
if (!guessed.includes(letter)) {
setGuessed([...guessed, letter]);
if (!word.includes(letter)) {
setWrong(wrong + 1);
}
}
setCurrentLetter("");
}
};

const isLost = wrong >= maxWrong;
const isWon = word && word.split("").every((l) => guessed.includes(l));

if (!word) return <p className="text-center mt-10">Loading word...</p>;

const HangmanAnimation = ({ wrong }) => {
    const parts = [
    <circle key="head" cx="150" cy="70" r="20" stroke="black" strokeWidth="3" fill="none" />, // Head
    <line key="body" x1="150" y1="90" x2="150" y2="140" stroke="black" strokeWidth="3" />, // Body
    <line key="left-arm" x1="150" y1="100" x2="130" y2="120" stroke="black" strokeWidth="3" />, // Left Arm
    <line key="right-arm" x1="150" y1="100" x2="170" y2="120" stroke="black" strokeWidth="3" />, // Right Arm
    <line key="left-leg" x1="150" y1="140" x2="130" y2="170" stroke="black" strokeWidth="3" />, // Left Leg
    <line key="right-leg" x1="150" y1="140" x2="170" y2="170" stroke="black" strokeWidth="3" />, // Right Leg
    ];
    
    return (
    <svg width="200" height="200" className="hangman-svg">
    <line x1="50" y1="180" x2="150" y2="180" stroke="black" strokeWidth="3" /> {/* Base */}
    <line x1="100" y1="180" x2="100" y2="20" stroke="black" strokeWidth="3" /> {/* Pole */}
    <line x1="100" y1="20" x2="150" y2="20" stroke="black" strokeWidth="3" /> {/* Top Bar */}
    <line x1="150" y1="20" x2="150" y2="50" stroke="black" strokeWidth="3" /> {/* Rope */}
    {parts.slice(0, wrong)} {/* Display parts based on wrong guesses */}
    </svg>
    );
    };
    
return (
<div className="hangman-wrapper">
<h1 className="hangman-title">Hangman</h1>

<div className="hangman-container">
<div className="hangman-box">
<HangmanAnimation wrong={wrong} />
</div>

<div className="hangman-game">
<p className="hangman-label">Guess the word:</p>
<p className="hangman-word">{displayWord}</p>

{!isLost && !isWon && (
<input
type="text"
maxLength="1"
value={currentLetter}
onChange={(e) => setCurrentLetter(e.target.value)}
onKeyDown={handleKeyPress}
className="hangman-input"
placeholder="Enter a letter"
/>
)}

<p className="hangman-wrong">
Wrong guesses: {wrong} / {maxWrong}
</p>

{guessed.length > 0 && (
<div className="hangman-guessed">
<p>Guessed letters:</p>
<p>{guessed.join(", ")}</p>
</div>
)}

{isLost && (
<p className="hangman-result lost">
You lost! The word was: <strong>{word}</strong>
</p>
)}

{isWon && (
<p className="hangman-result won">You won!</p>
)}

<button onClick={fetchNewWord} className="btn btn-secondary">
New Game
</button>
</div>
</div>
</div>
);
};

export default Hangman;