/* 

Tic-Tac-Toe Board

0  |  1  |  2
--------------
3  |  4  |  5
--------------
6  |  7  |  8

*/

const winPattern = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

var playing = true;
var playerSymbol = "O", computerSymbol = "X";
var playerArray = [], computerArray = [];

$(() => {
	for (let i = 0; i < 9; i++) {
		const square = `<div class="square" id="square${i}"></div>`;
		$("#board").append(square);
	}

	$("#wins").text(Cookies.get("wins"));
	$("#ties").text(Cookies.get("ties"));
	$("#losses").text(Cookies.get("losses"));
});

setTimeout(() => {
	const random = Math.round(Math.random());
	if (random) {
		computerTurn();
	} else {
		playerTurn();
	}
}, 2000);

function saveRecord(result, amount) {
	Cookies.set(result, amount, { expires: 7 });
}

function isFilled(square) {
	for (let filledSquare of playerArray) {
		if (square == filledSquare) {
			return true;
		}
	}

	for (let filledSquare of computerArray) {
		if (square == filledSquare) {
			return true;
		}
	}

	return false;
}

function isLineCreated(player) {
	for (line of winPattern) {
		const filledSquares = player.filter(item => {
			for (let square of line) {
				if (item == square) {
					return true;
				}
			}
			return false;
		});

		if (filledSquares.length >= 3) {
			$(".square").addClass("end").removeAttr("style");
			filledSquares.forEach(item => {
				$("#square" + item).removeClass("end");
			});
			return true;
		}
	}

	return false;
}

function getChanceSquares(squares, array) {
	let choices = [];
	for (line of winPattern) {
		const filled = array.filter(item => {
			for (let square of line) {
				if (item == square) {
					return true;
				}
			}
			return false;
		});

		if (filled.length >= squares) {
			const square = line.filter(item => {
				if (filled.includes(item)) {
					return false;
				} else {
					return true;
				}
			});

			for (item of square) {
				if (!isFilled(item)) {
					choices.push(item);
				}
			}
		}
	}

	if (choices.length) {
		return choices;
	} else {
		return false;
	}
}

function draw(index, text, color) {
	$("#square" + index).text(text).css("color", color);
}

function hover(e) {
	if (e.type == "mouseenter") {
		const square = e.currentTarget.id.replace("square", "");
		const color = "var(--end-color)";
		if (!isFilled(square) && playing) {
			draw(square, playerSymbol, color);
		}
	} else if (e.type == "mouseleave") {
		const square = e.currentTarget.id.replace("square", "");
		if (!isFilled(square) && playing) {
			draw(square, "");
		}
	}
}

function playerTurn() {
	if (end()) { return; }
	$("#status").text("Your turn.");
	$(".square").hover(hover);
	$(".square").click(player);
}

function computerTurn() {
	if (end()) { return; }
	$(".square").off("click");
	$("#status").text("Computer's turn...");
	computer();
}

function player(e) {
	const square = parseInt(e.currentTarget.id.replace("square", ""));
	if (isFilled(square)) {
		$("#status").text("That square is already taken.");
		return;
	} else {
		playerArray.push(square);
		draw(square, playerSymbol, "black");
	}
	computerTurn();
}

function computer() {
	let choices = [];
	let choice = getChanceSquares(2, computerArray);

	if (choice) {
		for (let item of choice) {
			choices.push(item);
		}
	}

	if (!choices.length) {
		choice = getChanceSquares(2, playerArray);
		if (choice) {
			for (let item of choice) {
				choices.push(item);
			}
		}
	}

	if (!choices.length) {
		choice = getChanceSquares(1, computerArray);
		if (choice) {
			for (let item of choice) {
				choices.push(item);
			}
		}
	}

	if (!choices.length) {
		choices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	}

	let square = choices[Math.floor(Math.random() * choices.length)];
	
	while (isFilled(square)) {
		square = choices[Math.floor(Math.random() * choices.length)];
	}

	setTimeout(() => {
		computerArray.push(square);
		draw(square, computerSymbol, "black");
		playerTurn();
	}, 1000);
}

function end() {
	let result, amount, message;

	if (isLineCreated(playerArray)) {
		const wins = parseInt($("#wins").text()) + 1;
		result = "wins";
		amount = wins;
		message = "You win!";
	} else if (isLineCreated(computerArray)) {
		const losses = parseInt($("#losses").text()) + 1;		
		result = "losses";
		amount = losses;
		message = "You lose...";
	} else if (playerArray.length + computerArray.length >= 9) {
		const ties = parseInt($("#ties").text()) + 1;
		result = "ties";
		amount = ties;
		message = "It's a draw!";
	} else {
		return false;
	}

	$(".square").off("click");
	$("#status").text(message);
	$("#" + result).text(amount);
	saveRecord(result, amount);
	playing = false;

	return true;
}