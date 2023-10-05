function solveSlidePuzzle(initialMatrix, goalMatrix) {
  const n = initialMatrix.length;
  const moves = [];

  // Función auxiliar para intercambiar elementos en la matriz
  function swap(matrix, i1, j1, i2, j2) {
    const temp = matrix[i1][j1];
    matrix[i1][j1] = matrix[i2][j2];
    matrix[i2][j2] = temp;
  }

  // Función para clonar una matriz
  function cloneMatrix(matrix) {
    return matrix.map(row => [...row]);
  }

  // Función para verificar si la matriz actual es igual a la meta
  function isGoal(matrix) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] !== goalMatrix[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  // Función de backtracking para resolver el rompecabezas
  function backtrack(matrix, i, j, depth) {
    if (depth === 0) {
      return false;
    }

    if (isGoal(matrix)) {
      return true;
    }

    const directions = [
      { dx: 0, dy: 1, move: 'right' },
      { dx: 0, dy: -1, move: 'left' },
      { dx: 1, dy: 0, move: 'down' },
      { dx: -1, dy: 0, move: 'up' }
    ];

    for (const direction of directions) {
      const newI = i + direction.dx;
      const newJ = j + direction.dy;

      if (newI >= 0 && newI < n && newJ >= 0 && newJ < n) {
        swap(matrix, i, j, newI, newJ);
        moves.push(direction.move);

        if (backtrack(cloneMatrix(matrix), newI, newJ, depth - 1)) {
          return true;
        }

        // Undo the move
        swap(matrix, i, j, newI, newJ);
        moves.pop();
      }
    }

    return false;
  }

  // Llamada inicial a la función de backtracking
  const maxDepth = n * n;  // Profundidad máxima
  if (backtrack(cloneMatrix(initialMatrix), 0, 0, maxDepth)) {
    return moves;
  } else {
    return null; // No se encontró solución
  }
}

// Ejemplo de uso
const initialMatrix = [
  [1, 2, 3],
  [4, 0, 5],
  [6, 7, 8]
];

const goalMatrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0]
];

const solution = solveSlidePuzzle(initialMatrix, goalMatrix);
console.log('Pasos para resolver el slide puzzle:', solution);