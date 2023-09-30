//Algoritmo backtracking
//***********************************************************************************************
class BackTracking {

   constructor( board, emptyCell ) {
      this.updateBoardState(board)
      this.emptyCell = emptyCell;
   }

   updateBoardState(newBoard){
       this.board = newBoard;
       this.size = Math.sqrt(this.board.length);
   }

   verifyValidMove( cell ) {
      const dx = Math.abs(cell.x - this.emptyCell.x)
      const dy = Math.abs(cell.y - this.emptyCell.y)
      return ((dx === 1 && dy === 0) || (dx === 0 && dy === 1))
   }

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

   checkPuzzleCompletion() {
      //Se compara la posicion actual, con la posicion target
     for (let i = 0; i < this.board.length; i++) {
      if (!(this.board[i].x === this.board[i].target.x && this.board[i].y === this.board[i].target.y)) {
         return false
      }
     }
     return true
   }

   changePosition(cell) {
      let auxEmptyCell = this.emptyCell
      let auxCell = cell
      cell.x = auxEmptyCell.x
      cell.y = auxEmptyCell.y
      this.emptyCell.x = auxCell.x
      this.emptyCell.y = auxCell.y
   }

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