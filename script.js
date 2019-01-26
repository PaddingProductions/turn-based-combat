
const ctx = document.getElementById("main canvas").getContext("2d");

ctx.fillStyle = '#000';

const PX_NUM = 3;

// x and y of the button you are on
let g_mousePos = [0, 0];

let g_buttonAction = null;
//the position of the buttons(not on screen)
let buttonPos = [];
for (let c = 0; c < 3; c++) {
	buttonPos[c] = 'none';
}
//create buttons here 
buttonPos[0] = 'attack';
buttonPos[1] = 'defend';
buttonPos[2] = 'escape';

const BGsizeX = 1200;
const BGsizeY = 750;

// normal = no buttons just waiting
// attack = buttons untill you select an action
// death = welp, your dead.
BGstats = 'normal';

// images
const enemyImages = {
	'swordsmen': document.getElementById('swordsmen'),
	'shieldsmen': document.getElementById('shieldsmen'),
	'spearmen': document.getElementById('spearmen'),
	'bombermen': document.getElementById('bombermen'),
}

const stand_TeeFaa = document.getElementById('player Tee Faa');
const shield = document.getElementById('shield');
const sword = document.getElementById('sword');
const swordswing = document.getElementById('swordswing');



var letterList = {
	'a': document.getElementById('letterA'),
	'b': document.getElementById('letterB'),
	'c': document.getElementById('letterC'),
	'd': document.getElementById('letterD'),
	'e': document.getElementById('letterE'),
	'f': document.getElementById('letterF'),
	'g': document.getElementById('letterG'),
	'h': document.getElementById('letterH'),
	'i': document.getElementById('letterI'),
	'j': document.getElementById('letterJ'),
	'k': document.getElementById('letterK'),
	'l': document.getElementById('letterL'),
	'm': document.getElementById('letterM'),
	'n': document.getElementById('letterN'),
	'o': document.getElementById('letterO'),
	'p': document.getElementById('letterP'),
	'q': document.getElementById('letterQ'),
	'r': document.getElementById('letterR'),
	's': document.getElementById('letterS'),
	't': document.getElementById('letterT'),
	'u': document.getElementById('letterU'),
	'v': document.getElementById('letterV'),
	'w': document.getElementById('letterW'),
	'x': document.getElementById('letterX'),
	'y': document.getElementById('letterY'),
	'z': document.getElementById('letterZ'),

	'/': document.getElementById('slash'),

	'0': document.getElementById('number0'),
	'1': document.getElementById('number1'),
	'2': document.getElementById('number2'),
	'3': document.getElementById('number3'),
	'4': document.getElementById('number4'),
	'5': document.getElementById('number5'),
	'6': document.getElementById('number6'),
	'7': document.getElementById('number7'),
	'8': document.getElementById('number8'),
	'9': document.getElementById('number9'),

}

cursor = document.getElementById('cursor');

letterPxNum = 3;
// the attack multiplyer at the start
//method shown above, may change
//damage = (40+(Math.floor(ATK*Math.random()) * (ATK/10);
let damage;

// when this turns false, the battle ends
let battle = true;
//number of enemies in the battle
let enemyNum = 1;

let swordFrame = 0;
//adfhakjdfajf

let currentKey = {
	//up arrow
	'38': 0,
	//left arrow
	'37': 0,
	//down arrow
	'40': 0,
	//right arrow
	'39': 0,
}

let playerStats = {
	'tee faa': {
		'HP': 350,
		'FULL HP': 350,
		'ATK': 10,
		//10sec - SPD = time gap between each move
		'SPD': 5,
		// 
		'action time': null,
	}
}

let move = false;

let waiting = false;
//stats of all enemies in the game
const bestiary = {
	'swordsmen': {
		'NAME': 'swordsmen',
		//stats
		'HP': 150,
		'FULL HP': 150,
		'ATK': 7,
		'SPD': 3,
		//timer
		'action time': null,
		//AI of the enemy
		'ablities': null,
		'AI': () => {
			return 'attack';
		}
	}
}

//current enemy you are fighting
let enemy;

const startBattle = () => {
	//setting up player Timer
	let leftTime = 10 - playerStats['tee faa']['SPD'];
	const now = Date.now() / 1000;
	playerStats['tee faa']['action time'] = now + leftTime;

	///setting up enemy timer.
	enemy = bestiary['swordsmen'];
	leftTime = 10 - enemy['SPD'];
	enemy['action time'] = now + leftTime;
};

//this does everything, because if done on key down, it will be called constantly
const handleKeyUp = e => {
	lastPos = [g_mousePos[0], g_mousePos[1]];

	//changing the position
	if (currentKey['40']) g_mousePos[1] += 1;
	if (currentKey['37']) g_mousePos[0] -= 1;
	if (currentKey['38']) g_mousePos[1] -= 1;
	if (currentKey['39']) g_mousePos[0] += 1;

	//playerTimer
	if (move === true) {
		if (currentKey['83']) {
			const leftTime = 10 - playerStats['tee faa']['SPD'];
			const now = Date.now() / 1000;
			playerStats['tee faa']['action time'] = now + leftTime;

			g_buttonAction = buttonPos[g_mousePos[1]];
			ATK = playerStats['ATK'];
			damage = 60;
			setTimeout(() => {

				enemy['HP'] -= damage;
				g_buttonAction = null;
				swordFrame = 0;
			}, 1000);
		}
	}
	//resetting keys
	currentKey['37'] = 0;
	currentKey['38'] = 0;
	currentKey['39'] = 0;
	currentKey['40'] = 0;
	currentKey['83'] = 0;

}

// when button down sets the unicode to the button pressed.
const handleKeyDown = e => {
	currentKey[e.keyCode] = 1;
};

const drawBG = () => {
	ctx.fillStyle = '#eeeeee'
	ctx.fillRect(0, 0, BGsizeX, BGsizeY);
	ctx.lineWidth = '5';
	ctx.rect(0, 0, BGsizeX, BGsizeY);
	ctx.stroke();

	if (move === true) drawButtons(['attack', 'defend', 'escape']);
	drawCharacterStats(['tee faa'])
	drawMouse();
	drawCharacters(['tee faa']);
	drawEnemies([enemy]);

}

const drawCharacters = (characters) => {
	imgx = 800;
	imgy = 300;
	for (let i = 0; i < characters.length; i++) {

		if (g_buttonAction === 'attack') {
			imgx = 600;
			//this SHOULD make it look like it's stabing the enemies.
			imgx -= (swordFrame * 5) * PX_NUM;

			//drawing the player.
			ctx.drawImage(swordswing, 1, 1, 20, 23, imgx, imgy, 20 * PX_NUM, 23 * PX_NUM);
			//drawing the sword. it will only be the straight one because you are stabing 
			//it not slicing it
			imgx -= 16 * PX_NUM;
			imgy += 10 * PX_NUM;

			ctx.drawImage(sword, 1, 111, 18, 6, imgx, imgy, 18 * PX_NUM, 6 * PX_NUM);
			swordFrame += 1;
		} else {
			//when it's waiting for the attack bar to fill
			ctx.drawImage(stand_TeeFaa, imgx, imgy, 16 * (PX_NUM), 23 * (PX_NUM));
			ctx.drawImage(shield, 0, 0, 6, 18, imgx - (10 * PX_NUM), imgy + (5 * PX_NUM)
				, 8 * PX_NUM, 16 * PX_NUM);
		}
	}
}

const drawEnemies = (enemies) => {
	imgx = 100;
	imgy = 200;
	for (let i = 0; i < enemies.length; i++) {
		//changing the position for every enemy there images
		imgy += 100 * enemies.length;
		//getting the image of the enemy
		img = enemyImages[enemies[i]['NAME']];
		ctx.drawImage(img, imgx, imgy, 32 * PX_NUM, 30 * PX_NUM);

	}
}

const drawButtons = (words) => {
	imgx = 10;
	imgy = 525;
	ctx.fillStyle = "#cccccc";
	ctx.fillRect(imgx, imgy, 200, 215);
	ctx.fillStyle = "#000000";
	ctx.lineWidth = '3';
	ctx.rect(imgx, imgy, 200, 215);
	ctx.stroke();

	for (let i = 0; i < words.length; i++) {
		imgx = 10;
		imgy = 530;
		writeWord(words[i], imgx + 10, imgy + ((10 + 50) * i) + 10);
	}
}

// draws the finger cursor from final fantasy 
const drawMouse = () => {
	imgx = 170 + (200 * g_mousePos[0])
	imgy = 525 + (80 * g_mousePos[1]);
	ctx.drawImage(cursor, imgx, imgy, 22 * 2, 22 * 2);
}

// draws the character's stats bar
const drawCharacterStats = (words) => {
	for (let i = 0; i < words.length; i++) {

		//drawing the blue bar
		imgx = 220;
		imgy = 525 + ((50 + 10) * i);
		ctx.fillStyle = '#5c81bc';
		ctx.fillRect(imgx, imgy, 960, 50);
		ctx.fillStyle = '#bcbcbc';
		ctx.rect(imgx, imgy, 960, 50);

		//writing the name of the fighter
		writeWord(words[i], imgx + 10, imgy + 10);

		imgx = imgx + 150;
		imgy = imgy;
		HPString = `${playerStats[words[i]]['HP']} / ${playerStats[words[i]]['FULL HP']}`;
		//writing the HP of the character and the full hp
		writeWord(HPString, imgx, imgy);

		//drawing the time bar
		ctx.fillStyle = '#000'

		ctx.lineWidth = '3';
		ctx.rect(imgx + 100, imgy, 100, 20);
		ctx.stroke();
		ctx.fillStyle = '#ffff00';

		// length of the bar
		const stats = playerStats[words[i]];
		const actionTime = stats['action time'];
		if (actionTime !== null) {
			const now = Date.now() / 1000;
			let timeLeft = actionTime - now;
			if (timeLeft < 0)
				timeLeft = 0;
			const barLength = 100 /
				(10 - stats['SPD']) *
				((10 - stats['SPD']) - timeLeft);

			ctx.fillRect(imgx + 100, imgy, barLength, 20);
		}
	}
}
//called every 33millisecond
const mainloop = () => {
	if (battle === true) {
		// changing the button you are hovering on

		//if you dont move to a button, then you will return to the
		// last button you were on

		if (g_mousePos[0] < 0 || g_mousePos[1] < 0 || g_mousePos[1] >= buttonPos.length) {
			g_mousePos = lastPos;
		};

		drawBG();
		//if selects to do the action on the button
		//sees which button it's clicked
		if (g_buttonAction != 'none' && g_buttonAction != undefined) {
			handleAction(g_buttonAction, damage);
		}
		if (swordFrame > 15) {
			swordFrame = 0;
		}

		//checks on the player timer
		playerTimer();
		//checks on the enemy's timer
		enemyTimer();
	}
};

const handleAction = (buttonAction) => {
	if (buttonAction === 'attack') {
		if (enemy['HP'] <= 0) {
			battle = false;
			return;
		}
		writeWord(`${damage}`, 100, 250);

	}
	move = false;
}

const enemyAction = (buttonAction) => {
	if (buttonAction === 'attack') {
		if (playerStats['tee faa']['HP'] <= 0) {
			battle = false;
			return;
		}
		writeWord(`${damage}`, 800, 250);

	}
	move = false;
}

const writeWord = (word, posx, posy) => {
	for (i = 0; i < word.length; i++) {
		var letter = word.charAt(i);
		if (letter != ' ') {
			imgx = posx + (8 * i) * PX_NUM;
			imgy = posy;
			console.log(letter)
			ctx.drawImage(letterList[letter], imgx, imgy, 8 * PX_NUM, 8 * PX_NUM);
		}
	}
}

const playerTimer = () => {
	const actionTime = playerStats['tee faa']['action time'];
	if (actionTime !== null) {
		const now = Date.now() / 1000;
		let timeLeft = actionTime - now;
		if (timeLeft < 0) {
			move = true;
			waiting = false;
		}
	}
}

const enemyTimer = () => {
	const actionTime = enemy['action time'];
	const now = Date.now() / 1000;
	let timeLeft = actionTime - now;

	if (timeLeft <= 0) {
		setInterval(() => {
			enemy['action time'] = now + (10 - enemy['SPD']);
		}, 2000)
		enemyAction(enemy["AI"]()[0], enemy["AI"]()[1])
	}
}

startBattle();

// key down and keyup listeners
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

setInterval(mainloop, 33);
