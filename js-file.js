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
                board[i][j].addToken(0);
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

    const playRound = (rowIndex, colIndex) => {
        if (gameOver){
            return;
        }
        let currPlayer = activePlayer.token;
        board.dropToken(rowIndex, colIndex, currPlayer);

        let gameTie = false;
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
        if (index === rowIndex){
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
            if (cell.getValue() !== ""){
                count++;
            }
        }));
        if (count === 9){
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
            // board.refreshBoard();
            resetActivePlayer();
        }
        else {
            switchPlayer();
        }
        printNewRound();
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    }
}

function ScreenController(){
    const game = GameController("Ram", "Shyam");
    const boardContainer = document.querySelector('.board');

    const clickEventHandler = (e) => {
        if (!(e.target.dataset.column && e.target.dataset.row)){
            return;
        }
        let rowIndex = e.target.dataset.row;
        let colIndex = e.target.dataset.column;
        game.playRound(rowIndex, colIndex);
        updateScreen();
    }

    const updateScreen = () => {
        let board = game.getBoard();
        boardContainer.textContent = "";
        board.map((row, rowIndex) => row.map((col, colIndex) => {
            let cell = document.createElement("button");
            cell.dataset.column = colIndex;
            cell.dataset.row = rowIndex;
            cell.textContent = col.getValue();
            cell.classList.add("cell");
            boardContainer.appendChild(cell);
        }))
        let playerTurn = document.querySelector(".turn");
        playerTurn.textContent = `${game.getActivePlayer().name}'s turn`;
    };
    boardContainer.addEventListener("click", clickEventHandler);
    updateScreen();

}

let display = ScreenController();
// let game = GameController("Ram", "Shyam");
// game.playRound(0, 0);
// game.playRound(1, 0);
// game.playRound(0, 1);
// game.playRound(1, 1)
// game.playRound(0, 2);
// game.playRound(1, 2);
