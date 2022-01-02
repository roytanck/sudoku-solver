const example = [
    [ 2, 8, 0, 0, 0, 0, 0, 1, 4 ],
    [ 6, 0, 0, 0, 0, 0, 0, 0, 2 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 6, 7, 3, 5, 0, 0 ],
    [ 0, 7, 0, 0, 0, 0, 0, 2, 0 ],
    [ 0, 0, 9, 0, 0, 0, 7, 0, 0 ],
    [ 0, 0, 0, 5, 0, 6, 0, 0, 0 ],
    [ 7, 0, 0, 0, 4, 0, 0, 0, 8 ],
    [ 8, 4, 0, 0, 0, 0, 0, 9, 3 ],
];

let sudoku = [];
let partialSudoku = [];
let iv = null;
let mode = 1; // set to 2 when solution contains guesses

const init = () => {
    // create 9*9 input fields
    for( let y=0; y<9; y++ ){
        let row = document.createElement( 'div' );
        document.getElementById( 'puzzle' ).appendChild( row );
        for( let x=0; x<9; x++ ){
            let field = document.createElement( 'input' );
            field.setAttribute( 'id', 'field-' + x + y );
            field.setAttribute( 'maxlength', 1 );
            field.setAttribute( 'value', '' );
            let cssClass = ( Math.floor( x / 3 ) + Math.floor( y / 3 ) ) % 2 == 1 ? 'odd' : 'even';
            field.setAttribute( 'class', cssClass );
            field.addEventListener( 'change', inputHandler, false );
            row.appendChild( field );
        }
    }
    // button event handlers
    document.getElementById( 'example' ).addEventListener("click", initExample, false);
    document.getElementById( 'clear' ).addEventListener("click", initZeros, false);
    document.getElementById( 'solve' ).addEventListener("click", solve, false);
    document.getElementById( 'stop' ).addEventListener("click", stop, false);
    // reset the board
    initZeros();
    render();
}

const initExample = () => {
    stop();
    sudoku = copySudoku( example );
    render();
}

const initZeros = () => {
    stop();
    for( let y=0; y<9; y++ ){
        sudoku[y] = [];
        for( let x=0; x<9; x++ ){
            sudoku[y][x] = 0;
        }
    }
    render();
}

const render = () => {
    for( let y=0; y<9; y++ ){
        for( let x=0; x<9; x++ ){
            let field = document.getElementById( 'field-' + x + y );
            let value = ( sudoku[y][x] == 0 ) ? '' : sudoku[y][x];
            field.value = value;
        }
    }
}

const solve = () => {
    stop();
    mode = 1;
    // create a backup copy of the sudoku to be able to revert to
    partialSudoku = copySudoku( sudoku );
    // set the interval for the solve steps
    iv = setInterval( step, 10 );
}

const step = () => {
    // find empty positions
    let empty = getEmptyPositions();
    // check if no empty position, indicating succes
    if( empty.length < 1 ){
        console.log( 'succes' );
        stop();
        return;
    }
    // Get the easiest position to solve
    let bestPosition = getBestEmptyPosition( empty );
    let [ px, py, possibleValues ] = bestPosition;
    // if the lowest number of possibilities is zero, the solution is false
    if( possibleValues.length < 1 ){
        console.log( 'oops' );
        // return to last known correct partial solution
        sudoku = copySudoku( partialSudoku );
        return;
    }
    // check for positions with just one possible value
    if( mode == 1 ){
        if( possibleValues.length == 1 ){
            partialSudoku[py][px] = possibleValues[0];
            sudoku[py][px] = possibleValues[0];
        } else {
            mode = 2; // guesses from now on
        }
    } else {
        // fill in a random number from the possible values
        let guess = possibleValues[ Math.floor( Math.random() * possibleValues.length ) ];
        sudoku[py][px] = guess;
    }
    render();
}

const stop = () => {
    clearInterval( iv );
}

const getEmptyPositions = () => {
    // find empty positions
    let empty = [];
    for( let y=0; y<9; y++ ){
        for( let x=0; x<9; x++ ){
            if( sudoku[y][x] === 0 ){
                empty.push( [ x, y ] );
            }
        }
    }
    return empty;
}

const getPossibleValues = ( position ) => {
    let values = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    let excluded = [];
    let [ px, py ] = position;
    // check column
    for( let x=0; x<9; x++ ){
        if( sudoku[py][x] !== 0 ){
            excluded.push( sudoku[py][x] );
        }
    }
    // check row
    for( let y=0; y<9; y++ ){
        if( sudoku[y][px] !== 0 ){
            excluded.push( sudoku[y][px] );
        }
    }
    // check square
    let startX = px - ( px % 3 );
    let startY = py - ( py % 3 );
    for( let y=startY; y<startY+3; y++ ){
        for( let x=startX; x<startX+3; x++ ){
            if( sudoku[y][x] !== 0 ){
                excluded.push( sudoku[y][x] );
            }
        }
    }
    // remove excluded values from the values array and return the result
    values = values.filter( val => ! excluded.includes( val ) );
    return values;
}

const getBestEmptyPosition = ( empty ) => {
    let lowest = 10;
    let best = [];
    for( let i=0; i<empty.length; i++ ){
        let possibleValues = getPossibleValues( empty[i] );
        if( possibleValues.length < lowest ){
            best[0] = empty[i][0];
            best[1] = empty[i][1];
            best[2] = possibleValues;
            lowest = possibleValues.length;
        }
    }
    return best;
}

const inputHandler = ( event ) => {
    let x = parseInt( event.target.id.charAt( 6 ) );
    let y = parseInt( event.target.id.charAt( 7 ) );
    sudoku[y][x] = parseInt( event.target.value );
    render();
}

const copySudoku = ( a ) => {
    let b = [];
    for( let y=0; y<9; y++ ){
        b[y] = [];
        for( let x=0; x<9; x++ ){
            b[y][x] = a[y][x];
        }
    }
    return b;
}

document.addEventListener( 'DOMContentLoaded', init, false );
