
const boardSizeInput = document.getElementById('board-size');
const startButton = document.getElementById('start-button');
const backTrackingButton = document.getElementById('solve-buttonB');
const board = document.getElementById('board');
const imageOptions = document.getElementById('image-options');
const movements = document.getElementById('movements');
const completion = document.getElementById('message');
completion.classList.add('hidden');

let imageWidth;
let imageHeight;

let backTrackingAlgorithm

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
let cellObjets = []
let orderList = []

let specialCell;

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
        currentCellPositions = []; // Limpiar las posiciones actuales antes de crear el nuevo rompecabezas

        const emptyX = Math.floor(Math.random() * size); // Posición X aleatoria para la casilla vacía
        const emptyY = Math.floor(Math.random() * size); // Posición Y aleatoria para la casilla vacía

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.width = `${imageWidth / size}px`;
                cell.style.height = `${imageHeight / size}px`;
                cell.dataset.x = x;
                cell.dataset.y = y;
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
                    
                    emptyCell.cell.addEventListener('click', () => { movePiece(cell, size); });
                    //Agrego este objeto a la lista
                    cellObjets.push({cell:cell, empty:true, x:x, y:y})
                    
                    
                } else {
                    cell.style.backgroundImage = `url(${selectedImage})`;
                    cell.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
                    cell.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
                    console.log(cell);
                    cell.addEventListener('click', () => { movePiece(cell, size); })
                    //Agrego este objeto a la lista
                    cellObjets.push({cell:cell, empty:false, x:x, y:y})
                }
                cell.dataset.newPositionX = x;
                cell.dataset.newPositionY = y;
                cellsList.push(cell);
                board.appendChild(cell);
            }
        }
        orderList = cellsList
        shuffleArray(cellsList, size); // Reorganizar las celdas aleatoriamente
    };
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

function shuffleArray(array, size) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        const tempX = array[i].dataset.x;
        const tempY = array[i].dataset.y; 

        array[i].dataset.x = array[j].dataset.x;
        array[i].dataset.y = array[j].dataset.y;
        array[i].style.backgroundPosition = `-${(imageWidth / size) * array[j].dataset.x}px -${(imageHeight / size) * array[j].dataset.y}px`;
        array[j].dataset.x = tempX;
        array[j].dataset.y = tempY;
        array[j].style.backgroundPosition = `-${(imageWidth / size) * tempX}px -${(imageHeight / size) * tempY}px`;
    }
}

//Algoritmo backtracking
//***********************************************************************************************
class BackTracking {

    constructor( board, cellObjects ) {
        this.moves = []
        this.updateBoardState(board, cellObjects)
        this.setNewCords()
    }
 
    updateBoardState(newBoard, cellObjects){
        this.board = newBoard;
        this.cellObjects = cellObjects // Corregido aquí
        this.size = Math.sqrt(this.board.length);
    }

    setNewCords() {
        let matriz = []
        //La raiz para hacerlo por filas y columnas
        for (let i = 0; i < Math.sqrt(this.board.length); i++) {
            const subarray = this.board.slice(i * Math.sqrt(this.board.length), (i + 1) * Math.sqrt(this.board.length));
            matriz.push(subarray);
        }
        //Esto es para asignar como propiedad, las coordenadas originales en que estaba
        //Asi tenemos las coordenadas actuales y las que queremos llegar
        for(let i = 0; i < this.cellObjects.length; i++){
            for(let j = 0; j < matriz.length; j++){
                for(let k = 0; k < matriz[j].length; k++){
                    if (this.cellObjects[i].cell == matriz[j][k]) { // Corregido aquí
                        this.cellObjects[i].targetX = k // Corregido aquí
                        this.cellObjects[i].targetY = j // Corregido aquí
                    }
                }
            }
            
        }
        //Para declarar nuestra celda vacia como propiedad de la clase
        this.setEmptyCell()
    }

    //Para guardar como propiedad la celda vacia
    setEmptyCell() {
        for(let i = 0; i < this.cellObjects.length; i++){
            if (this.cellObjects[i].empty) { // Corregido aquí
                this.emptyCell = this.cellObjects[i] // Corregido aquí
            }
        }
    }

    //Para obtener el objeto de cada celda
    getObjectByCell(cell) {
        for(let i = 0; i < this.cellObjects.length; i++){
            if (this.cellObjects[i].cell == cell) { // Corregido aquí
                return this.cellObjects[i] // Corregido aquí
            }
        }
    }
 
    verifyValidMove( cellObject ) {
        const dx = Math.abs(cellObject.x - this.emptyCell.x)
        const dy = Math.abs(cellObject.y - this.emptyCell.y)
        return ((dx === 1 && dy === 0) || (dx === 0 && dy === 1))
    }

    cleanList(cellObject) {
        const auxList = []
        for(let i = 0; i < this.cellObjects.length; i++) {
            if (cellObject.cell == this.cellObjects[i].cell) {
                auxList.push(cellObject)
            } else if (this.cellObjects[i].empty) {
                auxList.push(this.emptyCell)
            } else {
                auxList.push(this.cellObjects[i])
            }
        }
        this.cellObjects = auxList
    }

    makeMove(cellObject) {
        for(let i = 0; i < this.cellObjects.length; i++) {
            if (cellObject == this.cellObjects[i]) {
                let auxEmptyCell = this.emptyCell
                let auxCell = cellObject
                this.emptyCell.x = auxCell.x
                this.emptyCell.y = auxCell.y
                let newCellObject = {
                    cell:cellObject.cell,
                    targetX:cellObject.targetX,
                    targetY:cellObject.targetY,
                    x:auxEmptyCell.x,
                    y:auxEmptyCell.y
                }
                this.cleanList(newCellObject)
            }
        }
    }
 
    getAllValidMoves() {
        //Se limpia la lista
        this.validMoves = []
        for ( let i = 0; i < this.cellObjects.length; i++ ) {
            if ( this.verifyValidMove(this.cellObjects[i])) {
                console.log("posible", this.cellObjects[i])
                //Se agregan las casillas que se pueden mover
                this.validMoves.push(this.cellObjects[i])
            }
        }
        return this.validMoves
    }

    verifyWin() {
        for(let i = 0; i < this.cellObjects.length; i++) {
            //Si la posicion actual de las casillas con foto es la misma que el target
            let condition = (this.cellObjects[i].x == this.cellObjects[i].targetX) && (this.cellObjects[i].y == this.cellObjects[i].targetY) && (!this.cellObjects[i].empty)
            if (!condition) {
                //Si alguna no lo cumple retorna false
                return false
            }
        }
        return true
    }
 
    solve(validMoves){
        //Encontramos una solución
        if ( this.verifyWin()) {
            //Hace los movimientos en el tablero cada medio segundo para que se note
            for (let i = 0; i < this.moves.length; i++) {
                setTimeout(() => {this.moves[i].cell.click()}, 500)
            }
            alert("HAZ COMPLETADO EL JUEGO")
            return true;
        }
        for (let i = 0; i < validMoves.length; i++ ) {
            console.log("Mueve", validMoves[i])
            //Se cambia la posicion de forma logica
            this.makeMove(validMoves[i])
            //Se agrega a la pila de movimientos
            this.moves.push(validMoves[i])
            //Se actualiza el estado
            let validMovesUpdate = this.getAllValidMoves()
            console.log("Validos", validMovesUpdate)
            //Llama recursivamente con el nuevo estado, en caso de estar resuelto, nos retornara true
            if ( this.solve(validMovesUpdate) ) {
                return
            }
            //Se devuelve este movimiento
            //Se saca de la lista de movimientos
            console.log("Devuelve", validMoves[i])
            this.moves.pop()
        }
    }
 }

startButton.addEventListener('click', () => {
    const size = parseInt(boardSizeInput.value);
    const selectedImage = imageOptions.value;
    completion.classList.add('hidden');
    movements.textContent = 0;
    createPuzzleBoard(size, selectedImage);
});

backTrackingButton.addEventListener('click', () => {
    backTrackingAlgorithm = new BackTracking(orderList, cellObjets)
    //Se llama la solucion
    backTrackingAlgorithm.solve( backTrackingAlgorithm.getAllValidMoves() )
})