const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Sort high scores in descending order
const sortedHighScores = highScores.sort((a, b) => b.score - a.score);

// Render high scores with rank
highScoresList.innerHTML = sortedHighScores
  .map((score, index) => {
    return `
      <tr class="high-score">
        <td>${index + 1}</td>
        <td>${score.name}</td>
        <td>${score.score}</td>
      </tr>
    `;
  })
  .join("");