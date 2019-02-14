
const ctx = document.getElementById("main canvas").getContext("2d");

ctx.fillStyle = '#000';

const PX_NUM = 3;

// x and y of the button you are on
let g_mousePos = [0, 0];

//the position of the buttons(not on screen)
let g_buttonPos = [];
for (let c = 0; c < 3; c++) {
	g_buttonPos[c] = 'none';
}
//create buttons here 
g_buttonPos[0] = 'attack';
g_buttonPos[1] = 'defend';
g_buttonPos[2] = 'escape';

//the action that is going to be done after select the enemy
let g_selectedAction;

let g_win = false;

const BGsizeX = 1200;
const BGsizeY = 750;

//ENEMY DEATH ANIMATION FRAME NUMBER
let DeathFrame = 0;
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
const enemyDeath = document.getElementById('enemy death');

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
		'SPD': 3,
		//critical rate
		'CRT': null,
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
		'HP': 90,
		'FULL HP': 90,
		'ATK': 5,
		// chance of doging attacks
		'SPD': 3,
		//critical rate
		'CRT': null,
		//a function called every time 
		'AI': () => {
            return 'attack';
		},
		'status': null,
	},
	'shieldsmen': {
		'NAME': 'shieldsmen',
		//stats
		'HP': 120,
		'FULL HP': 120,
		'ATK': 3,
		// chance of doging attacks
		'SPD': 1,
		//critical rate
		'CRT': null,
		//a function called every time 
		'AI': () => {
            return 'attack';
		},
		'status': null,
	}
}

//current enemy you are fighting
let enemy;

const startBattle = () => {
	///setting up enemy timer.
	enemy = [];
	enemy.push(bestiary['swordsmen']);
	enemy.push(bestiary['shieldsmen']);
};

const endbattle = () => {
	//function called to reset things that changed for the next battle
	//resets enemy status
	for (i = 0; i < enemy.length; i++) {
		enemy[i]['status'] = null;
	}
	//resets player status
	for (i = 0; i < playerStats.length; i++) {

	}
};

//this does everything, because if done on key down, it will be called constantly
const handleKeyUp = e => {
	lastPos = [g_mousePos[0], g_mousePos[1]];

	//changing the position of the curor 
	if (currentKey['40']) g_mousePos[1] += 1;
	if (currentKey['37']) g_mousePos[0] -= 1;
	if (currentKey['38']) g_mousePos[1] -= 1;
	if (currentKey['39']) g_mousePos[0] += 1;

	//if the mouse is outside the button selection list
	if (g_mousePos[0] < 0 || g_mousePos[1] < 0) {
		g_mousePos = lastPos;
	}

	//if they select a move to use
	if (currentKey['83'] && BGstats === 'jonny action') {
		BGstats = 'select target';
		g_selectedAction = g_buttonPos[g_mousePos[1]]
	} else if (currentKey['83'] && BGstats === 'select target'){
		actionManagement(g_selectedAction, playerStats['jonny'], enemy[g_mousePos[1]]);
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
	// clear canvas
	//ctx.clearRect(0, 0, ctx.width, ctx.height);
	ctx.beginPath();

	//re filling background. 
	ctx.fillStyle = '#7c7c7c'
	ctx.fillRect(0, 0, BGsizeX, BGsizeY);
	ctx.lineWidth = '5';
	ctx.rect(0, 0, BGsizeX, BGsizeY);
	ctx.stroke();
	
	switch (BGstats) {
		case 'jonny attack':
			drawCharacterStats(['jonny'])
			drawCursor();
			drawCharacters(['jonny']);
			drawEnemies(enemy)
			// if it's player's trun and is attacking.
			if (g_DMG !== undefined && g_DMG !== null) {
				writeWord(`${g_DMG}`, 200 ,200);
			}

		break;

        case 'jonny action':
			drawButtons(playerStats['jonny']['abilities']);
			drawCharacterStats(['jonny']);
			drawCursor();
			drawCharacters(['jonny']);
			drawEnemies(enemy);
		break;
		
		case 'enemy attack':
			writeWord('hyaaaaaaa', 300, 300);

			drawCharacterStats(['jonny'])
			drawCursor();
			drawCharacters(['jonny']);
			drawEnemies(enemy);
			if (g_DMG !== undefined && g_DMG !== null) {
				writeWord(`${g_DMG}`, 200 ,200);
			}
		break;

		case 'select target':
			drawCharacterStats(['jonny'])
			drawCharacters(['jonny']);
			drawEnemies(enemy);
			drawCursor();
			
		break;

		case 'win':
			drawCharacterStats(['jonny'])
			drawCursor();
			drawCharacters(['jonny']);
            drawEnemies(enemy);
		    writeWord('yeeeeeeeeeeeeetus', 200 ,200);
			
		break;
	}

}

const drawCharacters = (characters) => {
	imgx = 800;
	imgy = 300;
	for (let i = 0; i < characters.length; i++) {

		// if the player is attacking	
		if (BGstats === 'jonny attack' && swordFrame !== -1) {
			imgx = 600;
			//making the player looks like he is swinging his sword
			if (swordFrame < 5) {
				ctx.drawImage(swordswing, 121 - (23 + 1) * (swordFrame + 1),
					1, 23, 23, imgx, imgy, 23 * PX_NUM, 23 * PX_NUM);
			} else {
				ctx.drawImage(swordswing , 1, 1, 23, 23, imgx, imgy, 23 * PX_NUM, 23 * PX_NUM);
			}
			// drawing the sword
			imgx -= 16 * PX_NUM;
			imgy += 10 * PX_NUM;
			ctx.drawImage(sword, 1, ((16 * swordFrame) + (1 * (swordFrame + 1))),
				16, 16, imgx, imgy, 16 * PX_NUM, 16 * PX_NUM);
			swordFrame += 1;

			return;
		} else {
			
			//when it's waiting for his or her turn
			ctx.drawImage(stand_jonny, imgx, imgy, 16 * (PX_NUM), 23 * (PX_NUM));
			ctx.drawImage(shield, 0, 0, 6, 18, imgx - (10 * PX_NUM), imgy + (5 * PX_NUM)
				, 8 * PX_NUM, 16 * PX_NUM);
		}
		
	}
}

const drawEnemies = (enemies) => {
	//conditions is are status like blind, slilent, or death.
	imgx = 100;
	imgy = 300;

	for (let i = 0; i < enemies.length; i++) {
		// if it has any positive or negative status.
		status = enemies[i]['status'];

		switch(status) {
			case 'death':
				//if the animation is done
				if (DeathFrame >= 7) {
					return;
				}
				ctx.drawImage(enemyDeath,(DeathFrame*26),0,26,27, imgx, imgy, 26 * PX_NUM, 27 * PX_NUM);

				DeathFrame += 1;

                return;
			break;
		}
		if (BGstats === 'enemy attack' && swordFrame !== -1) {
			imgx = 100 + (10*swordFrame);
			//making the enemy is stabing the player
			ctx.drawImage(swordsmen, imgx, imgy, 32 * PX_NUM, 30 * PX_NUM);
            swordFrame += 1;
			return;
		} else {
			//changing the position for every enemy there images
			imgy += 100 * i;
			//getting the image of the enemy
			img = enemyImages[enemies[i]['NAME']];
			ctx.drawImage(img, imgx, imgy, 32 * PX_NUM, 30 * PX_NUM);
		}
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
const drawCursor = () => {
	imgx = 170 + (200 * g_mousePos[0])
	imgy = 525 + (80 * g_mousePos[1]);
	if (BGstats === 'select target') {
		console.log("a;kdsjfa;skjfa;skdjfa;klsdfj");
		imgx = 200;
		imgy = 300 + (100 * g_mousePos[1]);
		//because the way enemies are lined out, two in the front three in the back
		// when you want to select the fornt ones, you press down till you select them
		if (g_mousePos[1] > 3) {
			imgx = 200;
			imgy = 250 + (100 * g_mousePos[1]-3);
		}
	}
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
		ctx.stroke();

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
	//if you win, there is no point of fighting
	if (g_win) {        
		BGstats = 'win';
		drawBG();
		return;
	}
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
	// if it is time to do the next turn and you didn't win
	if (g_doAction === true) {
		turnManagement();
	}

	if (swordFrame >= 7) {
		swordFrame = -1;
	}

	drawBG();
}

const turnManagement = () =>{
	// if it is the player's turn, then draw the action buttons.
	if (g_turnList[0] !== 'enemy') {
  
		BGstats = `${g_turnList[0]} action`;

	} else {
		// if is enemy's move
		BGstats = 'enemy attack';
        actionManagement(enemy[0]['AI'](), enemy[0], playerStats['jonny']);
	}
	g_doAction = false;
}

const actionManagement = (action, attacker, victim) => {
	switch (action) {
		//if they chose to attack
		case 'attack': 
		    const ATK = attacker['ATK'];
			g_DMG = Math.floor((Math.random() *(ATK + 0.99)) + (ATK*5));
			victim['HP'] -= g_DMG;
			//if you defeated the enemy
			if (attacker === playerStats['jonny']) BGstats = 'jonny attack';

			if (victim['HP'] <= 0) {

				if (attacker === playerStats['jonny'] && enemy.length === 0) {
					// if you win you gotta let it looks like you killed it not instantly kaboom!
					setTimeout(()=> {
						g_win = true;
						victim['status'] = 'death';
						endbattle();
					}, 2000);
				} else {

				}
			}		
			swordFrame = 0;
		break;
	}
	setTimeout(() => {
		//lets next person attack
		g_turnList.shift();
		//resets the damage,
		// VERY IMPORTANT, DO NOT DELETE
		g_DMG = null;
		// allows the player to move on to the next player/
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
setInterval(mainLoop, 100);