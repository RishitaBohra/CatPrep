import { useState, useEffect } from 'react';

const QUOTES = [
  "The CAT is not a test of intelligence — it's a test of preparation. Prepare like it's the only thing that matters.",
  "Every RC passage you read today is one less mystery on exam day. Read more.",
  "Speed without accuracy is noise. Accuracy without speed is irrelevant. Master both.",
  "You don't rise to the level of your goals — you fall to the level of your systems. Build the system.",
  "One more DILR set a day for 90 days. That's the difference between clearing cutoff and missing it.",
  "CAT rewards the consistent, not the brilliant. Show up every single day.",
  "Percentile is relative. Your improvement is absolute. Focus on what you can control.",
  "The student who does 5 mocks and reviews them deeply beats the one who does 20 mocks carelessly.",
  "Your accuracy in QA comes from revisiting the same concept 7 times, not 7 new topics.",
  "Verbal ability is a long game. Start reading quality content today — the dividends compound.",
  "When you feel like quitting, remember why you started. IIM A, B, C — they don't hire quitters.",
  "Mock percentile fluctuates. Fundamentals don't. Strengthen your fundamentals.",
  "The ones who crack CAT don't have more hours in the day — they waste fewer of them.",
  "An honest error log is worth more than 10 additional practice sets.",
  "Slot 1 or Slot 2 doesn't matter. Your 60 days before CAT matter.",
  "A 99 percentile wasn't built in a day. It was built in 300 days of deliberate practice.",
  "Don't count the days you study — make the days you study count.",
  "Every aspirant at 90th percentile was once at 70th. The gap is filled with deliberate effort.",
  "Attempt the questions you're sure of first. Confidence compounds within a mock.",
  "CAT tests how well you manage time, eliminate options, and stay calm. Practice all three.",
  "The best time to start preparing was 6 months ago. The second best time is today.",
  "Your competition isn't the IIM aspirant next door — it's yesterday's version of you.",
  "Three hours of focused prep beats eight hours of distracted studying every time.",
  "Fear of attempting is more costly than a wrong answer. Attempt more.",
  "Vocabulary is built word by word. Read one editorial a day, every day, without exception.",
];

function getDailyIndex() {
  const day = Math.floor(Date.now() / 86400000);
  return day % QUOTES.length;
}

export default function QuoteFlashcard() {
  const [index, setIndex] = useState(getDailyIndex());
  const [flipping, setFlipping] = useState(false);

  function goTo(next) {
    setFlipping(true);
    setTimeout(() => {
      setIndex((next + QUOTES.length) % QUOTES.length);
      setFlipping(false);
    }, 180);
  }

  function handleClick() {
    goTo(index + 1);
  }

  function handleKey(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') goTo(index + 1);
    if (e.key === 'ArrowLeft') goTo(index - 1);
  }

  return (
    <div
      className="flashcard"
      onClick={handleClick}
      onKeyDown={handleKey}
      tabIndex={0}
      role="button"
      aria-label="Daily motivation flashcard — click for next quote"
    >
      <div className="flashcard-label">Daily Motivation</div>

      <div className={`flashcard-quote${flipping ? ' flipping' : ''}`}>
        "{QUOTES[index]}"
      </div>

      <div className="flashcard-footer">
        <span className="flashcard-hint">Click or press → for next quote</span>
        <div className="flashcard-dots">
          {Array.from({ length: Math.min(QUOTES.length, 8) }, (_, i) => {
            const bucketSize = Math.ceil(QUOTES.length / 8);
            const isActive = Math.floor(index / bucketSize) === i;
            return (
              <button
                key={i}
                className={`flashcard-dot${isActive ? ' active' : ''}`}
                onClick={(e) => { e.stopPropagation(); goTo(i * bucketSize); }}
                aria-label={`Go to quote group ${i + 1}`}
                style={{ border: 'none', cursor: 'pointer', padding: 0 }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
