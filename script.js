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

function difficultyEasy()
{
    clicked = 0;
    gameOver = false;
    mineLocation = [];
    if (document.querySelector('.game_board').classList.contains('medium'))
    {
        document.querySelector('.game_board').classList.remove('medium');
    }

    else if (document.querySelector('.game_board').classList.contains('hard'))
    {
        document.querySelector('.game_board').classList.remove('hard');
    }
    
    board = [];
    document.querySelector('.game_board').classList.add('easy');
    document.getElementById('game_state').innerText = 'Difficulty: Easy';
    rows = 8;
    columns = 8;
    mines = 5;
    difficulty = 1;

}

function difficultyMedium()
{
    clicked = 0;
    gameOver = false;
    mineLocation = [];
    if (document.querySelector('.game_board').classList.contains('easy'))
    {
        document.querySelector('.game_board').classList.remove('easy');
    }

    else if (document.querySelector('.game_board').classList.contains('hard'))
    {
        document.querySelector('.game_board').classList.remove('hard');
    }

    board = [];
    document.querySelector('.game_board').classList.add('medium');
    document.getElementById('game_state').innerText = 'Difficulty: Medium';
    rows = 12;
    columns = 12;
    mines = 10;
    difficulty = 2;
}

function difficultyHard()
{
    clicked = 0;
    gameOver = false;
    mineLocation = [];
    if (document.querySelector('.game_board').classList.contains('easy'))
    {
        document.querySelector('.game_board').classList.remove('easy');
    }

    else if (document.querySelector('.game_board').classList.contains('medium'))
    {
        document.querySelector('.game_board').classList.remove('medium');
    }

    board = [];
    document.querySelector('.game_board').classList.add('hard');
    document.getElementById('game_state').innerText = 'Difficulty: Hard';
    rows = 15;
    columns = 15;
    mines = 15;
    difficulty = 3;
}

function addMines()
{
    let minesLeft = mines;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + '-' + c.toString();

        if (!mineLocation.includes(id)) {
            mineLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function createBoard()
{
    document.querySelector('.game_board').innerHTML = '';
    
    addMines()
    
    for (let r = 0; r < rows; r++)
    {
        let row = [];
        for (let c = 0; c < columns; c++)
        {
            let tile = document.createElement('div'); 
            tile.id = r.toString() + '-' + c.toString(); 
            tile.addEventListener('click', tileClicked); 
            tile.oncontextmenu = function(e)
            {
                e.preventDefault();
                addFlag(tile);
            }
            document.querySelector('.game_board').append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    

    console.log(board)
}

function enableFlagButton()
{
    if(enableFlag)
    {
        enableFlag = false;
        document.querySelector('#flag-button').style.backgroundColor = 'lightgray';
    }

    else
    {
        enableFlag = true;
        document.querySelector('#flag-button').style.backgroundColor = 'darkgray';
    }
}

function addFlag(tile)
{
    if (gameOver || tile.classList.contains('clicked'))
    {
        return;
    }

    if (!tile.classList.contains('flag'))
    {
        tile.classList.add('flag');
        tile.innerHTML = "<i class='fa-solid fa-flag'>";
    }    

    else
    {
        tile.classList.remove('flag');
        tile.innerHTML = '';
    }
}


function tileClicked()
{
    if (gameOver || this.classList.contains('clicked'))
    {
        return;
    }

    let tile = this;

    if(enableFlag)
    {
        if (tile.innerText == '')
        {
            tile.innerHTML = "<i class='fa-solid fa-flag'>";    
        }

        else if (tile.innerHTML == "<i class='fa-solid fa-flag")
        {
            tile.innerHTML = '';
        }

        return;
    }

    if (mineLocation.includes(tile.id))
    {
        gameOver = true;
        document.getElementById('game_state').innerText = 'Game Over!';
        revealMinesLocation();
        return;
    }

    let coordinates = tile.id.split('-');
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);
    mineCheck(r, c);
}

function revealMinesLocation()
{
    for (let r = 0; r < rows; r++)
    {
        for (let c = 0; c < columns; c++)
        {
            let tile = board[r][c];
            if(mineLocation.includes(tile.id))
            {
                tile.innerText = '';
                bombIcon = document.createElement('i');
                bombIcon.classList.add('fa-solid', 'fa-bomb');
                tile.appendChild(bombIcon);

                tile.style.backgroundColor = 'red';
            }
        }
    }
}

function mineCheck(r, c)
{
    if (r < 0 || r >= rows || c < 0 || c >= columns)
    {
        return;
    }

    if (board[r][c].classList.contains('clicked'))
    {
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

    if (found>0)  
    {
        board[r][c].innerText = found; 
        board[r][c].classList.add('number' + found.toString()); 
    }

    else 
    { 
       
        mineCheck(r-1, c-1);   
        mineCheck(r-1, c);      
        mineCheck(r-1, c+1);   

      
        mineCheck(r, c-1);     
        mineCheck(r, c+1);     

      
        mineCheck(r+1, c-1);   
        mineCheck(r+1, c);      
        mineCheck(r+1, c+1);    
    }

    if (clicked == rows * columns - mines)
    {
        document.getElementById('game_state').innerText = 'You won!';
        for (let r = 0; r < rows; r++)
        {
        for (let c = 0; c < columns; c++)
        {
            let tile = board[r][c];
            if(mineLocation.includes(tile.id))
            {
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

