class Node {
    constructor(board, cost, heuristic, parent) {
        this.board = board;
        this.cost = cost;
        this.heuristic = heuristic;
        this.parent = parent;
    }

    getTotalCost() {
        return this.cost + this.heuristic;
    }
}

function solvePuzzleAStar(size) {
    const initialBoard = getCurrentBoardState(size);
    const solvedBoard = getGoalBoard(size);

    const heuristic = (board) => {
        let misplaced = 0;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (board[x][y].x !== solvedBoard[x][y].x || board[x][y].y !== solvedBoard[x][y].y) {
                    misplaced++;
                }
            }
        }
        return misplaced;
    };

    const openSet = new PriorityQueue((a, b) => a.getTotalCost() - b.getTotalCost());
    const closedSet = new Set();

    const startNode = new Node(initialBoard, 0, heuristic(initialBoard), null);
    openSet.enqueue(startNode);

    while (!openSet.isEmpty()) {
        const currentNode = openSet.dequeue();

        if (checkPuzzleCompletion(currentNode.board, size)) {
            //Encontramos la solución, reconstruir el camino
            const solutionPath = [];
            let current = currentNode;
            while (current !== null) {
                solutionPath.push(current.board);
                current = current.parent;
            }
            solutionPath.reverse();
            console.log('Se encontró una solución:');
            console.log(`Movimientos realizados: ${solutionPath.length - 1}`);
            for (let i = 1; i < solutionPath.length; i++) {
                console.log(`Movimiento ${i}:`);
                printBoard(solutionPath[i], size);
            }
            return;
        }

        closedSet.add(JSON.stringify(currentNode.board));

        const emptyCell = findEmptyCell(currentNode.board, size);
        const possibleMoves = getPossibleMoves(emptyCell, size);

        for (const move of possibleMoves) {
            const newBoard = makeMove(currentNode.board, emptyCell, move);
            const newNode = new Node(newBoard, currentNode.cost + 1, heuristic(newBoard), currentNode);

            if (!closedSet.has(JSON.stringify(newBoard))) {
                openSet.enqueue(newNode);
            }
        }
    }

    console.log('No se encontró una solución.');
}

//Implementación de PriorityQueue (cola de prioridad)
class PriorityQueue {
    constructor(comparator) {
        this.elements = [];
        this.comparator = comparator || ((a, b) => a - b);
    }

    enqueue(element) {
        this.elements.push(element);
        this.elements.sort(this.comparator);
    }

    dequeue() {
        return this.elements.shift();
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

//Llamar a la función para resolver el rompecabezas con A*
solveButtonA.addEventListener('click', () => {
    const size = parseInt(boardSizeInput.value);
    const selectedImage = imageOptions.value;
    createPuzzleBoard(size, selectedImage);
    solvePuzzleAStar(size);
});
