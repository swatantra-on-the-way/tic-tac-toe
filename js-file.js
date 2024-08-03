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
        if (!board[rowIndex][colIndex].getValue() === 0){
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
    let value = 0;
    const getValue = () => value;
    const addToken = (val) => {
        value = val;
    }
    return {addToken, getValue};
}
