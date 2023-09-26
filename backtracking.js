function solvePuzzle(size) {
    const initialBoard = getCurrentBoardState(size);
    const solvedBoard = getGoalBoard(size);

    const solve = (board, depth) => {
        if (depth === 0) {
            return board.toString() === solvedBoard.toString() ? [board] : [];
        }

        const emptyCell = findEmptyCell(board, size);
        const moves = getPossibleMoves(emptyCell, size);

        for (const move of moves) {
            const newBoard = makeMove(board, emptyCell, move);
            const solution = solve(newBoard, depth - 1);

            if (solution.length > 0) {
                return [board, ...solution];
            }
        }

        return [];
    };

    const solutionPath = solve(initialBoard, size * size * size);
    
    if (solutionPath.length === 0) {
        console.log('No se encontró una solución.');
    } else {
        console.log('Se encontró una solución:');
        for (let i = 0; i < solutionPath.length; i++) {
            console.log(`Movimiento ${i + 1}:`);
            printBoard(solutionPath[i], size);
        }
    }
}

// Función para obtener el estado actual del tablero
function getCurrentBoardState(size) {
    const boardState = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({ x: 0, y: 0 }))
    );

    cellsList.forEach((cell) => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        boardState[x][y] = { x, y };
    });

    return boardState;
}

// Función para obtener el estado objetivo del tablero
function getGoalBoard(size) {
    const goalBoard = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({ x: 0, y: 0 }))
    );

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            goalBoard[x][y] = { x, y };
        }
    }

    return goalBoard;
}

// Función para encontrar la celda vacía en el tablero
function findEmptyCell(board, size) {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (!board[x][y]) {
                return { x, y };
            }
        }
    }
}

// Función para obtener los movimientos posibles desde una celda
function getPossibleMoves(cell, size) {
    const { x, y } = cell;
    const moves = [];

    if (x > 0) moves.push({ x: x - 1, y });
    if (x < size - 1) moves.push({ x: x + 1, y });
    if (y > 0) moves.push({ x, y: y - 1 });
    if (y < size - 1) moves.push({ x, y: y + 1 });

    return moves;
}

// Función para realizar un movimiento en el tablero
function makeMove(board, emptyCell, move) {
    const newBoard = board.map((row) => [...row]);
    const { x: emptyX, y: emptyY } = emptyCell;
    const { x: moveX, y: moveY } = move;

    newBoard[emptyX][emptyY] = { ...board[moveX][moveY] };
    newBoard[moveX][moveY] = null;

    return newBoard;
}

// Función para imprimir el tablero en la consola
function printBoard(board, size) {
    for (let y = 0; y < size; y++) {
        let row = '';
        for (let x = 0; x < size; x++) {
            const cell = board[x][y];
            row += cell ? `[${cell.x},${cell.y}] ` : '[  ] ';
        }
        console.log(row);
    }
    console.log('\n');
}

// Llamar a la función para resolver el rompecabezas
startButton.addEventListener('click', () => {
    const size = parseInt(boardSizeInput.value);
    const selectedImage = imageOptions.value;
    createPuzzleBoard(size, selectedImage);
    solvePuzzle(size);
});