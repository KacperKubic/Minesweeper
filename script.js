//Variable
var board = [];
var mineLocation = [];
var clicked = 0; 
var gameOver = false;
var rows;
var columns;
var mines;
var difficulty;
var enableFlag = false;

window.onload = function(){
    const buttonEasy = document.querySelector('#easy');
    const buttonMedium = document.querySelector('#medium');
    const buttonHard = document.querySelector('#hard');
    const flagButton = document.querySelector('#flag-button');
    buttonEasy.addEventListener('mousedown', difficultyEasy, false);
    buttonMedium.addEventListener('mousedown', difficultyMedium, false);
    buttonHard.addEventListener('mousedown', difficultyHard, false);
    buttonEasy.addEventListener('mouseup', createBoard, false);
    buttonMedium.addEventListener('mouseup', createBoard, false);
    buttonHard.addEventListener('mouseup', createBoard, false);
    flagButton.addEventListener('click', enableFlagButton, false);
}

//Set difficulty to "easy"
function difficultyEasy(){
    //Reset the board
    clicked = 0;
    gameOver = false;
    mineLocation = [];

    //If the board has got other classes remove them
    if (document.querySelector('.game_board').classList.contains('medium')){
        document.querySelector('.game_board').classList.remove('medium');
    }else if (document.querySelector('.game_board').classList.contains('hard')){
        document.querySelector('.game_board').classList.remove('hard');
    }

    //Define the size, number of mines and difficulty
    board = [];
    document.querySelector('.game_board').classList.add('easy');
    document.getElementById('game_state').innerText = 'Difficulty: Easy';
    rows = 8;
    columns = 8;
    mines = 5;
    difficulty = 1;
}

//Set difficulty to "medium"
function difficultyMedium(){
    //Reset the board
    clicked = 0;
    gameOver = false;
    mineLocation = [];

    //If the board has got other classes remove them
    if (document.querySelector('.game_board').classList.contains('easy')){
        document.querySelector('.game_board').classList.remove('easy');
    }else if (document.querySelector('.game_board').classList.contains('hard')){
        document.querySelector('.game_board').classList.remove('hard');
    }

    //Define the size, number of mines and difficulty
    board = [];
    document.querySelector('.game_board').classList.add('medium');
    document.getElementById('game_state').innerText = 'Difficulty: Medium';
    rows = 12;
    columns = 12;
    mines = 10;
    difficulty = 2;
}

//Set difficulty to "hard
function difficultyHard(){
    //Reset the board
    clicked = 0;
    gameOver = false;
    mineLocation = [];

    //If the board has got other classes remove them
    if (document.querySelector('.game_board').classList.contains('easy')){
        document.querySelector('.game_board').classList.remove('easy');
    }
    else if (document.querySelector('.game_board').classList.contains('medium')){
        document.querySelector('.game_board').classList.remove('medium');
    }

    //Define the size, number of mines and difficulty
    board = [];
    document.querySelector('.game_board').classList.add('hard');
    document.getElementById('game_state').innerText = 'Difficulty: Hard';
    rows = 15;
    columns = 15;
    mines = 15;
    difficulty = 3;
}

//Generate the mines
function addMines(){
    let minesLeft = mines;
    while (minesLeft > 0){ 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + '-' + c.toString();
        if (!mineLocation.includes(id)){
            mineLocation.push(id);
            minesLeft -= 1;
        }
    }
}

//Create a gameboard based on the difficulty
function createBoard(){
    document.querySelector('.game_board').innerHTML = '';
    
    addMines()
    
    for (let r = 0; r < rows; r++){
        let row = [];
        for (let c = 0; c < columns; c++){
            let tile = document.createElement('div'); 
            tile.id = r.toString() + '-' + c.toString(); 
            tile.addEventListener('click', tileClicked); 
            tile.oncontextmenu = function(e){
                e.preventDefault();
                addFlag(tile);
            }
            document.querySelector('.game_board').append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

//For mobile users. It allows you to enable the flag that you can put on mines
function enableFlagButton(){
    if(enableFlag){
        enableFlag = false;
        document.querySelector('#flag-button').style.backgroundColor = 'lightgray';
    }else{
        enableFlag = true;
        document.querySelector('#flag-button').style.backgroundColor = 'darkgray';
    }
}

//Puts a flag icon/removes it from the tile
function addFlag(tile){
    if (gameOver || tile.classList.contains('clicked')){
        return;
    }
    if (!tile.classList.contains('flag')){
        tile.classList.add('flag');
        tile.innerHTML = "<i class='fa-solid fa-flag'>";
    }else{
        tile.classList.remove('flag');
        tile.innerHTML = '';
    }
}

//Check the tile on click
function tileClicked(){
    //If the tile was already clicked or the game is over do nothing
    if (gameOver || this.classList.contains('clicked')){
        return;
    }

    let tile = this;
    
    //If the flag button is enabled and there is no flag on a tile: create one. Else remove it.
    if(enableFlag){
        if (tile.innerText == ''){
            tile.innerHTML = "<i class='fa-solid fa-flag'>";    
        }else if (tile.innerHTML == "<i class='fa-solid fa-flag"){
            tile.innerHTML = '';
        }
        return;
    }

    //If you clicked on a mine set gameOver to true and reveal all the mines
    if (mineLocation.includes(tile.id)){
        gameOver = true;
        document.getElementById('game_state').innerText = 'Game Over!';
        revealMinesLocation();
        return;
    }

    //Split mine id to create coordinates array. Call mineCheck function
    let coordinates = tile.id.split('-');
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);
    mineCheck(r, c);
}

//Show all the mines and change the background color on mine tiles to red
function revealMinesLocation(){
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < columns; c++){
            let tile = board[r][c];
            if(mineLocation.includes(tile.id)){
                tile.innerText = '';
                bombIcon = document.createElement('i');
                bombIcon.classList.add('fa-solid', 'fa-bomb');
                tile.appendChild(bombIcon);

                tile.style.backgroundColor = 'red';
            }
        }
    }
}


//Check if there are mines around a tile you clicked. Reveal the tile if there is no mines next to a tile
function mineCheck(r, c){
    if (r < 0 || r >= rows || c < 0 || c >= columns){
        return;
    }

    if (board[r][c].classList.contains('clicked')){
        return;
    }

    board[r][c].classList.add('clicked');
    clicked += 1;

    let found = 0;

    found += tileCheck(r-1, c-1); 
    found += tileCheck(r-1, c); 
    found += tileCheck(r-1, c+1); 

    
    found += tileCheck(r, c-1); 
    found += tileCheck(r, c+1);


    found += tileCheck(r+1, c-1); 
    found += tileCheck(r+1, c); 
    found += tileCheck(r+1, c+1); 

    if (found>0)  {
        board[r][c].innerText = found; 
        board[r][c].classList.add('number' + found.toString()); 
    }else { 
        mineCheck(r-1, c-1);   
        mineCheck(r-1, c);      
        mineCheck(r-1, c+1);   

        mineCheck(r, c-1);     
        mineCheck(r, c+1);     
      
        mineCheck(r+1, c-1);   
        mineCheck(r+1, c);      
        mineCheck(r+1, c+1);    
    }

    //If you revealed all the tiles without a mine set a game state to win and reveal the mines
    if (clicked == rows * columns - mines){
        document.getElementById('game_state').innerText = 'You won!';
        for (let r = 0; r < rows; r++){
        for (let c = 0; c < columns; c++){
            let tile = board[r][c];
            if(mineLocation.includes(tile.id)){
                tile.innerText = '';
                bombIcon = document.createElement('i');
                bombIcon.classList.add('fa-solid', 'fa-bomb');
                tile.appendChild(bombIcon);
                tile.style.backgroundColor = 'rgba(29, 248, 146, 0.699)';
            }
        }
        }
        gameOver = true;
    }
}


function tileCheck (r, c){
    if( r < 0 || r >= rows || c < 0 || c >= columns)
    {
        return 0;
    }

    if (mineLocation.includes(r.toString() + '-' + c.toString()))
    {
        return 1;
    }

    return 0;
}

