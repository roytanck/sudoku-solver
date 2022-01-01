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
let initialSudoku = [];
let iv = null;

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
    //console.log( 'render' );
    for( let y=0; y<9; y++ ){
        for( let x=0; x<9; x++ ){
            let field = document.getElementById( 'field-' + x + y );
            let value = ( sudoku[y][x] == 0 ) ? '' : sudoku[y][x];
            field.setAttribute( 'value', value );
        }
    }
}

const solve = () => {
    stop();
    // create a backup copy of the sudoku to be able to revert to
    initialSudoku = copySudoku( sudoku );
    // set the interval for the solve steps
    iv = setInterval( step, 1 );
}

const stop = () => {
    clearInterval( iv );
}

const step = () => {
    //console.log( 'step' );
    // find empty positions
    let empty = [];
    for( let y=0; y<9; y++ ){
        for( let x=0; x<9; x++ ){
            if( sudoku[y][x] === 0 ){
                empty.push( [ x, y ] );
            }
        }
    }
    // check if no empty position, indicating succes
    if( empty.length < 1 ){
        console.log( 'succes' );
        stop();
        return;
    }
    //console.log( empty );
    // find a random empty position to fill
    let position = empty[ Math.floor( Math.random() * empty.length ) ];
    let [ px, py ] = position;
    //console.log( position );
    possibleValues = getPossibleValues( position );
    // Check if possible values is empty, indicating a failed attempt
    if( possibleValues == undefined || possibleValues.length < 1 ){
        console.log( 'oops' );
        //stop();
        sudoku = copySudoku( initialSudoku );

    } else {
        // fill in a random number from the possible values
        let guess = possibleValues[ Math.floor( Math.random() * possibleValues.length ) ];
        sudoku[py][px] = guess;
        render();
    }
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
    //console.log( values );
    return values;
}

document.addEventListener( 'DOMContentLoaded', init, false );
