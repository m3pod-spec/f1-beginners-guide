(() => {
  const QUESTION_COUNT = 15;
  const SECONDS_PER_QUESTION = 7;

  const questions = [
    { category: "THE SPORT", q: "What does a Formula 1 Grand Prix winner receive?", a: ["A trophy and championship points", "A new car", "An automatic place in every race", "Double points for the whole season"], correct: 0 },
    { category: "THE CARS", q: "What is the main job of an F1 car's front and rear wings?", a: ["To make the car louder", "To create downforce", "To cool the driver", "To increase the fuel tank"], correct: 1 },
    { category: "THE GRID", q: "How many drivers does each F1 team normally enter in a Grand Prix?", a: ["One", "Three", "Two", "Four"], correct: 2 },
    { category: "RACE WEEKEND", q: "What is pole position?", a: ["The last place on the grid", "The first starting position", "The fastest pit stop", "The finish line"], correct: 1 },
    { category: "TYRES", q: "Which dry-weather tyre compound usually offers the most grip but wears faster?", a: ["Hard", "Medium", "Wet", "Soft"], correct: 3 },
    { category: "FLAGS", q: "What does a yellow flag warn drivers about?", a: ["A hazard or danger on track", "The end of the race", "A pit-lane speed record", "A new lap record"], correct: 0 },
    { category: "PIT STOPS", q: "Why do F1 drivers make pit stops during a race?", a: ["To change drivers", "To collect points", "To change tyres or make permitted repairs", "To take a shortcut"], correct: 2 },
    { category: "THE SPORT", q: "What is the Constructors' Championship based on?", a: ["The combined points scored by a team's drivers", "The team's car colour", "The number of pit stops", "The fastest single lap only"], correct: 0 },
    { category: "RACE WEEKEND", q: "What is the main purpose of practice sessions?", a: ["To decide the world champion", "To test the car and learn the circuit", "To award the race trophy", "To set the final race result"], correct: 1 },
    { category: "FLAGS", q: "What does the chequered flag signal?", a: ["A driver must pit", "Rain is coming", "The session or race has finished", "The Safety Car is leaving"], correct: 2 },
    { category: "THE RACE", q: "What happens during a Safety Car period?", a: ["Drivers must race at full speed", "The race is neutralised and drivers slow down", "The race is automatically cancelled", "All drivers change tyres"], correct: 1 },
    { category: "CIRCUITS", q: "What is a chicane?", a: ["A slow sequence of alternating corners", "A type of racing tyre", "The area where trophies are kept", "A driver's radio message"], correct: 0 },
    { category: "STRATEGY", q: "What is an undercut?", a: ["Pitting earlier than a rival to try to gain time on fresh tyres", "Taking the final corner slowly", "Starting from the pit lane", "Skipping a practice session"], correct: 0 },
    { category: "RACE WEEKEND", q: "What is the formation lap?", a: ["The lap drivers complete before the race start", "The final lap of the Grand Prix", "A lap used only during practice", "The lap after the chequered flag"], correct: 0 },
    { category: "THE SPORT", q: "How many points does a driver normally receive for finishing first in a Grand Prix?", a: ["10", "18", "20", "25"], correct: 3 },
    { category: "RACE WEEKEND", q: "What do drivers compete for in qualifying?", a: ["The fastest lap in the race", "Their starting position for the Grand Prix", "The Constructors' trophy", "A mandatory pit stop"], correct: 1 },
    { category: "THE CARS", q: "What does the halo help protect?", a: ["The engine", "The tyres", "The driver's head", "The rear wing"], correct: 2 },
    { category: "CIRCUITS", q: "What is a lap?", a: ["One complete trip around the circuit", "A tyre change", "A driver interview", "The time between two races"], correct: 0 },
    { category: "THE RACE", q: "What does it mean when a driver is lapped?", a: ["They have completed an extra lap", "The leader has passed them by a full lap", "They have won the race", "They have left the circuit"], correct: 1 },
    { category: "TYRES", q: "Which tyres are designed for a wet track?", a: ["Soft and hard", "Medium only", "Intermediate and full wet", "Qualifying tyres"], correct: 2 },
    { category: "THE GRID", q: "What is the paddock?", a: ["The area where teams and F1 personnel work", "The first corner", "The podium", "The track's gravel trap"], correct: 0 },
    { category: "STRATEGY", q: "Why might a team choose to pit during a Safety Car period?", a: ["The pit stop can cost less time compared with green-flag conditions", "Tyres cannot be changed under green flags", "The driver receives extra points", "The race must restart from the pit lane"], correct: 0 },
    { category: "FLAGS", q: "What does a red flag mean?", a: ["The session is suspended", "The race leader has won", "The track is clear", "A driver has set the fastest lap"], correct: 0 },
    { category: "THE SPORT", q: "What is a Sprint?", a: ["A shorter race held at selected Grand Prix weekends", "A special type of pit stop", "A new tyre compound", "A practice lap before qualifying"], correct: 0 },
    { category: "CIRCUITS", q: "Which famous street circuit hosts the Monaco Grand Prix?", a: ["Silverstone", "Circuit de Monaco", "Suzuka", "Monza"], correct: 1 },
    { category: "THE CARS", q: "What does downforce help an F1 car do?", a: ["Float over bumps", "Grip the track through corners", "Use less road width", "Turn off its engine"], correct: 1 },
    { category: "PIT STOPS", q: "Where must a driver go to make a normal pit stop?", a: ["The medical centre", "The podium", "The pit lane and their team's pit box", "The starting grid"], correct: 2 },
    { category: "THE GRID", q: "What is a reserve driver?", a: ["A driver who can stand in if a race driver cannot compete", "The driver who starts last", "The person who waves the chequered flag", "The team's chief mechanic"], correct: 0 },
    { category: "STRATEGY", q: "What is tyre degradation?", a: ["Tyres losing performance as they wear", "A tyre being painted a new colour", "A car changing its engine", "A driver missing a braking point"], correct: 0 },
    { category: "RACE WEEKEND", q: "What do Q1, Q2 and Q3 refer to?", a: ["Three parts of qualifying", "Three tyre compounds", "Three championship trophies", "Three Safety Car periods"], correct: 0 },
    { category: "THE RACE", q: "What is the pit wall?", a: ["The barrier around the circuit", "The place where team strategists and engineers monitor the race", "The wall behind the podium", "The driver's garage door"], correct: 1 },
    { category: "FLAGS", q: "What does a blue flag usually warn a lapped driver about?", a: ["A faster car is approaching", "The race is over", "The track is wet", "The pit lane is closed"], correct: 0 },
    { category: "CIRCUITS", q: "Which circuit is famous for the Eau Rouge–Raidillon section?", a: ["Monza", "Spa-Francorchamps", "Marina Bay", "Zandvoort"], correct: 1 },
    { category: "THE SPORT", q: "What is a Grand Prix?", a: ["A Formula 1 race event", "A type of steering wheel", "A tyre temperature", "A team radio channel"], correct: 0 },
    { category: "THE CARS", q: "What is the cockpit?", a: ["The driver's seating area in the car", "The team's hospitality room", "The pit lane entrance", "The engine cover"], correct: 0 },
    { category: "STRATEGY", q: "What is a one-stop strategy?", a: ["A race plan involving one pit stop", "A race with one lap", "A qualifying session with one driver", "A stop at the finish line"], correct: 0 },
    { category: "TYRES", q: "What is a tyre warm-up lap for?", a: ["Bringing the tyres towards a useful operating temperature", "Cooling the brakes completely", "Testing the radio", "Measuring the fuel tank"], correct: 0 },
    { category: "THE GRID", q: "What does a team principal do?", a: ["Leads and oversees the F1 team", "Drives the Safety Car every race", "Designs every circuit", "Awards championship points"], correct: 0 },
    { category: "THE RACE", q: "What is an overtake?", a: ["One driver passing another on track", "A driver entering the garage", "A car completing a pit stop", "A driver setting off for the formation lap"], correct: 0 },
    { category: "CIRCUITS", q: "What is a street circuit?", a: ["A track built using roads normally open to the public", "A circuit used only for testing", "A track inside a stadium", "A circuit with no corners"], correct: 0 }
  ];

  const el = (id) => document.getElementById(id);
  const startScreen = el("start-screen");
  const questionScreen = el("question-screen");
  const resultScreen = el("result-screen");
  const nicknameInput = el("nickname");
  const answerOptions = el("answer-options");
  let playerName = "";
  let selectedQuestions = [];
  let questionIndex = 0;
  let score = 0;
  let timeLeft = SECONDS_PER_QUESTION;
  let timerInterval = null;
  let answerLocked = false;
  let finished = false;
  let playerEntryId = null;
  let supabaseClient = null;

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function setScreen(screen) {
    startScreen.hidden = screen !== "start";
    questionScreen.hidden = screen !== "question";
    resultScreen.hidden = screen !== "result";
  }

  function connectSupabase() {
    const config = window.QUALIFYING_SUPABASE || {};
    if (!config.url || !config.anonKey || !window.supabase || !window.supabase.createClient) return null;
    try {
      return window.supabase.createClient(config.url, config.anonKey);
    } catch (error) {
      console.warn("Supabase could not be initialised.", error);
      return null;
    }
  }

  function startGame() {
    const cleanName = nicknameInput.value.trim().replace(/\s+/g, " ");
    if (cleanName.length < 2 || cleanName.length > 16) {
      el("name-error").textContent = "enter a nickname between 2 and 16 characters.";
      nicknameInput.focus();
      return;
    }
    playerName = cleanName;
    el("name-error").textContent = "";
    el("player-name").textContent = playerName;
    supabaseClient = connectSupabase();
    selectedQuestions = shuffle(questions).slice(0, QUESTION_COUNT);
    questionIndex = 0;
    score = 0;
    finished = false;
    setScreen("question");
    showQuestion();
  }

  function showQuestion() {
    clearInterval(timerInterval);
    answerLocked = false;
    timeLeft = SECONDS_PER_QUESTION;
    const question = selectedQuestions[questionIndex];
    el("question-count").textContent = "QUESTION " + String(questionIndex + 1).padStart(2, "0") + " / " + QUESTION_COUNT;
    el("question-category").textContent = question.category;
    el("progress-fill").style.width = ((questionIndex / QUESTION_COUNT) * 100) + "%";
    el("timer-number").textContent = String(timeLeft);
    el("timer-fill").style.width = "100%";
    el("timer-fill").classList.remove("urgent");
    el("question-text").textContent = question.q;
    el("answer-feedback").textContent = "";
    el("current-score").textContent = String(score);
    answerOptions.replaceChildren();

    question.a.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-option";
      const letter = document.createElement("span");
      letter.className = "answer-letter";
      letter.textContent = String.fromCharCode(65 + index);
      const label = document.createElement("span");
      label.textContent = answer;
      button.append(letter, label);
      button.addEventListener("click", () => chooseAnswer(index, false));
      answerOptions.append(button);
    });
    timerInterval = window.setInterval(tick, 1000);
  }

  function tick() {
    if (answerLocked || finished) return;
    timeLeft -= 1;
    el("timer-number").textContent = String(Math.max(0, timeLeft));
    el("timer-fill").style.width = ((timeLeft / SECONDS_PER_QUESTION) * 100) + "%";
    if (timeLeft <= 3) el("timer-fill").classList.add("urgent");
    if (timeLeft <= 0) chooseAnswer(-1, true);
  }

  function chooseAnswer(choice, timedOut) {
    if (answerLocked || finished) return;
    answerLocked = true;
    clearInterval(timerInterval);
    const question = selectedQuestions[questionIndex];
    const correct = choice === question.correct;
    const buttons = Array.from(answerOptions.querySelectorAll("button"));
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === question.correct) button.classList.add("correct");
      if (index === choice && !correct) button.classList.add("wrong");
    });
    if (correct) {
      score += 1;
      el("current-score").textContent = String(score);
      el("answer-feedback").textContent = "CORRECT. NICE ONE.";
    } else if (timedOut) {
      el("answer-feedback").textContent = "TIME'S UP. ANSWER: " + question.a[question.correct].toUpperCase();
    } else {
      el("answer-feedback").textContent = "NOT QUITE. ANSWER: " + question.a[question.correct].toUpperCase();
    }
    window.setTimeout(() => {
      questionIndex += 1;
      if (questionIndex >= QUESTION_COUNT) finishGame();
      else showQuestion();
    }, 850);
  }

  async function fetchAllScores() {
    const all = [];
    const pageSize = 500;
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabaseClient
        .from("qualifying_scores")
        .select("id, nickname, score, created_at")
        .order("score", { ascending: false })
        .order("created_at", { ascending: true })
        .range(from, from + pageSize - 1);
      if (error) throw error;
      all.push(...(data || []));
      if (!data || data.length < pageSize) break;
    }
    return all;
  }

  async function showLeaderboard() {
    if (!supabaseClient) return;
    try {
      const { data: inserted, error: insertError } = await supabaseClient
        .from("qualifying_scores")
        .insert({ nickname: playerName, score: score })
        .select("id")
        .single();
      if (insertError) throw insertError;
      playerEntryId = inserted.id;

      const entries = await fetchAllScores();
      const body = el("leaderboard-body");
      body.replaceChildren();
      let playerRank = null;
      let previousScore = null;
      let currentRank = 0;

      entries.forEach((entry, index) => {
        if (entry.score !== previousScore) currentRank = index + 1;
        previousScore = entry.score;
        if (entry.id === playerEntryId) playerRank = currentRank;

        const row = document.createElement("tr");
        if (entry.id === playerEntryId) row.className = "current-player";
        const rankCell = document.createElement("td");
        rankCell.textContent = String(currentRank).padStart(2, "0");
        const nameCell = document.createElement("td");
        nameCell.textContent = entry.nickname;
        const scoreCell = document.createElement("td");
        scoreCell.textContent = entry.score + " / 15";
        row.append(rankCell, nameCell, scoreCell);
        body.append(row);
      });

      el("leaderboard-position").textContent = playerRank
        ? "YOU'RE P" + playerRank + " ON THE ALL-TIME GRID."
        : "YOUR SCORE IS ON THE ALL-TIME GRID.";
      el("leaderboard-section").hidden = false;
    } catch (error) {
      console.error("Global leaderboard unavailable.", error);
      el("leaderboard-section").hidden = true;
      el("leaderboard-unavailable").textContent = "The global leaderboard could not load right now, so it has been left off this result. Your score was not confirmed on the all-time grid.";
      el("leaderboard-unavailable").hidden = false;
    }
  }

  async function finishGame() {
    finished = true;
    clearInterval(timerInterval);
    setScreen("result");
    el("final-score").textContent = String(score);
    el("result-message").textContent = score === 15
      ? "PERFECT SESSION. THAT'S A P1 PERFORMANCE."
      : score >= 11
        ? "FRONT-ROW FORM. YOU KNOW YOUR F1."
        : score >= 7
          ? "SOLID DRIVE. THERE'S MORE TO LEARN OUT THERE."
          : "THE GRID IS WAITING. EVERY SESSION IS A FRESH START.";
    await showLeaderboard();
  }

  el("start-button").addEventListener("click", startGame);
  nicknameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") startGame();
  });
  nicknameInput.addEventListener("input", () => {
    el("name-error").textContent = "";
  });

  if (questions.length !== 40) {
    console.error("Qualifying question bank should contain 40 questions; found " + questions.length);
  }
})();