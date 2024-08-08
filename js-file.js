function GameBoard(){
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i++){
        board[i] = [];

        for (let j = 0; j < columns; j++){
            board[i].push(Cell());
        }
    }

    const printBoard = () => {
        let currBoard = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(currBoard);
    }

    const dropToken = (rowIndex, colIndex, player) => {
        if (!board[rowIndex][colIndex].getValue() === ""){
            return;
        }
        board[rowIndex][colIndex].addToken(player);
    }

    const refreshBoard = () => {
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < columns; j++){
                board[i][j].addToken("");
            }
        }
    }

    const getBoard = () => board;

    return {printBoard, dropToken, refreshBoard, getBoard};

}

function Cell(){
    let value = "";
    const getValue = () => value;
    const addToken = (val) => {
        value = val;
    }
    return {addToken, getValue};
}

function GameController(playerOne = "Player 1",  playerTwo = "Player 2"){
    const board = GameBoard();
    let gameOver = false;
    let gameTie = false;
    const players = [
        {name: playerOne, token: "X"}, {name: playerTwo, token: "O"}
    ];

    let activePlayer = players[0];
    const switchPlayer = () => {
        activePlayer = (activePlayer === players[0] ? players[1] : players[0]);
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        if (gameOver){
            return;
        }
        printTurn();
    }

    const printTurn = () => {
        console.log(`${activePlayer.name}'s turn`);
    }

    const resetActivePlayer = () => {
        activePlayer = players[0];
    }

    const resetGameFlags = () => {
        gameOver = false;
        gameTie = false;
    }

    const playRound = (rowIndex, colIndex) => {
        if (gameOver){
            return;
        }
        let currPlayer = activePlayer.token;
        board.dropToken(rowIndex, colIndex, currPlayer);
        //Check for vertical-win
        board.getBoard().reduce((ver_count, row) => {
            if (row[colIndex].getValue() === currPlayer)
            {
                if (ver_count == 2){
                    gameOver = true;
                }
                return ver_count + 1;
            }
            return 0;
        }, 0);

        //Check for horizontal-win
       board.getBoard().forEach((row, index) => {
        if ((index + "") === rowIndex){
            row.reduce((hor_count, cell) => {
                if (cell.getValue() === currPlayer){
                    if (hor_count === 2){
                        gameOver = true;
                    }
                    return hor_count + 1;
                }
                return 0;
            }, 0)
        }
       });

        //Check for diagonal-win
        let b = board.getBoard();
        let tmp1 = b[0][0].getValue();
        let tmp2 = b[1][1].getValue();
        let tmp3 = b[2][2].getValue();
        let tmp4 = b[0][2].getValue();
        let tmp5 = b[2][0].getValue();

        if (((tmp1 === currPlayer) && (tmp2 === currPlayer) && (tmp3 === currPlayer))||((tmp4 === currPlayer) && (tmp2 === currPlayer) && (tmp5 === currPlayer))){
            gameOver = true;
        }

        //Check for game-tie
        let count = 0;
        board.getBoard().forEach((row) => row.forEach((cell) => {
            if (cell.getValue() === ""){
                count++;
            }
        }));
        if (count === 0 && !gameOver){
            gameTie = true;
            gameOver = true;
        }

        if (gameOver){
            console.log("This game is over");

            if (gameTie){
                console.log("Game Tied");
            }
            else{
                console.log(`${activePlayer.name} won this round`);
            }
        }
        else {
            switchPlayer();
        }
        printNewRound();
    }

    const isGameOver = () => gameOver;
    const isGameTied = () => gameTie;

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        isGameOver,
        isGameTied,
        resetActivePlayer,
        resetGameFlags,
        refreshBoard: board.refreshBoard
    }
}

function ScreenController(player1, player2){
    const game = GameController(player1, player2);
    const body = document.querySelector("body");
    const gameContainer = document.querySelector(".container");
    const boardContainer = document.querySelector('.board');
    const clickEventHandler = (e) => {
        if (!e.target.dataset.row || e.target.dataset.isClicked || game.isGameOver()){
            return;
        }
        e.target.dataset.isClicked = true;
        let rowIndex = e.target.dataset.row;
        let colIndex = e.target.dataset.column;
        let player = game.getActivePlayer();
        game.playRound(rowIndex, colIndex);
        updateScreen(e, player);
    }

    const startScreen = () => {
        body.classList.add("body-background");
        gameContainer.style.display = "flex";
        playerTurn.textContent = `${game.getActivePlayer().name}'s turn`;
        let board = game.getBoard();
        boardContainer.textContent = "";
        board.map((row, rowIndex) => row.map((col, colIndex) => {
            let cell = document.createElement("button");
            cell.dataset.column = colIndex;
            cell.dataset.row = rowIndex;
            cell.dataset.isClick = false;
            cell.textContent = col.getValue();
            cell.classList.add("cell");
            boardContainer.appendChild(cell);
        }))
    }

    const playAgain = () => {
        game.resetActivePlayer();
        game.refreshBoard();
        game.resetGameFlags();
        result.style.display = "none";
        startScreen();
    }

    const playerTurn = document.querySelector(".turn");
    const result = document.querySelector(".result");
    const r1 = document.querySelector(".result p:nth-child(1)");
    const r2 = document.querySelector(".result p:nth-child(2)");
    const playAgainBtn = document.querySelector("#play-again");

    const updateScreen = ((event, player) => {
        if (player.token === "X"){
            event.target.style.backgroundColor = "#be185d";
        }
        else {
            event.target.style.backgroundColor = "#6d28d9";
        }
        event.target.textContent = `${player.token}`;
        playerTurn.textContent = `${game.getActivePlayer().name}'s turn`;
        //Result Screen
        if (game.isGameOver()){
            r1.textContent = `Game Over !!!`;
            if (!game.isGameTied()){
                r2.textContent = `${player.name} won`;
            }
            else {
                r2.textContent = `It's a tie`;
            }
            result.style.display = "flex";
        }
    });
    boardContainer.addEventListener("click", clickEventHandler);
    playAgainBtn.addEventListener("click", playAgain);
    startScreen();
}


function IntroScreen(){
    //Form details extraction
    const form = document.querySelector("#intro-screen");
    const p1 = document.querySelector("#player1-name");
    const p2 = document.querySelector("#player2-name");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        form.style.display = "none";
        let player1Name = p1.value;
        let player2Name = p2.value;

        if (player1Name === ""){
            player1Name = undefined;
        }
        if (player2Name === ""){
            player2Name = undefined;
        }
        ScreenController(player1Name, player2Name);
    });     
}

let start = IntroScreen();
