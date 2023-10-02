class BackTracking {

    constructor( board ) {
       this.updateBoardState(board)
    }
 
    updateBoardState(newBoard){
        this.board = newBoard;
        this.size = Math.sqrt(this.board.length);
    }
 
    verifyValidMove( cell ) {
        const emptyCellCopyNX = deepCopy(emptyCell.cell.dataset.newPositionX);
        const emptyCellCopyNY = deepCopy(emptyCell.cell.dataset.newPositionY);
        const CellCopyNX = deepCopy(cell.dataset.newPositionX);
        const CellCopyNY = deepCopy(cell.dataset.newPositionY);
 
        // Calcular la diferencia en las coordenadas X e Y entre la celda y la casilla vacía
        const dx = Math.abs(CellCopyNX - emptyCellCopyNX);
        const dy = Math.abs(CellCopyNY - emptyCellCopyNY);
 
        // Verificar si la celda se encuentra adyacente a la casilla vacía
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            return true
        } else {
            return false;
        }
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
        let success = 0;
        for (let i = 0; i < this.board.length; i++) {
            const cell = this.board[i];
            const cellX = parseInt(cell.dataset.newPositionX);
            const cellY = parseInt(cell.dataset.newPositionY);
 
            // Verificar si la celda está en su posición original
            if (cellX == parseInt(cell.dataset.x) && cellY == parseInt(cell.dataset.y)) {
                console.log(cellX, cellY, parseInt(cell.dataset.x), parseInt(cell.dataset.y));
                success++;
                if (success == this.size**2 - 1){
                    return true;
                }
                //return false; // Todas las celdas están en sus posiciones originales
            }
        }
 
        return false; // Al menos una celda no está en su posición original
    }
 
    solve(validMoves){
        //Encontramos una solución
        if ( this.checkPuzzleCompletion() ) {
            alert("HAZ COMPLETADO EL JUEGO")
            return true;
        }
        console.log(this.board)
 
        for ( let i = 0; i < validMoves.length; i++ ) {
            //Realiza el movimiento, con 100ms de diferencia para que se note
            //setTimeout(() => {}, 1000)
            //this.validMoves[i].click()
            //Calcula los movimientos posibles luego de que se cambie la posicion

            let validMoves = this.getAllValidMoves()
 
            //Llama recursivamente con el nuevo estado, en caso de estar resuelto, nos retornara true
            if ( this.solve(validMoves) ) {
                return
            }
            //Se rehace el movimiento
            //setTimeout(this.validMoves[i].click(), 100)
        }
        alert("No existe solucion")
 
    }
 }

