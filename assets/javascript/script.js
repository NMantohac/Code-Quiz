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

 // Set Time
 let totalTime = 120;
 let gameTime = 0;

 // Set Scores
 let correct = 0;
 let wrong = 0;

function quizGame() {

    function initialize() {
        $(document).ready(function() {
            $startBtn.on("click", startQuiz);
            $highscoresBtn.on("click", checkRankingSubmit);
            $goBackBtn.on("click", goBackStart);
            $clearBtn.on("click", clearScore);
    });
    };

    function startQuiz() {
        $startScreenTitle.hide();
        $startScreen.hide();
        $timer.show();
        $questionScreen.show();

        displayQuestion();

        $timeCount.text(totalTime);
        stopWatch();
    };

    function displayQuestion() {
        const question = questions.shift();
        const questionTitle = $(`<div class="card-header">
                                    ${question.title}
                                </div>`)
        // console.log(question);

        const choicesList = $(`<div class="card-body" id="question-choices>
                               <ul class="list-group">
                               </ul>
                               </div>`);
        
        choicesList.on("click", (event) => {handleAnswerClick(event, question.answer)});
        
        question["choices"].forEach(choice => {
            choicesList.append(`<button type="button" class="button-choices btn btn-secondary">${choice}</button>
                                <br>`);       
        });

        $questionCard.prepend(questionTitle);
        $questionCard.append(choicesList);
    };

    function handleAnswerClick(event, answer) {
        event.preventDefault();

        if ($(event.target).html() === answer) {
            correct++;
            console.log("Correct Answer!");
            setTimeout(function() {
                $questionCard.empty();
                if (questions.length !== 0) {
                    displayQuestion();
                }
                else {
                    gameTime = totalTime;
                    endGame();
                    $timeCount.text(totalTime);
                    totalTime = 0;
                }
            }, 500);
        }
        else {
            wrong++;
            console.log("Wrong Answer!");
            setTimeout(function() {
            totalTime -= 20;
            if (totalTime <= 0) {
                totalTime = 0;
            }
            $questionCard.empty();
            displayQuestion();
            }, 500);
        }
    };

    function stopWatch() {
        if (totalTime === 0) {
            endGame();
            $timeCount.text(totalTime);
        }
        else if (totalTime > 0) {
            $timeCount.text(totalTime--);
            setTimeout(stopWatch, 1000);
        }
    };

    function endGame() {
        displayScorecard();
        const $submitBtn = $("#end-screen-submit");
        $submitBtn.on("click", handleInputSubmit);
    };

    function displayScorecard() {
        $questionScreen.hide();
        $timer.hide();
        $endScreen.show();
        
        var scoreCard = $endCard.html(
            `<div class="card-header" id="end-screen-header">
                <h2 id="end-screen-title">Game Over!</h2>
             </div>

             <div class="card-body" id="end-screen-body">
               <h3 id="final-score">Final Score: ${gameTime}</h3>
               <p>Correct Answers: ${correct}</p>
               <p>Wrong Answers: ${wrong}</p>
               <p>Overall Percent: ${((correct / "10") * 100).toFixed(0)}%</p>  

               Enter Username/Initials:
               <div class="input-group mb-3">
                 <input type="text" class="form-control player" id="end-screen-input" placeholder="Username/Initials" aria-label="Recipient's username" aria-describedby="basic-addon2">
                 <div class="input-group-append">
                   <button class="btn btn-outline-secondary" id="end-screen-submit" type="button">Submit</button>
                 </div>
               </div>
             </div>`);
        
        $endCard.prepend(scoreCard);
    }

    function handleInputSubmit(event) {
        event.preventDefault();

        $endScreen.hide();
        $highscoresScreen.show();
        
        const playerName = $(".player").val();
        const player = {
            name: playerName,
            score: gameTime
        }
        
        saveToLocalStorage(player);
        displayRankings(player);        
    };

    function displayRankings(currentPlayer = {}) {
        const players = JSON.parse(localStorage.getItem("players"));
        
        const playerList = $('<ul class="list-group list-group-flush"></ul>');

        if (players !== null) {
            sortArray(players);
            players.forEach((player, index) => {
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

    function checkRankingSubmit(event) {
        if ($(event.target).hasClass("highscores_nav")) {
            $startScreenTitle.hide();
            $startScreen.hide();
            $highscoresScreen.show();
            $highscoresBtn.prop("disabled", true);
            displayRankings();
        }
        else {
            endGame();
            $endScreen.hide();
            $highscoresScreen.show();
            $highscoresBtn.prop("disabled", true);
            displayRankings();
        }
    };

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

    function saveToLocalStorage(player) {
        if (localStorage.getItem("players") === null) {
            const players = [];
            players.push(player);
            localStorage.setItem("players", JSON.stringify(players));
        }
        else {
            const players = JSON.parse(localStorage.getItem("players"));
            players.push(player);
            localStorage.setItem("players", JSON.stringify(players));
        }
    };

    function goBackStart() {
        window.location.href = "./index.html";
    };

    function clearScore() {
        localStorage.clear();
        $highscoresBody.empty();
    };
    
    initialize();
};

quizGame();





