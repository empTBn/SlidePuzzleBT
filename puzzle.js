const boardSizeInput = document.getElementById('board-size');
const startButton = document.getElementById('start-button');
const aEstrellaButton = document.getElementById('solve-buttonA');
const backtrackingButton = document.getElementById('solve-buttonB');
const board = document.getElementById('board');
const imageOptions = document.getElementById('image-options');
const movements = document.getElementById('movements');
const completion = document.getElementById('message');
completion.classList.add('hidden');

let imageWidth;
let imageHeight;
var moves;
var success;

let emptyCell = {
    x: 0,
    y: 0,
    newPositionX: 0,
    newPositionY: 0
};

let cellsList = [];
let currentCellPositions = []; // Variable para guardar las posiciones actuales de las celdas

let startState;
let goalState;
let temp1;
let temp2;

startButton.addEventListener('click', () => {
    const size = parseInt(boardSizeInput.value);
    const selectedImage = imageOptions.value;
    completion.classList.add('hidden');
    movements.textContent = 0;
    createPuzzleBoard(size, selectedImage);
});

function createPuzzleBoard(size, selectedImage) {
    moves = 0;
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    const newPosition = 0;
    const image = new Image();
    image.src = selectedImage;

    image.onload = () => {
        imageWidth = image.width;
        imageHeight = image.height;

        cellsList = [];

        startState = [];
        goalState = [];
        temp1 = [];

        const emptyX = Math.floor(Math.random() * size); // Posición X aleatoria para la casilla vacía
        const emptyY = Math.floor(Math.random() * size); // Posición Y aleatoria para la casilla vacía
        let valor=1;
        // Create a matrix to represent the puzzle board
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.width = `${imageWidth / size}px`;
                cell.style.height = `${imageHeight / size}px`;
                cell.dataset.x = x;
                cell.dataset.y = y;

                
                cell.dataset.value = valor; // Assign values from 0 to size^2 - 1
                valor++;
                

                const offsetX = (imageWidth / size) * x;
                const offsetY = (imageHeight / size) * y;

                if (x === emptyX && y === emptyY) {
                    // Casilla vacía
                    cell.style.backgroundColor = 'grey';
                    emptyCell.cell = cell;
                    emptyCell.newPositionX = x;
                    emptyCell.newPositionY = y;
                    emptyCell.x = cell.data-x;
                    emptyCell.y = cell.y;
                    cell.dataset.value = 0;
                    valor--;
                    
                    emptyCell.cell.addEventListener('click', () => { movePiece(cell, size); });
                    //console.log(emptyCell);
                    //console.log(emptyCell.cell);
                    //console.log(cell);
                    
                } else {
                    cell.style.backgroundImage = `url(${selectedImage})`;
                    cell.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
                    cell.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
                    //console.log(cell);
                    cell.addEventListener('click', () => { movePiece(cell, size); });
                    
                }
                cell.dataset.newPositionX = x;
                cell.dataset.newPositionY = y;
                cellsList.push(cell);
                board.appendChild(cell);

                if (temp1.length<size){
                    temp1.push(parseInt(cell.dataset.value));
                }
            }
            if (temp1.length=size){
                goalState.push(temp1);
                temp1 = [];
            }

        }
        shuffleArray(cellsList, size); // Reorganizar las celdas aleatoriamente
        console.log("goal", goalState);
    };
}

function shuffleArray(array, size) {
    
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];

      //console.log(array[i]);
      // Actualizar las posiciones de las celdas en el dataset y el estilo
      if (array[i].dataset.value != 0 && array[j].dataset.value != 0){
          const tempX = array[i].dataset.x;
          const tempY = array[i].dataset.y;
          const tempV = array[i].dataset.value;
          array[i].dataset.x = array[j].dataset.x;
          array[i].dataset.y = array[j].dataset.y;
          array[i].dataset.value = array[j].dataset.value;
          array[i].style.backgroundPosition = `-${(imageWidth / size) * array[j].dataset.x}px -${(imageHeight / size) * array[j].dataset.y}px`;
          array[j].dataset.x = tempX;
          array[j].dataset.y = tempY;
          array[j].dataset.value = tempV;
          array[j].style.backgroundPosition = `-${(imageWidth / size) * tempX}px -${(imageHeight / size) * tempY}px`;
          
      }
  }
  for (let i = 0; i < size; i++) {
      const temp2 = new Array(size).fill(0);
      startState.push(temp2);
  }

  for (let i = 0; i < cellsList.length; i++) {
      const cell = cellsList[i];
      const valorP = parseInt(cell.dataset.value);
      const xP = parseInt(cell.dataset.newPositionX);
      const yP = parseInt(cell.dataset.newPositionY);
      startState[yP][xP] = valorP;
  }
  console.log("start", startState);
  const isSolvableResult = isSolvable(startState);
    if (isSolvableResult) {
    window.alert("El puzzle es soluble.");
    } else {
    window.alert("El puzzle no es soluble.");
    }
}

function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        const copyArr = [];
        obj.forEach(item => {
            copyArr.push(deepCopy(item));
        });
        return copyArr;
    }

    const copyObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copyObj[key] = deepCopy(obj[key]);
        }
    }

    return copyObj;
}

function movePiece(cell, size) {
    const emptyCellCopyX = deepCopy(emptyCell.cell.dataset.x);
    const emptyCellCopyY = deepCopy(emptyCell.cell.dataset.y);
    const emptyCellCopyNX = deepCopy(emptyCell.cell.dataset.newPositionX);
    const emptyCellCopyNY = deepCopy(emptyCell.cell.dataset.newPositionY);
    const pp = cell;
    const CellCopyX = deepCopy(cell.dataset.x);
    const CellCopyY = deepCopy(cell.dataset.y);
    const CellCopyNX = deepCopy(cell.dataset.newPositionX);
    const CellCopyNY = deepCopy(cell.dataset.newPositionY);

    // Calcular la diferencia en las coordenadas X e Y entre la celda y la casilla vacía
    const dx = Math.abs(CellCopyNX - emptyCellCopyNX);
    const dy = Math.abs(CellCopyNY - emptyCellCopyNY);

    // Verificar si la celda se encuentra adyacente a la casilla vacía
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {

        // Intercambiar la imagen de fondo de la celda y la casilla vacía
        emptyCell.cell.style.backgroundColor = 'transparent';
        emptyCell.cell.style.backgroundImage = cell.style.backgroundImage;
        emptyCell.cell.style.backgroundPosition = cell.style.backgroundPosition;
        emptyCell.cell.style.backgroundSize = cell.style.backgroundSize;
        cell.style.backgroundImage = '';
        cell.style.backgroundColor = 'grey';

        // Cambiar posiciones en el dataset
        cell = emptyCell.cell;
        cell.dataset.x = CellCopyX;
        cell.dataset.y = CellCopyY;
        cell.dataset.newPositionX = emptyCellCopyNX;
        cell.dataset.newPositionY = emptyCellCopyNY;
        emptyCell = {
            cell: pp,
            x: emptyCellCopyX,
            y: emptyCellCopyY,
            newPositionX: CellCopyNX,
            newPositionY: CellCopyNY
        };
        emptyCell.cell.dataset.x = emptyCell.x;
        emptyCell.cell.dataset.y = emptyCell.y;
        emptyCell.cell.dataset.newPositionX = emptyCell.newPositionX;
        emptyCell.cell.dataset.newPositionY = emptyCell.newPositionY;

        console.log('casilla', cell);
        console.log('vacia', emptyCell.cell);

        moves++;
        movements.textContent = moves; // Actualiza el contenido del elemento HTML con el puntaje
        console.log('Movimientos: ', moves);

        // Verificar si todas las casillas están en sus posiciones originales
        if (checkPuzzleCompletion(size)) {
            // El rompecabezas está completo, puedes mostrar un mensaje o realizar alguna acción
            console.log('¡Has completado el rompecabezas!');
            console.log('Movimientos totales: ', moves);
            completion.classList.remove('hidden');
        }
        } else {
        // La celda no es adyacente a la casilla vacía, no se realiza el movimiento
        console.log('Movimiento inválido');
        }
}

// Función para verificar si se ha completado el rompecabezas
function checkPuzzleCompletion(size) {
    success = 0;
    for (let i = 0; i < cellsList.length; i++) {
        const cell = cellsList[i];
        const cellX = parseInt(cell.dataset.newPositionX);
        const cellY = parseInt(cell.dataset.newPositionY);

        //console.log(i, cellX, cellY);
        // Verificar si la celda está en su posición original
        if (cellX == parseInt(cell.dataset.x) && cellY == parseInt(cell.dataset.y)) {
            
            console.log(cellX, cellY, parseInt(cell.dataset.x), parseInt(cell.dataset.y));
            success++;
            if (success == size*size-1){
                return true;
            }
            //return false; // Todas las celdas están en sus posiciones originales
        }
    }

    return false; // Al menos una celda no está en su posición original
}

// Event listener for the "Solve with A*" button
aEstrellaButton.addEventListener('click', async () => {
  const movesToSolve = solvePuzzle(startState, goalState);

  if (movesToSolve === -1) {
      console.log('No solution found.');
  } else {
    console.log('Number of moves to solve the puzzle:', movesToSolve);
    movements.textContent = movesToSolve; 
    //await performMovesVisually(movesToSolve);
    console.log('Puzzle solved!');
  }
});

// Event listener for the "Solve with backtracking" button
bactrackingButton.addEventListener('click', async () => {
  /*const movesToSolve = solvePuzzle(startState, goalState);

  if (movesToSolve === -1) {
      console.log('No solution found.');
  } else {
    console.log('Number of moves to solve the puzzle:', movesToSolve);
    movements.textContent = movesToSolve; 
    //await performMovesVisually(movesToSolve);
    console.log('Puzzle solved!');
  }*/
});

/////////////////////////////////////////////////////////////////////////////

class PuzzleState {
  constructor(board, size, moves, heuristic) {
    this.board = board;
    this.size = size;
    this.moves = moves;
    this.heuristic = heuristic;
  }

  getScore() {
    return this.moves + this.heuristic;
  }
}

function getManhattanDistance(board, n) {
  let distance = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const value = board[i][j];
      if (value !== 0) {
        const goalX = Math.floor((value - 1) / n);
        const goalY = (value - 1) % n;
        distance += Math.abs(i - goalX) + Math.abs(j - goalY);
      }
    }
  }

  return distance;
}

function getPossibleMoves(x, y, n) {
  const moves = [];
  if (x > 0) moves.push({ x: x - 1, y });
  if (x < n - 1) moves.push({ x: x + 1, y });
  if (y > 0) moves.push({ x, y: y - 1 });
  if (y < n - 1) moves.push({ x, y: y + 1 });

  return moves;
}

function swap(board, x1, y1, x2, y2) {
  const temp = board[x1][y1];
  board[x1][y1] = board[x2][y2];
  board[x2][y2] = temp;
}

function solvePuzzle(initialState, goalState) {
  let i=0;

  const n = initialState.length;
  

  const startNode = new PuzzleState(
    initialState,
    n,
    0,
    getManhattanDistance(initialState, n)
  );
  
  const openSet = new Set();
  const closedSet = new Set();
  openSet.add(startNode);

  while (openSet.size > 0) {
    i++;
    console.log(i);
    let currentState = null;

    for (const state of openSet) {
      if (!currentState || state.getScore() < currentState.getScore()) {
        currentState = state;
      }
    }

    openSet.delete(currentState);
    closedSet.add(JSON.stringify(currentState.board));

    if (JSON.stringify(currentState.board) === JSON.stringify(goalState)) {
      return currentState.moves;
    }

    const zeroPos = currentState.board.reduce(
      (acc, row, i) =>
        row.indexOf(0) !== -1 ? { x: i, y: row.indexOf(0) } : acc,
      {}
    );

    const possibleMoves = getPossibleMoves(zeroPos.x, zeroPos.y, n);

    for (const move of possibleMoves) {
      const newBoard = currentState.board.map(row => [...row]);
      swap(newBoard, zeroPos.x, zeroPos.y, move.x, move.y);

      const newState = new PuzzleState(
        newBoard,
        n,
        currentState.moves + 1,
        getManhattanDistance(newBoard, n)
      );

      if (!closedSet.has(JSON.stringify(newState.board))) {
        openSet.add(newState);
      }
    }
  }

  return -1; // No solution found
}


  function countInversions(matrix) {
    const flattenedMatrix = matrix.flat().filter(num => num !== 0);
    let inversions = 0;

    for (let i = 0; i < flattenedMatrix.length; i++) {
      for (let j = i + 1; j < flattenedMatrix.length; j++) {
        if (flattenedMatrix[i] > flattenedMatrix[j]) {
          inversions++;
        }
      }
    }

    return inversions;
  }

  function isSolvable(matrix) {
    const n = matrix.length;
    const inversions = countInversions(matrix);

    // Encontrar la fila que contiene el espacio en blanco
    let blankTileRow;
    for (let i = 0; i < n; i++) {
      if (matrix[i].includes(0)) {
        blankTileRow = n - i;
        break;
      }
    }

    // Para un puzzle de tamaño impar, debe haber un número par de inversiones
    if (n % 2 === 1) {
      return inversions % 2 === 0;
    }
    // Para un puzzle de tamaño par, debe haber un número par de inversiones y una fila par desde abajo para el espacio en blanco
    else {
      return (inversions % 2 === 0 && blankTileRow % 2 === 1) || (inversions % 2 === 1 && blankTileRow % 2 === 0);
    }
  }

async function performMovesVisually(moves) {
  const delay = 1000; // Delay between moves (in milliseconds)

  for (const move of moves) {
      const [row, col] = move;
      [startState[row][col], startState[emptyCell.newPositionY][emptyCell.newPositionX]] =
        [startState[emptyCell.newPositionY][emptyCell.newPositionX], startState[row][col]];

        // Update the puzzle board visually
      updateBoardVisually();

        // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, delay));
  }
}

function updateBoardVisually() {
    cellsList.forEach((cell, index) => {
        const x = cell.dataset.newPositionX;
        const y = cell.dataset.newPositionY;
        const value = startState[y][x];

        if (value === 0) {
            cell.style.backgroundColor = 'grey';
        } else {
            cell.style.backgroundColor = 'transparent';
            const offsetX = (imageWidth / startState.length) * x;
            const offsetY = (imageHeight / startState.length) * y;
            cell.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
        }
    });
  }



  