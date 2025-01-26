# QuizzBee

# Interactive Quiz Game with Power-Ups

## Project Overview

This is an engaging, feature-rich quiz game that offers an interactive learning experience across multiple subjects. Built with vanilla JavaScript, the game combines educational content with exciting gameplay mechanics.

## Key Features

### Dynamic Quiz Mechanics
- **Multiple Subject Selection**: Choose from various subjects including:
  - Science
  - Math
  - History
  - Geography
  - General Knowledge

- **Adaptive Difficulty**: 
  - Medium-level questions sourced from OpenTDB API
  - Randomly selected questions within chosen category
  - 10-question format for each quiz session

### Advanced Scoring System
- **Base Score Mechanism**:
  - Earn 10 points for each correct answer
  - Streak bonus of 5 points for every 3 consecutive correct answers
  - Potential booster unlock based on performance streaks

### Innovative Power-Up System
Three unique power-ups to enhance gameplay:

1. **Time Extension Power-Up**
   - Adds 15 seconds to quiz timer
   - Strategic use for challenging questions
   - Limited availability based on performance

2. **Fifty-Fifty Power-Up**
   - Eliminates two incorrect answer choices
   - Helps players make more informed decisions
   - Can be crucial in difficult questions

3. **Score Multiplier Power-Up**
   - Doubles points for a question
   - Adds strategic depth to score optimization
   - Requires careful timing and decision-making

### Time Management
- **Fixed Quiz Duration**: 5-minute (120 seconds) time limit
- **Real-time Timer Display**:
  - Shows remaining time in minutes:seconds format
  - Adds urgency and excitement to the quiz experience
- **Automatic Quiz Termination** when time expires

### Progress Tracking
- **Visual Progress Bar**
  - Shows current question progress
  - Dynamically updates as you move through the quiz
- **Current Score Display**
- **Subject and Question Counter**

### Persistent Performance Tracking
- Saves most recent score
- Tracks and stores available power-up boosters
- High scores can be viewed and compared

## Technical Implementation

### Core Technologies
- Vanilla JavaScript
- Local Storage API
- OpenTDB API for question sourcing

### API Integration
- Dynamically fetches questions based on selected subject
- Handles question decoding and formatting
- Supports multiple-choice question type

### User Interaction Flow
1. Subject Selection
2. Quiz Initialization
3. Question Progression
4. Power-Up Utilization
5. Score Tracking
6. Quiz Completion

## Technical Architecture
```
project-root/
│
├── ind.html        # Home/Subject Selection Page
├── game.html       # Main Quiz Interface
├── end.html        # Quiz Completion/Score Entry Page
├── highscores.html # High Scores Display
│
├── game.js         # Core Game Logic
├── end.js          # Score Submission
├── highscores.js   # High Scores Management
│
└── styles/         # CSS Files
    ├── app.css
    ├── game.css
    └── highscores.css
```


## Getting Started

### Prerequisites
- Modern web browser
- Internet connection (for API question fetching)

### Installation
1. Clone the repository
2. Open `ind.html` in a web browser
3. Select a subject and start quizzing!


## License
