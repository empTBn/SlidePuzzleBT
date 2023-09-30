//Algoritmo backtracking
//***********************************************************************************************

/**
 * Clase que representa el algoritmo BackTracking para resolver el rompecabezas.
 */
class BackTracking {

    /**
     * Constructor para la clase BackTracking.
     * @param {Array} board - El estado actual del tablero del rompecabezas.
     * @param {{x: number, y: number}} emptyCell - La posición de la celda vacía.
     */
    constructor( board, emptyCell ) {
       this.updateBoardState(board)
       this.emptyCell = emptyCell;
    }
 
    /**
     * Actualiza el estado actual del tablero del rompecabezas.
     * @param {Array} newBoard - El nuevo estado del tablero del rompecabezas.
     */
    updateBoardState(newBoard){
        this.board = newBoard;
        this.size = Math.sqrt(this.board.length);
    }
 
    /**
     * Verifique si un movimiento a una celda específica es válido.
     * @param {{x: number, y: number}} cell - La celda a la que se trasladara.
     * @returns {boolean} Verdadero si el movimiento es válido, falso en caso contrario..
     */
    verifyValidMove( cell ) {
       const dx = Math.abs(cell.x - this.emptyCell.x)
       const dy = Math.abs(cell.y - this.emptyCell.y)
       return ((dx === 1 && dy === 0) || (dx === 0 && dy === 1))
    }
    
    /**
     * Obtiene todos los movimientos válidos del estado actual del tablero del rompecabezas.
     * @returns {Array} Array con los movimientos válidos.
     */
    getAllValidMoves() {
        //Se limpia la lista
        this.validMoves = []
        for ( let i = 0; i < this.board.length; i++ ) {
            if ( this.verifyValidMove(this.board[i]) ) {
                //Se agregan las casillas que se pueden mover
                this.validMoves.push(this.board[i])
            }
        }
        console.log("Posibles movimientos:", this.validMoves)
        return this.validMoves
    }
 
    /**
     * Comprueba si el rompecabezas está completo.
     * @returns {boolean} Verdadero si se completa el rompecabezas; falso en caso contrario.
     */
    checkPuzzleCompletion() {
       //Se compara la posicion actual, con la posicion target
      for (let i = 0; i < this.board.length; i++) {
       if (!(this.board[i].x === this.board[i].target.x && this.board[i].y === this.board[i].target.y)) {
          return false
       }
      }
      return true
    }
 
    /**
     * Cambiar la posición de una celda.
     * @param {{x: number, y: number}} cell - La celda que se va a mover.
     */
    changePosition(cell) {
       let auxEmptyCell = this.emptyCell
       let auxCell = cell
       cell.x = auxEmptyCell.x
       cell.y = auxEmptyCell.y
       this.emptyCell.x = auxCell.x
       this.emptyCell.y = auxCell.y
    }
 
    /**
     * Resuelve el rompecabezas con BackTracking.
     * @param {number} validMovesLength - El número de movimientos válidos.
     */
    solve(validMovesLength){
        //Encontramos una solución
        if ( this.checkPuzzleCompletion() ) {
            return true;
        }
        console.log("Reinicio")
 
        for ( let i = 0; i < validMovesLength; i++ ) {
            //Realiza el movimiento, con 100ms de diferencia para que se note
            setTimeout(() => {}, 1000)
            this.validMoves[i].cell.click()
            this.changePosition(this.validMoves[i])
            //Calcula los movimientos posibles luego de que se cambie la posicion
            let validMoves = this.getAllValidMoves()
 
            //Llama recursivamente con el nuevo estado, en caso de estar resuelto, nos retornara true
            if ( this.solve(validMoves.length) ) {
                alert("HAZ COMPLETADO EL JUEGO")
                return
            }
            //Se rehace el movimiento
            setTimeout(this.validMoves[i].click(), 100)
        }
        alert("No existe solucion")
 
    }
 }
 //***********************************************************************************************