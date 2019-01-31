
const ctx = document.getElementById("main canvas").getContext("2d");

ctx.fillStyle = '#000';

const PX_NUM = 3;

// x and y of the button you are on
let g_mousePos = [0, 0];

let g_buttonAction = null;
//the position of the buttons(not on screen)
let g_buttonPos = [];
for (let c = 0; c < 3; c++) {
	g_buttonPos[c] = 'none';
}
//create buttons here 
g_buttonPos[0] = 'attack';
g_buttonPos[1] = 'defend';
g_buttonPos[2] = 'escape';

const BGsizeX = 1200;
const BGsizeY = 750;

// if it is time to do the next action.
let g_doAction = true;

// damage delt to all enemies, resets every time you attack
let g_DMG;
// staus of the background
let BGstats = 'none';

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

const stand_jonny = document.getElementById('player jonny');
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

// the order of attack, set in main loop, when 
let g_turnList = [];

// the attack multiplyer at the start
//method shown above, may change
//damage = (40+(Math.floor(ATK*Math.random()) * (ATK/10);
let damage;

// when this turns false, the battle ends
let battle = true;
//number of enemies in the battle
let enemyNum = 1;

//sw
let swordFrame = 0;

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
	'jonny': {
		'HP': 350,
		'FULL HP': 350,
		'MP': 0,
		'FULL MP': 0,
		'ATK': 10,
		//Chance of getting to attack first in a turn.
		'SPD': 2,
		//the moves Jonny can do
		'abilities': ['attack','defend','escape'],
		//the status it is on, if not, then set to none.
	}
}

//stats of all enemies in the game
const bestiary = {
	'swordsmen': {
		'NAME': 'swordsmen',
		//stats
		'HP': 150,
		'FULL HP': 150,
		'ATK': 7,
		'SPD': 3,
	}
}

//current enemy you are fighting
let enemy;

const startBattle = () => {
	///setting up enemy timer.
	enemy = bestiary['swordsmen'];
};

//this does everything, because if done on key down, it will be called constantly
const handleKeyUp = e => {
	lastPos = [g_mousePos[0], g_mousePos[1]];

	//changing the position of the curor 
	if (currentKey['40']) g_mousePos[1] += 1;
	if (currentKey['37']) g_mousePos[0] -= 1;
	if (currentKey['38']) g_mousePos[1] -= 1;
	if (currentKey['39']) g_mousePos[0] += 1;

	//if they select a move to use
	if (currentKey['83'] && BGstats !== 'enemy action') {
		actionManagement(g_buttonPos[g_mousePos[0]]);
		//make sure they don't chose a move again
		//which is done by not drawing buttons and changing
		//the BG stats
		BGstats = 'none';
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

let g_Move = [];

const drawBG = () => {
	//re filling background. 
	ctx.fillStyle = '#eeeeee'
	ctx.fillRect(0, 0, BGsizeX, BGsizeY);
	ctx.lineWidth = '5';
	ctx.rect(0, 0, BGsizeX, BGsizeY);
	ctx.stroke();
	
	switch (BGstats) {
		case 'none':
			drawCharacterStats(['jonny'])
			drawMouse();
			drawCharacters(['jonny']);
		break;

        case 'jonny action':
			drawButtons(playerStats['jonny']['abilities']);
			if (g_DMG !== null && g_DMG !== undefined) {

    			writeWord(g_DMG, 300, 300);
			}
			drawCharacterStats(['jonny']);
			drawMouse();
			drawCharacters(['jonny']);
		break;
		
		case 'enemy action':
			writeWord('hyaaaaaaa', 300, 300);

			drawCharacterStats(['jonny'])
			drawMouse();
			drawCharacters(['jonny']);
		    //drawEnemies([enemy]);
	}

}

const drawCharacters = (characters) => {
	imgx = 800;
	imgy = 300;
	for (let i = 0; i < characters.length; i++) {

		// if the player is attacking
		/*
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
			return;
		} 
		*/
		//when it's waiting for his or her turn
		ctx.drawImage(stand_jonny, imgx, imgy, 16 * (PX_NUM), 23 * (PX_NUM));
		ctx.drawImage(shield, 0, 0, 6, 18, imgx - (10 * PX_NUM), imgy + (5 * PX_NUM)
			, 8 * PX_NUM, 16 * PX_NUM);
		
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


		//writing the HP of the character and the full hp
		imgx = imgx + 150;
		imgy = imgy;
		HPString = `hp ${playerStats[words[i]]['HP']} / ${playerStats[words[i]]['FULL HP']}`;

		writeWord(HPString, imgx, imgy);

		//drawing mana/ full mana
		imgx = imgx + 150;
		imgy = imgy;
		HPString = `mp ${playerStats[words[i]]['MP']} / ${playerStats[words[i]]['FULL MP']}`;

		writeWord(HPString, imgx, imgy);
	}
}

const mainLoop = () => {
	console.log(BGstats);
	console.log(g_turnList);
	console.log(g_DMG);
	// if the turn has ended and needs to genrate a new order
	if (g_turnList.length === 0) {
		//for now it will be a player 60 and enemy 40 chance.
		// this is the percentage
		let Num = Math.floor(Math.random()*100);
		// change the 60 into the formula 
		if (Num <= 50) {
			g_turnList.push('jonny');
			g_turnList.push('enemy');
		} else {
			g_turnList.push('enemy');
			g_turnList.push('jonny');
		}
	}
	if (g_doAction === true) {
		turnManagement();
	}
	drawBG();
	// if it's player's trun and is attacking.
	if (BGstats === 'none' && g_DMG !== undefined && g_DMG !== null) {
		writeWord(g_DMG, 200 ,200);
	}

}

const turnManagement = () =>{
	// if it is the player's turn, then draw the action buttons.
	if (g_turnList[0] !== 'enemy') {
  
		BGstats = `${g_turnList[0]} action`;

	} else {
		// if is enemy's move
		BGstats = 'enemy action';

		setTimeout(() => {
			g_turnList.shift();
			g_doAction = true;
		}, 3000);
	}
	g_doAction = false;
}

const actionManagement = (action) => {
	g_buttonAction = action;
	switch (action){
		//if they chose to attack
		case 'attack':
		    g_DMG = 30;
			enemy['HP'] -= g_DMG;
		break;
	}
	setTimeout(() => {
		//stops it from attacking
		g_buttonAction = null;
		//lets next person attack
		g_turnList.shift();
		//resets the damage,
		// VERY IMPORTANT, DO NOT DELETE
		g_DMG = null;
		// allows the player to move on to the next player/ enemy
		g_doAction = true;
	},2000);
}
const writeWord = (word, posx, posy) => {
	for (i = 0; i < word.length; i++) {
		var letter = word.charAt(i);
		if (letter != ' ') {
			imgx = posx + (8 * i) * PX_NUM;
			imgy = posy;
			ctx.drawImage(letterList[letter], imgx, imgy, 8 * PX_NUM, 8 * PX_NUM);
		}
	}
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

startBattle();
setInterval(mainLoop, 33);