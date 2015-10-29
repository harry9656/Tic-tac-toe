(function($){
	var grid = [
	0,0,0,
	0,0,0,
	0,0,0,
	], turn = 1, 
	Ai_player = true;
	$(document).ready(function(){
		clearGrid();
		gridUpdate();
		//When a player plays the game do this
		$(".box").click(function(){
			// where the player clicked?
			var where = $(this).attr("id").slice(3);
			if(grid[where] === 0)
			{
				grid[where] = turn;
				if(turn === 1) turn = 2;
				else turn = 1;
				gridUpdate();
				analizeGrid();
				if(Ai_player === true) nextMove();
			}
		});
	});

	// Move determined by the copmuter
	function nextMove(){
		/*	// Random Play
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
		*/
		var me = turn;
		function findBestMove(currentGrid, turno, level){
			if(rowTestVar(currentGrid) || columnTestVar(currentGrid) || obliqueTestVar(currentGrid)){
				if(turno === me) return -1;
				else return 1;
			}
			if(drawTestVar(currentGrid)) {
				return 0;
			}
			var result = (turno===me)?-1000:1000;
			var bestMove = -1;
			for(var position = 0; position < 9; position++){
				if(currentGrid[position] === 0){
					currentGrid[position] = turno;
					var moveValue = findBestMove(currentGrid, (turno===1)?2:1,level+1);
					if(level<2)
						console.log("level:"+level+ "\nvalue:" + moveValue +
						 "\nresult"+result+"\npos:"+ position);
					if(level%2 === 0){
						if( moveValue > result){
							result = moveValue;
							bestMove = position;
						}
					} else {
						if(moveValue < result){
							result = moveValue;
							bestMove = position;
						}
					}
					currentGrid[position] = 0;
				}
			}
			if(level === 0) return bestMove;
			return result;
		}
		if(rowTest() || columnTest() || obliqueTest() || drawTest()){
			return;
		}
		var newGrid = grid.slice(0);
		var position = findBestMove(newGrid,turn,0);
		console.log("The best move is: " + position);
		console.log(grid);

		grid[position] = turn;
		if(turn === 1) turn = 2;
		else turn = 1;
		gridUpdate();
		console.log(grid);
		analizeGrid();
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
			var timeOut = setInterval(function(){
				$(".result").html("");

				clearGrid();
				clearInterval(timeOut);
			}, 1000);
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
		gridUpdate();
	}

})(jQuery);



/*
$(document).ready(function(){
	var turn = "X";
	$(".box").click(function(){
		if($(".result").html() !== "") {
			$(".result").html("");
			clearGrid();
		}
		if($(this).html() !== "X" && $(this).html() !== "O")
			{$(this).html(turn);
				if(turn === "X") turn = "O";
				else turn = "X";
				analizeGrid();}
			});
});

function analizeGrid(){
	var firstVal;
	var secondVal;
	var thirdVal;
	//ROW analysis 
	for(var i = 1; i< 4; i++){
		firstVal = $(".row_"+i+" .box_1").text();
		secondVal = $(".row_"+i+" .box_2").text();
		thirdVal = $(".row_"+i+" .box_3").text();
		if(areEqual(firstVal,secondVal,thirdVal)) hasWon(firstVal);
	}
	//Column analysis
	for(var i = 1; i< 4; i++){
		firstVal = $(".row_1 .box_"+i).text();
		secondVal = $(".row_2 .box_"+i).text();
		thirdVal = $(".row_3 .box_"+i).text();
		if(areEqual(firstVal,secondVal,thirdVal)) hasWon(firstVal);
	}
	//Oblique analysis
	firstVal = $(".row_1 .box_1").text();
		secondVal = $(".row_2 .box_2").text();
		thirdVal = $(".row_3 .box_3").text();
		if(areEqual(firstVal,secondVal,thirdVal)) hasWon(firstVal);
		firstVal = $(".row_1 .box_3").text();
		secondVal = $(".row_2 .box_2").text();
		thirdVal = $(".row_3 .box_1").text();
		if(areEqual(firstVal,secondVal,thirdVal)) hasWon(firstVal);

}

function areEqual(){
	for(var i = 0; i < arguments.length-1; i++){
		if(arguments[i] !== arguments[i+1]) return false;
	}
	if(arguments[0] === "") return false;
	else return true;
}

function hasWon(player){
	$(".result").html(player + " Win");
	$("table").css("opacity","0.4");
}

function clearGrid(){
	for(var i = 1; i< 4; i++){
		for(var j = 1;j<4;j++){
		firstVal = $(".row_"+i+" .box_"+j).html("");
		secondVal = $(".row_"+i+" .box_"+j).html("");
		thirdVal = $(".row_"+i+" .box_"+j).html("");
	}
	}
	$("table").css("opacity","1");
}*/