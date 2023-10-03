const boardSizeInput = document.getElementById('board-size');
const startButton = document.getElementById('start-button');
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
                    temp1.push(cell.dataset.value);
                }
            }
            if (temp1.length=size){
                goalState.push(temp1);
                temp1 = [];
            }

        }
        console.log(goalState);
        shuffleArray(cellsList, size); // Reorganizar las celdas aleatoriamente
    };
}

function shuffleArray(array, size) {
    temp2=[];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];

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
/*
    for (let ypos = 0; ypos < size; ypos++) {
        for (let xpos = 0; xpos < size; xpos++) {
            
            if(cell.dataset.newPositionX==xpos && cell.dataset.newPositionY==ypos){
                if (temp2.length<size){
                    temp2.push(board[x][y].dataset.value);
                    temp2.push(array[i].dataset.value);
                }
            }


            if (temp2.length<size){
                temp2.push(board[x][y].dataset.value);
                temp2.push(array[i].dataset.value);
            }
        }
    }
    
        if (temp2.length=size){
            startState.push(temp2);
            temp2 = [];
        }*/
    //console.log(startState);
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
aEstrellaButton.addEventListener('click', () => {
    console.log("celllits", cellsList);
    //const moves = solvePuzzle(startState, goalState);
});


/////////////////////////////////////////////////////////////////////////////
/*

class PuzzleNode {
    constructor(state, parent, move, depth, heuristic) {
      this.state = state;  // Representación del estado del puzzle
      this.parent = parent;  // Nodo padre
      this.move = move;  // Movimiento que llevó a este estado
      this.depth = depth;  // Profundidad en el árbol
      this.heuristic = heuristic;  // Valor heurístico
    }
  }
  
  // Función de heurística (en este caso, distancia Manhattan)
  function calculateManhattanDistance(currentState, goalState) {
    let distance = 0;
    const n = currentState.length;
  
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (currentState[i][j] !== 0) {
          const goalPosition = findTilePosition(goalState, currentState[i][j]);
          distance += Math.abs(i - goalPosition[0]) + Math.abs(j - goalPosition[1]);
        }
      }
    }
  
    return distance;
  }
  
  function findTilePosition(state, tile) {
    const n = state.length;
  
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (state[i][j] === tile) {
          return [i, j];
        }
      }
    }
  
    return null;
  }
  
  // Función para generar sucesores válidos
  function generateSuccessors(node, n) {
    const successors = [];
    const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];  // Movimientos arriba, abajo, izquierda, derecha
    const emptyTilePos = findTilePosition(node.state, 0);
  
    for (const move of moves) {
      const newRow = emptyTilePos[0] + move[0];
      const newCol = emptyTilePos[1] + move[1];
  
      if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
        const newState = node.state.map(row => row.slice());
        [newState[emptyTilePos[0]][emptyTilePos[1]], newState[newRow][newCol]] =
          [newState[newRow][newCol], newState[emptyTilePos[0]][emptyTilePos[1]]];
          
        // Validar que la pieza que se está moviendo sea adyacente al 0
        if ((Math.abs(emptyTilePos[0] - newRow) + Math.abs(emptyTilePos[1] - newCol)) === 1) {
          successors.push(new PuzzleNode(newState, node, [newRow, newCol], node.depth + 1,
            calculateManhattanDistance(newState, goalState)));
        }
      }
    }
  
    return successors;
  }
  
  
  // Función para resolver el puzzle usando A*
  function solvePuzzle(startState, goalState) {
    const n = startState.length;
    const openSet = [];
    const closedSet = new Set();
  
    const startNode = new PuzzleNode(startState, null, null, 0,
      calculateManhattanDistance(startState, goalState));
    openSet.push(startNode);
  
    while (openSet.length > 0) {
      const currentNode = openSet.shift();
      closedSet.add(JSON.stringify(currentNode.state));
  
      if (JSON.stringify(currentNode.state) === JSON.stringify(goalState)) {
        return constructPath(currentNode);
      }
  
      const successors = generateSuccessors(currentNode, n);
  
      for (const successor of successors) {
        if (!closedSet.has(JSON.stringify(successor.state))) {
          openSet.push(successor);
        }
      }
  
      openSet.sort((a, b) =>
        (a.depth + a.heuristic) - (b.depth + b.heuristic));
    }
  
    return null;  // No se encontró solución
  }
  
  // Función para construir el camino desde el nodo objetivo al nodo inicial
  function constructPath(node) {
    const path = [];
    let currentNode = node;
  
    while (currentNode !== null) {
      if (currentNode.move) {
        path.unshift(currentNode.move);
      }
      currentNode = currentNode.parent;
    }
  
    return path;
  }
  
  async function displayBoard(board, elementId) {
    const table = document.getElementById(elementId);
    table.innerHTML = '';
  
    for (let i = 0; i < board.length; i++) {
      const row = document.createElement('tr');
  
      for (let j = 0; j < board[i].length; j++) {
        const cell = document.createElement('td');
        cell.textContent = board[i][j];
        row.appendChild(cell);
      }
  
      table.appendChild(row);
    }
  
    // Add a slight delay to visually show each move
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  async function performMovesVisually(moves) {
    let currentIndex = 0;
  
    async function performNextMove() {
      if (currentIndex < moves.length) {
        const [row, col] = moves[currentIndex];
        [startState[row][col], startState[0][0]] = [startState[0][0], startState[row][col]];
        await displayBoard(startState, 'board'); // Display the updated board
        currentIndex++;
        setTimeout(performNextMove, 1000); // Adjust the interval as needed
      }
    }
  
    await performNextMove();
  }
  
  // Define your puzzle state and goal state here
  const startState = [[4, 6, 3], [1, 5, 0], [2, 7, 8]];
  const goalState = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
  displayBoard(startState, 'initialStateTable');
  
  // Call the function to solve and visualize the puzzle
  const moves = solvePuzzle(startState, goalState);
  console.log(moves);
  performMovesVisually(moves);

  ///////////////////////////////////////////////////

  function convertStateToBoard(state) {
    const size = state.length;
    const board = [];
  
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(state[i][j]);
      }
      board.push(row);
    }
  
    return board;
  }

  */