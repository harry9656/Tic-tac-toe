(function($){
	// This grid is used throught the program to track the situation of the game.
	var grid = [
	0,0,0,
	0,0,0,
	0,0,0,
	], turn = 1,  // Turn is the variable used keep track which player's turn is.
	Ai_player = true,	// This variable is used to set whether the game is single or multiplayer
	difficulty = 1;
	$(document).ready(function(){
		clearGrid();	// Cleaning the grid before starting the game(optional)
		gridUpdate();	// Updating the table according to the grid values.
		//	when a click event is fired from the player act accordingly
		$(".box").click(function(){
			var where = $(this).attr("id").slice(3); 	// Where the player clicked?
			if(grid[where] === 0)		// Can he play on this position. If yes continue to compute otherwise do nothing.
			{
				grid[where] = turn;		// Update the grid according to the move made.
				if(turn === 1) turn = 2;	// Change the player's turn
				else turn = 1;
				gridUpdate();		// update the table
				analizeGrid();		// Analyze if someone won or there is a draw.
				if(Ai_player === true) nextMove();	// If the computer needs to make the next move call the function nextMove();
			}
		});
	});

	// Function that computes the next move
	function nextMove(){
		// If the difficulty is easy do random move
		if( difficulty === 0){
			var position = Math.floor(Math.random()*9);
			while(grid[position] !== 0){
				console.log("The postion now is: " + position);
				position = Math.floor(Math.random()*9);
			}
			grid[position] = turn;
			if(turn === 1) turn = 2;
			else turn = 1;
			gridUpdate();
			analizeGrid();
		}  // Else if the difficulty is hard don't let the oponent win.
		else {
			// Function that computes the next best move given an array. It return the move the computer should make.
			function findBestMove(currentGrid, turno, level){
				// Recursive exit test.
				if(rowTestVar(currentGrid) || columnTestVar(currentGrid) || obliqueTestVar(currentGrid)){	// if someone won return the min max values
					if(turno === me) return -1;  		
					else return 1;
				}
				if(drawTestVar(currentGrid)) {	// if nobody won return 0
					return 0;
				}
				var result = (turno===me)?-1000:1000;	// Start with very small/large values.
				var bestMove = -1;
				for(var position = 0; position < 9; position++){	// go through all the move possible for the player in this state.
					if(currentGrid[position] === 0){
						currentGrid[position] = turno;	// ad to the current grid the value of the current player.
						var moveValue = findBestMove(currentGrid, (turno===1)?2:1,level+1);	// compute the next state and save the returned state.		
						// If the level of the state  is even compute the min and max accordingly.
						if(level%2 === 0){
							if( moveValue > result){	// update the result for this state and the best move.
								result = moveValue;
								bestMove = position;
							}
						} else {
							if(moveValue < result){
								result = moveValue;
								bestMove = position;
							}
						}
						// reset the grid's value to 0 as if it was never touched before.
						currentGrid[position] = 0;
					}
				}
				if(level === 0) return bestMove;	// If the level is 0 return the best move computer can make.
				return result;		// return the current result for the state.
			}
			//++++++++++++++++++++++++++++++++//
			var me = turn;		// save the player in "me" variable
			// Check whether someone hasn't already won or there is a draw. 
			if(rowTest() || columnTest() || obliqueTest() || drawTest()){
				return;		// In that case return immediately.
			}
			var newGrid = grid.slice(0);	// Copy the grid and save it in newGrid.
			var position = findBestMove(newGrid,turn,0);	// Find the next best move and save it this variable called position.
			grid[position] = turn;		// update the grid
			if(turn === 1) turn = 2;	// change the turn of the player
			else turn = 1;
			gridUpdate();		// Update the table shown on the screen
			analizeGrid();		// analyze whether someone has won or not.
		}
	}

	// execute the function when someone wins 
	function hasWon(arr){
		if(testArray(arr)){
			$(".result").html((arr[0]===1?"X":"O") + " wins");
			var timeOut = setInterval(function(){
				$(".result").html("");

				clearGrid();
				clearInterval(timeOut);
			}, 1000);
			return true;
		};
	}
	// Analize array if it has same elements
	function testArray(arr){
		for(var i = 0; i < arr.length-1; i++){
			if(arr[i] === 0 || arr[i] !== arr[i+1]) return false;
		}
		return true;
	}

	function rowTest(){
		for(var i = 0; i < 3; i++)
			if(hasWon(grid.slice(3*i,3+3*i))) return true;
	}
	function columnTest(){
		for(var i = 0; i < 3; i++)
			if(hasWon([grid[0+i],grid[3+i],grid[6+i]])) return true;
	}
	function obliqueTest(){
		return (hasWon([grid[0],grid[4],grid[8]]) ||
			hasWon([grid[2],grid[4],grid[6]]));
	}
	function drawTest(){
		for(var i = 0; i < 9; i++){
			if(grid[i] === 0) return false
		}
	return true;
}

function rowTestVar(grid){
	for(var i = 0; i < 3; i++)
		if(testArray(grid.slice(3*i,3+3*i))) return true;
	return false;
}
function columnTestVar(grid){
	for(var i = 0; i < 3; i++)
		if(testArray([grid[0+i],grid[3+i],grid[6+i]])) return true;
	return false;
}
function obliqueTestVar(grid){
	return (testArray([grid[0],grid[4],grid[8]]) ||
		testArray([grid[2],grid[4],grid[6]]));
}
function drawTestVar(grid){
	for(var i = 0; i < 9; i++){
		if(grid[i] === 0) return false
	}
return true;
}
// Analizing the grid if someone has won or there is a draw
function analizeGrid(){
	if(rowTest() || columnTest() || obliqueTest()) return 1;
	if(drawTest()){
		showResult("Draw game");
		return 2;
	}
	return -1;
}
// Update the grid depending on the current values
function gridUpdate(){
	for(var i = 0; i < grid.length; i++){
		switch(grid[i]){
			case 0: $("#box"+i).html("");
			break;
			case 1: $("#box"+i).html("X");
			break;
			case 2: $("#box"+i).html("O");
			break;
		}
	}
};
// Clear the grid
function clearGrid(){
	for(var i = 0; i < grid.length; i++)
		grid[i] = 0;
	turn = 1;
	gridUpdate();
}

function showResult(text){
		$(".result").html(text);
		var timeOut = setInterval(function(){
			$(".result").html("")
			clearGrid();
			clearInterval(timeOut);
		}, 1000);
}
})(jQuery);
