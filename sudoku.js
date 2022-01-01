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
        document.getElementById( 'container' ).appendChild( row );
        for( let x=0; x<9; x++ ){
            let field = document.createElement( 'input' );
            field.setAttribute( 'id', 'field-' + x + y );
            field.setAttribute( 'value', '' );
            let cssClass = ( Math.floor( x / 3 ) + Math.floor( y / 3 ) ) % 2 == 1 ? 'block1' : 'block2';
            field.setAttribute( 'class', cssClass );
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
    iv = setInterval( step, 1 );
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
    // check for positions with just one possible value
    if( mode == 1 ){
        let bestPosition = getBestEmptyPosition( empty );
        let [ px, py, possibleValues ] = bestPosition;
        if( possibleValues.length == 1 ){
            partialSudoku[py][px] = possibleValues[0];
            sudoku[py][px] = possibleValues[0];
        } else {
            mode = 2;
        }
        render();
        return;
    }
    // find a random empty position to fill
    let position = getBestEmptyPosition( empty );
    let [ px, py ] = position;
    //console.log( position );
    possibleValues = getPossibleValues( position );
    // Check if possible values is empty, indicating a failed attempt
    if( possibleValues == undefined || possibleValues.length < 1 ){
        console.log( 'oops' );
        // return to last known correct partial solution
        sudoku = copySudoku( partialSudoku );
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
    values = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    let [ px, py ] = position;
    // check column
    for( let x=0; x<9; x++ ){
        if( sudoku[py][x] !== 0 ){
            values = values.filter( val => val !== sudoku[py][x] );
        }
    }
    // check row
    for( let y=0; y<9; y++ ){
        if( sudoku[y][px] !== 0 ){
            values = values.filter( val => val !== sudoku[y][px] );
        }
    }
    // check square
    let startX = px - ( px % 3 );
    let startY = py - ( py % 3 );
    for( let y=startY; y<startY+3; y++ ){
        for( let x=startX; x<startX+3; x++ ){
            if( sudoku[y][x] !== 0 ){
                values = values.filter( val => val !== sudoku[y][x] );
            }
        }
    }
    //console.log( px + ',' + py );
    //console.log( values );
    return values;
}

const getBestEmptyPosition = ( empty ) => {
    let lowest = 10;
    let best = [];
    for( let i=0; i<empty.length; i++ ){
        let possibleValues = getPossibleValues( empty[i] );
        //console.log( i + ' - ' + possibleValues.length );
        if( possibleValues.length < lowest ){
            best[0] = empty[i][0];
            best[1] = empty[i][1];
            best[2] = possibleValues;
            lowest = possibleValues.length;
        }
    }
    return best;
}

document.addEventListener( 'DOMContentLoaded', init, false );
