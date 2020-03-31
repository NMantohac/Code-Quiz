// Targets DOM elements
const $startScreen = $("#start-screen");
const $startScreenTitle = $("#quiz-title");
const $startBtn = $("#start-button");
const $timer = $("#timer")
const $timeCount = $("#time");

const $questionScreen = $("#question-screen");
const $questionCard = $("#question-card");

const $endScreen = $("#end-screen");
const $endCard = $("#end-screen-card");

const $highscoresBtn = $("#view-highscores-button");
const $highscoresScreen = $("#highscores-screen");
const $highscoresBody = $("#highscores-screen-body");
const $goBackBtn = $("#go-back-button");
const $clearBtn = $("#clear-button");

// Set time
let totalTime = 120;
let quizTime = 0;

// Set score
let correct = 0;
let wrong = 0;

function quizGame() {

    // Initialized web browser for main buttons with onclick events
    function initialize() {
        $(document).ready(function() {
            $startBtn.on("click", startQuiz);
            $highscoresBtn.on("click", viewRankings);
            $goBackBtn.on("click", goBackStart);
            $clearBtn.on("click", clearScores);
    });
    };

    // Starts Quiz
    function startQuiz() {
        $startScreenTitle.hide();
        $startScreen.hide();
        $timer.show();
        $questionScreen.show();

        showQuestions();

        $timeCount.text(totalTime);
        timerInterval();
    };

    // Displays each question/choices
    function showQuestions() {
        const question = questions.shift();
        const questionTitle = $(`<div class="card-header">
                                    <h2>${question.title}</h2>
                                </div>`)
        
        const choicesList = $(`<div class="card-body" id="question-choices>
                               <ul class="list-group">
                               </ul>
                               </div>`);
        
        choicesList.on("click", (event) => {manageAnswerClick(event, question.answer)});
        
        question["choices"].forEach(choice => {
            choicesList.append(`<button type="button" class="button-choices btn btn-secondary">${choice}</button>
                                <br>`);       
        });

        $questionCard.prepend(questionTitle);
        $questionCard.append(choicesList);
    };

    // Right vs Wrong button-choice for each question
    function manageAnswerClick(event, answer) {
        event.preventDefault();

        if ($(event.target).html() === answer) {
            event.target.style.backgroundColor = '#164032';
            correct++;
            setTimeout(function() {
                $questionCard.empty();
                if (questions.length !== 0) {
                    showQuestions();
                }
                else {
                    quizTime = totalTime;
                    endQuiz();
                    $timeCount.text(totalTime);
                    totalTime = 0;
                }
            }, 500);
        }
        else {
            event.target.style.borderColor = '#e53935';
            event.target.style.backgroundColor = '#661917';
            wrong++;
            setTimeout(function() {
            totalTime -= 20;
            if (totalTime <= 0) {
                totalTime = 0;
            }
            $questionCard.empty();
            showQuestions();
            }, 500);
        }
    };

    // Timer 
    function timerInterval() {
        if (totalTime === 0) {
            endQuiz();
            $timeCount.text(totalTime);
        }
        else if (totalTime > 0) {
            $timeCount.text(totalTime--);
            setTimeout(timerInterval, 1000);
        }
    };

    // End Quiz
    function endQuiz() {
        showEndScore();
        const $submitBtn = $("#end-screen-submit");
        $submitBtn.on("click", manageInputSubmit);
    };

    // Displays Game Over screen with Scores
    function showEndScore() {
        $questionScreen.hide();
        $timer.hide();
        $endScreen.show();
        
        var endScoreCard = $endCard.html(
            `<div class="card-header" id="end-screen-header">
                <h2 id="end-screen-title">Game Over!</h2>
             </div>

             <div class="card-body" id="end-screen-body">
               <h3 id="final-score">Final Score: ${quizTime}</h3>
               <p>Correct Answers: ${correct}</p>
               <p>Wrong Answers: ${wrong}</p>
               <p>Overall Percent: ${((correct / "10") * 100).toFixed(0)}%</p>  

               Enter Username/Initials:
               <div class="input-group mb-3">
                 <input type="text" class="form-control player" id="end-screen-input" placeholder="Username/Initials" aria-label="Recipient's username" aria-describedby="basic-addon2">
                 <div class="input-group-append">
                   <button class="btn btn-dark" id="end-screen-submit" type="button">Submit</button>
                 </div>
               </div>
             </div>`);
        
        $endCard.prepend(endScoreCard);
    }

    // Submit Form Event
    function manageInputSubmit(event) {
        event.preventDefault();

        $endScreen.hide();
        $highscoresBtn.show();
        $highscoresScreen.show();
        
        const playerName = $(".player").val();
        const player = {
            name: playerName,
            score: quizTime
        }
        
        localStorageSave(player);
        showRankings(player);        
    };

    // Displays Rankings
    function showRankings(currentPlayer = {}) {
        const playersArr = JSON.parse(localStorage.getItem("playersArr"));
        
        const playerList = $('<ul class="list-group list-group-flush"></ul>');

        if (playersArr !== null) {
            sortArray(playersArr);
            playersArr.forEach((player, index) => {
                if (currentPlayer.name === player.name && currentPlayer !== {}) {
                    playerList.append(`<li class="list-group-item font-weight-bold mt-1">${index + 1}. ${player.name} <span class="player-score">${player.score}</span></li>`);
                }
                else {
                    playerList.append(`<li class="list-group-item mt-1">${index + 1}. ${player.name} <span class="player-score">${player.score}</span></li>`);
                }
            });
        }

        $highscoresBody.prepend(playerList);

    };

    // Displays Rankings from View Highscores Button
    function viewRankings() {
            $startScreenTitle.hide();
            $startScreen.hide();
            $questionScreen.hide()
            $endScreen.hide();
            $timer.hide();
            $highscoresBody.empty();
            $highscoresScreen.show();
            showRankings();
    };

    // Prioritizes Higher Scores in Leaderboard
    function sortArray(arr) {
        arr.sort((a,b) => {
            const scoreA = a.score;
            const scoreB = b.score;
            if (scoreA < scoreB) {
                return 1
            }
            else if (scoreA > scoreB) {
                return -1
            }
            else {
                return 0
            }
        });
    };

    // Local Storage Save
    function localStorageSave(player) {
        if (localStorage.getItem("playersArr") === null) {
            const playersArr = [];
            playersArr.push(player);
            localStorage.setItem("playersArr", JSON.stringify(playersArr));
        }
        else {
            const playersArr = JSON.parse(localStorage.getItem("playersArr"));
            playersArr.push(player);
            localStorage.setItem("playersArr", JSON.stringify(playersArr));
        }
    };

    // Go Back Button
    function goBackStart() {
        window.location.href = "./index.html";
    };

    // Clear Highscores Button
    function clearScores() {
        localStorage.clear();
        $highscoresBody.empty();
    };
    
    initialize();
};

quizGame();

// Background Images
const imagesArr = [
    "./assets/images/Background-Bloodborne.jpg",
    "./assets/images/Background-Call-of-Duty-MW2.jpg",
    "./assets/images/Background-Crash-Bandicoot.jpg",
    "./assets/images/Background-Dark-Souls-3.jpg",
    "./assets/images/Background-Doom.jpg",
    "./assets/images/Background-Final-Fantasy-XV.png",
    "./assets/images/Background-Halo-3.jpg",
    "./assets/images/Background-Horizon-Zero-Dawn.jpg",
    "./assets/images/Background-Mortal-Kombat.jpg",
    "./assets/images/Background-Persona-5.jpg",
    "./assets/images/Background-Shadow-of-the-Colossus.jpg",
    "./assets/images/Background-Sonic-Generations.jpg",
    "./assets/images/Background-Tekken-7.png",
    "./assets/images/Background-Tomb-Raider.jpg",
    "./assets/images/Background-Undertale.jpg"
];

const $wrapper = $(".wrapper")
let nextImage = 0;
doSlideShow();

// Continuous transition between images
function doSlideShow() {
    if (nextImage >= imagesArr.length) {
        nextImage = 0;
    }
    $wrapper.css("background-image", 'url("'+imagesArr[nextImage++]+'")')
    setTimeout(doSlideShow, 8000);
};
