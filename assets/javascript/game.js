/**
 * Program: game.js
 * Created: 08/19/2016 by Matt Holland
 * Located: desktop/bootcamp/homework/week-4-game/assets/javascript
 * Purpose: Provide gameplay code for 4th assignment - Star Wars RPG
 */

// Establish main game object, to contain all game properties and functions
var game = {
	// The master array of all possible characters (8), stored as objects
	masterCharacterArray: [

		{
			name: "Jabba The Hut",
			visual: "assets/images/characters/jabba.jpg",
			healthPoints: 195,
			attackPower: 10,
			counterAttackPower: 7
		},

		{
			name: "Yoda",
			visual: "assets/images/characters/yoda.jpg",
			healthPoints: 235,
			attackPower: 13,
			counterAttackPower: 26
		},

		{
			name: "Boba Fett",
			visual: "assets/images/characters/boba.jpg",
			healthPoints: 200,
			attackPower: 12,
			counterAttackPower: 10
		},

		{
			name: "Darth Maul",
			visual: "assets/images/characters/darth-maul.jpg",
			healthPoints: 220,
			attackPower: 9,
			counterAttackPower: 10
		},

		{
			name: "General Grievous",
			visual: "assets/images/characters/grievous.jpg",
			healthPoints: 210,
			attackPower: 11,
			counterAttackPower: 18
		},

		{
			name: "Maz Kanata",
			visual: "assets/images/characters/maz.jpg",
			healthPoints: 180,
			attackPower: 11,
			counterAttackPower: 14
		},

		{
			name: "Darth Vader",
			visual: "assets/images/characters/vader.jpg",
			healthPoints: 240,
			attackPower: 15,
			counterAttackPower: 24
		},

		{
			name: "Luke Skywalker",
			visual: "assets/images/characters/luke.jpg",
			healthPoints: 195,
			attackPower: 15,
			counterAttackPower: 30
		}
	],
	// Array containing a single object, representing the character you chose
	yourCharacterArray: [],

	// Array of enemy character objects, displayed in the Select An Opponent To Attack section
	enemiesAvailableArray: [],

	// Array containing a single object, representing the enemy you chose
	yourEnemyArray: [],

	// Store two currently battling character objects in an array, for ease of display
	currentBattleArray: [],

	// Store temp value of protagonist's attackPower for use during battle.
	// Note: during gameply, original "attackPower" will stay fixed until game over
	// "yourTempAttackPower" will increase by base "attackPower" on each attack button click
	yourTempAttackPower: 0,

	// Set initial attack click to true.  Determines the setting of your temp attack power.  When false, does not reassign value (only increments)
	// Note: ONLY use inside of attack button click handler
	initialAttackClick: true,

	// Set the attack mode to false at initialization.  Will determine append instructions during battleplay.
	// If false, disallows any append action when enemy img is clicked.  If true, allows append instruction to follow enemy img click
	attackActiveMode: false,

	// This will be used in conjunction with attackActiveMode to determine the append instructions when selecting another enemy
	enemyAlreadyDefeated: false,

	// This will be used to determine action for Attack button click. If defeatActiveMode == true, then an enemy has just been defeated,
	// disallowing any click to affect health points.  Reset to false inside of div#enemy-character click when a new enemy has been selected
	// so that attack button may be used again
	defeatActiveMode: false,

	// Keep track of enemies defeated, so that you know when your character has won if total == length of enemiesAvailableArray
	// Value will be incremented in main program code, after an enemy has been defeated
	enemiesDefeatedCount: 0,

	// Store all miscellaneous game noises (button clicks, character selection, etc) in an array as objects so html can be generated dynamically
	miscSoundArray: [
		{
			src: "assets/sounds/misc_sounds/button_click.mp3",
			audioId: "button-click"
		},

		{
			src: "assets/sounds/misc_sounds/character_select.mp3",
			audioId: "character-select"
		},

		{
			src: "assets/sounds/misc_sounds/enemy_select.mp3",
			audioId: "enemy-select"
		}
	],

	// Store all attack noises in an array as objects so html can be generated dynamically
	attackSoundArray: [

		{
			src: "assets/sounds/attack_sounds/clash1.wav",
			audioId: "clash1"
		},

		{
			src: "assets/sounds/attack_sounds/clash2.wav",
			audioId: "clash2"
		},

		{
			src: "assets/sounds/attack_sounds/clash3.wav",
			audioId: "clash3"
		},

		{
			src: "assets/sounds/attack_sounds/laser1.wav",
			audioId: "laser1"
		},

		{
			src: "assets/sounds/attack_sounds/saber1.wav",
			audioId: "saber1"
		},

		{
			src: "assets/sounds/attack_sounds/saber2.wav",
			audioId: "saber2"
		},

		{
			src: "assets/sounds/attack_sounds/hum1.wav",
			audioId: "hum1"
		}
	],

	// Generate <audio> html tags dynamically for game sound effects (attack sounds, character selecion, button clicks, etc)
	createAudioTags: function(id, array) {
		// Grab parent div
		var div = document.getElementById(id);
		// Generate all html audio tags for attack noises, from sound array
		array.forEach(function(object, i, arr) {
			// Create <audio> tag
			var audio = document.createElement("audio");
			audio.setAttribute("src", arr[i].src);
			audio.setAttribute("id", arr[i].audioId);
			// Append audio tag to div
			div.appendChild(audio);
		});
	},
	
	// Function to create section heading
	// Note: dataObj contains: parent_id, h3_text
	createSectionHeading: function(dataObj) {
		// Add new content to the your-character div.  First, get the parent element.
		var parent = document.getElementById(dataObj.parent_id);
		// First, add Your Character section
		var h3 = document.createElement("h3");
		// Create the text for the <h4>
		var text = document.createTextNode(dataObj.h3_text);
		// Append the <h4> to the div
		parent.appendChild(h3);
		// Put the text into the <h4>
		h3.appendChild(text);
	},

	// Function to dynamically create character list for each section
	// Note: dataObj contains: array, parent_id, ul_id, li_class, li_id, img_class, p1_class, p2_class, p2_id. li_id used for li class & id
	createCharacterList: function(dataObj) {
		this.log('dataObj: ' + dataObj);
		//var parent_id = dataObj.parent_id;
		// Get the parent div
		var parent = document.getElementById(dataObj.parent_id);
		// Now create the ul with class your-character
		var ul = document.createElement("ul");
		// Give the ul a class and id
		ul.setAttribute("class", dataObj.ul_id);
		ul.setAttribute("id", dataObj.ul_id);
		// Append the <ul> to the parent div
		parent.appendChild(ul);

		dataObj.array.forEach(function(object, i, arr) {
			// Create li tag for each object
			var li = document.createElement("li");
			// Add class li-character to each <li>
			li.setAttribute("class", dataObj.li_class);
			// Add dynamic id to each <li> for later click handling. Use class + number i to target items
			li.setAttribute("id", dataObj.li_id + i);
			// Append the <li> to the <ul>
			ul.appendChild(li);
			// Create an img tag
			var img = document.createElement("img");
			// Add class to image for bg color
			img.setAttribute("class", dataObj.img_class);
			// Create img src attribute
			img.setAttribute("src", arr[i].visual);
			// Create img alt attribute
			img.setAttribute("alt", arr[i].name);
			// Create a <p> element
			var p = document.createElement('p');
			// Add a class to the p element
			p.setAttribute("class", dataObj.p1_class);
			// Create a text node for inserting text into the <li>
			var text = document.createTextNode(arr[i].name);
			// Append the <p> to the <li>
			li.appendChild(p);
			// Insert the text node into the <li>
			p.appendChild(text);
			// Insert the img tag inside of the <li> tag
			li.appendChild(img);
			// Create another <p> element for display of character health
			var p = document.createElement('p');
			// Add a class to the p element
			p.setAttribute("class", dataObj.p2_class);
			// Add an id to the p element for easy targeting of healthPoints
			p.setAttribute("id", dataObj.p2_id);
			// Create a node for the health text
			var text = document.createTextNode(arr[i].healthPoints);
			// Append the new p element to the <li>
			li.appendChild(p);
			// Append the health text to the <li> element
			p.appendChild(text);
		});
	},

	// Method to initialize all bg music, based on game phase
	initializeBgMusic: function(id) {
		// First, make sure the main bg music and/or battle music is paused
		var mainTheme = document.getElementById("main-theme");
		var battleTheme = document.getElementById("battle-theme");
		var playMusic = document.getElementById(id);
		mainTheme.pause();
		battleTheme.pause();
		// Play the requested sound file
		playMusic.play();
	},

	// Method to initialize main gameplay sounds (clicks, character select, etc)
	initializeMiscSound: function(id) {
		// Get the audio tag
		var audio = document.getElementById(id);
		// Now issue instruction to play the audio file
		audio.play();
	},

	// Insert character attack power content on left side panel
	insertAttackPowerDisplay(dataObj) {
		var parent = document.getElementById(dataObj.id);
		var p = document.createElement("p");
		p.setAttribute("class", dataObj.style);
		var text = document.createTextNode(dataObj.text);
		parent.appendChild(p);
		p.appendChild(text);
	},

	// Create the attack button section right above the battle area
	createAttackSection(dataObj) {
		var parent = document.getElementById(dataObj.id);
		var button = document.createElement('button');
		button.setAttribute("class", dataObj.classAttr);
		button.setAttribute("type", dataObj.typeAttr);
		button.setAttribute("id", dataObj.idAttr);
		var text = document.createTextNode(dataObj.buttonText);
		parent.appendChild(button);
		button.appendChild(text);
	},

	// When attack initiates, create random clash noise from array of audio files
	initializeAttackSound: function() {
		// Pick a random index from the attackNoiseIdArray
		var index = Math.floor(Math.random() * this.attackSoundArray.length);
		console.log("createBattleSounds index generated: " + index);
		// Now create id var to target audio tag
		var id = this.attackSoundArray[index].audioId;
		console.log("attack sound id chosen: " + id);
		var audio = document.getElementById(id);
		// Now issue instruction to play the audio file
		audio.play();
	},

	// Method to update character health point values on the screen
	// Note: dataObj contains the following: 'parentId', 'updateElement', 'elementIndex', 'healthPoints'
	updateHealthPoints: function(dataObj) {
		var parent = document.getElementById(dataObj.parentId);
		var p = parent.getElementsByTagName(dataObj.updateElement)[dataObj.elementIndex];
		p.innerHTML = dataObj.healthPoints;
	},

	// Function to console.log items
	log: function(msg) {
		console.log(msg + "\n");
	}
}

/* first program load list example */
$(document).ready(function() {

	// Include the backstretch plugin to make the background image fully responsive and rotating
	$.backstretch(
		[
  	      "assets/images/backgrounds/ship.jpg"     ,
  	      "assets/images/backgrounds/darth.jpg"    ,
  	  	  "assets/images/backgrounds/space.jpg"    ,
  	  	  "assets/images/backgrounds/troopers.jpg" ,
  	  	  "assets/images/backgrounds/woods.jpg"    ,
  	  	  "assets/images/backgrounds/desert.jpg"   ,
  	  	  "assets/images/backgrounds/space2.jpg"
  		], 

  		{
  			duration: 14000, 
  			fade: 1400
  		}
  	);

  	// Generate html attack audio tags
	game.createAudioTags("attack-noises", game.attackSoundArray);

	// Generate html misc sound audio tags
	game.createAudioTags("misc-noises", game.miscSoundArray);
	
	// Create section heading for beginning gameplay
	var dataObj = {  parent_id: "display-characters",  h3_text:   "Choose Your Character To Begin..." };
	game.createSectionHeading(dataObj);

	// Create select character list for beginning gameplay
	var dataObj = {
		array: game.masterCharacterArray,
		parent_id: "display-characters" ,
		ul_id: 	   "master-char-list"	,
		li_class:  "li-character"		,
		li_id:     "char"				,
		img_class: "bg-blue"			,
		p1_class:  "character-label"	,
		p2_class:  "character-health"   ,
		p2_id:     "character-health"
	}
	game.createCharacterList(dataObj);

	// When the user clicks a character, assign that character to them, and assign everyone else as enemies
	$('div#display-characters li').on('click', function(event) {
		// Initialize character select sound
		game.initializeMiscSound("character-select");

		// Set the character number based on the <li> id. Remove the words from the index number with slice()
		var index = $(this).attr('id').slice(-1);
		game.log('character index chosen: ' + index);

		// Assign your character to your array by accessing the index in the master array
		// Note: this is an array, and not an object, so that it may also be put through the loop function, for DRY purposes
		var pushObj = game.masterCharacterArray[index];

		// Push the character chosen onto your character array, and onto the current battle array (will be object)
		game.yourCharacterArray.push(pushObj);
		game.currentBattleArray.push(pushObj);

		// Set character initial temp attack power on first enemy selection. 
		// Will increment inside of attack handler each time the attack button is clicked. Note: DO NOT increment original attackPower
		game.yourTempAttackPower = game.yourCharacterArray[0].attackPower;

		// Remove the character selected from the master array, so that only the enemies remain
		game.masterCharacterArray.splice(index, 1);

		// Rename the resulting array to enemiesAvailableArray for visual purposes
		// Note: this will not create a copy of the original array; it will point
		// to the same location in memory.  Any alterations will also affect the original master array
		game.enemiesAvailableArray = game.masterCharacterArray;

		// Remove the original character list from the DOM, before adding new content.
		var el = document.getElementById("display-characters");
		el.parentNode.removeChild(el);

		// Create section heading for your character selection
		var dataObj = { parent_id: "display-protagonist",  h3_text:   "You Are Fighting As:" };
		game.createSectionHeading(dataObj);
	
		// Create select character list for your character selection
		var dataObj = {
			array: game.yourCharacterArray,
			parent_id: "display-protagonist",
			ul_id: 	   "your-character"		,
			li_class:  "li-your-character"	,
			li_id:     "yourchar"			,
			img_class: "bg-blue"			,
			p1_class:  "character-label"	,
			p2_class:  "character-health"   ,
			p2_id:     "character-health"
		}
		game.createCharacterList(dataObj);

		// Create section heading for enemy display
		var dataObj = {  parent_id: "display-enemies",  h3_text:   "Select An Opponent To Attack" };
		game.createSectionHeading(dataObj);
	
		// Create select character list from enemies
		var dataObj = {
			array: game.enemiesAvailableArray,
			parent_id: "display-enemies"	 ,
			ul_id: 	   "enemy-character"	 ,
			li_class:  "li-enemy-character"	 ,
			li_id:     "enemy"			 	 ,
			img_class: "bg-red"				 ,
			p1_class:  "character-label"	 ,
			p2_class:  "character-health"    ,
			p2_id:     "character-health"
		}
		game.createCharacterList(dataObj);
	});

	// When the user chooses an enemy, assign it to the defender array
	//$('div#display-enemies li').on('click', function(event) {
	$(document.body).on('click', 'div#display-enemies li', function(event) {

		// Set the character number based on the <li> id. Will always match position, as html is created dynamically from the array itself.
		// Use slice to remove the words before the index number, for later use of index position
		var index = $(this).attr('id').slice(-1);

		// Assign character to defender array by accessing the index in the enemy array
		var pushObj = game.enemiesAvailableArray[index];

		// If haven't attacked anybody yet, and thus no enemy has been defeated, append new content etc
		if(!game.attackActiveMode && !game.enemyAlreadyDefeated) {
			// Initialize enemy select sound
			game.initializeMiscSound("enemy-select");

			// Pause the background music and initialize battle music when user selects first enemy
			game.initializeBgMusic("battle-theme");

			// Set defeat active mode to false so that the attack button may be clicked after this code runs
			game.defeatActiveMode = false;

			// Push the character chosen onto defender character array, and current battle array (will be objects)
			game.yourEnemyArray.push(pushObj);
			game.currentBattleArray.push(pushObj);
			
			// Remove the character selected from the enemies available list
			// Note: there will always only be one of these ul's, using index 0
			var ul = document.getElementsByClassName("enemy-character")[0];
			var li = document.getElementById("enemy" + index);
			ul.removeChild(li);

			// Insert attack power display content for both characters into the side area.
			// First create your character stats
			var dataObj = { id: "attack-power-you", style: "text-yellow", text: "Your attack power: " + game.yourTempAttackPower };
			game.insertAttackPowerDisplay(dataObj);
	
			// Now create enemy character stats
			var dataObj = { id: "attack-power-enemy", style: "text-yellow", text: "Counter attack power: " + game.yourEnemyArray[0].counterAttackPower };
			game.insertAttackPowerDisplay(dataObj);

			// Insert content into the attack section (button etc)
			var dataObj = { id: "attack-section", classAttr: "btn btn-warning", typeAttr: "button", idAttr: "attack-button", buttonText: "Attack Now!" };
			game.createAttackSection(dataObj);

			// Now display the defender under your character display, on left of screen in the #display-defender <aside>
			// Create section heading for enemy display
			var dataObj = {  parent_id: "display-defender",  h3_text:   "Your Opponent Is:" };
			game.createSectionHeading(dataObj);
		
			// Create enemy display list from enemies
			var dataObj = {
				array: game.yourEnemyArray,
				parent_id: "display-defender"	  ,
				ul_id: 	   "defender-character"	  ,
				li_class:  "li-defender-character",
				li_id:     "defender"			  ,
				img_class: "bg-black"			  ,
				p1_class:  "character-label"	  ,
				p2_class:  "character-health"     ,
				p2_id:     "character-health"
			}
			game.createCharacterList(dataObj);
	
			// Create section heading for battleground display
			var dataObj = {  parent_id: "battle-ground",  h3_text:   "Battleground"  };
			game.createSectionHeading(dataObj);
		
			// Create character display list for battleground
			var dataObj = {
				array: game.currentBattleArray	  ,
				parent_id: "battle-ground"	  	  ,
				ul_id: 	   "battle-character"	  ,
				li_class:  "li-battle-character"  ,
				li_id:     "battle"				  ,
				img_class: "bg-blue"			  ,
				p1_class:  "character-label"	  ,
				p2_class:  "character-health"     ,
				p2_id:     "character-health"
			}
			game.createCharacterList(dataObj);
	
			// Now change the background color of the second li-battle-character to match enemy color. Will always be in 2nd position (1)
			var li = document.getElementsByClassName("li-battle-character")[1];
			var img = li.children[1];
			img.setAttribute("class", "bg-black");
	
			// Now set the game attackMode state to true, so that content is replaced instead of appended the next time an enemy is selected
			game.attackActiveMode = true;

		} else if (game.attackActiveMode && game.enemyAlreadyDefeated) {
			// Initialize enemy select sound
			game.initializeMiscSound("enemy-select");

			// Set defeat active mode to false so that the attack button may be clicked after this code runs
			game.defeatActiveMode = false;

			// If attack mode has been initialized, and an enemy has been defeated, replace old enemy content with new enemy content
			var ul = document.getElementsByClassName("enemy-character")[0];
			var li = document.getElementById("enemy" + index);
			ul.removeChild(li);

			// Next, replace defender and battle enemy character array elements with new enemy character selected
			game.yourEnemyArray.splice(0, 1, pushObj);
			game.currentBattleArray.splice(1, 1, pushObj);

			// Note: If it is the last battle, remove #display-enemies div, #left-divide-section, and #display-defender divs.
			// Only want to show your character and the battleground, so that display does not get messed up
			// Last battle can be identified by enemiesDefeatedCount
			if(game.enemiesDefeatedCount == (game.enemiesAvailableArray.length - 1)) {
				var parent = document.getElementById("display-enemies");
				parent.innerHTML = "";

				var parent = document.getElementById("attack-power-enemy");
				parent.innerHTML = "";

				var parent = document.getElementById("display-defender");
				parent.innerHTML = "";

				// Empty the #battle-ground content to make room for new content
				var parent = document.getElementById("battle-ground");
				parent.innerHTML = "";

				// Now update the battle ground to "Last Battle!"
				var dataObj = {  parent_id: "battle-ground",  h3_text:   "Last Battle!" };
				game.createSectionHeading(dataObj);
			
				// Now create character display list for battleground area
				var dataObj = {
					array: game.currentBattleArray	  ,
					parent_id: "battle-ground"	  	  ,
					ul_id: 	   "battle-character"	  ,
					li_class:  "li-battle-character"  ,
					li_id:     "battle"			      ,
					img_class: "bg-blue"			  ,
					p1_class:  "character-label"	  ,
					p2_class:  "character-health"     ,
					p2_id:     "character-health"
				}
				game.createCharacterList(dataObj);
			} else {

				// Empty the #display-defender content to make room for new content
				var parent = document.getElementById("display-defender");
				parent.innerHTML = "";
	
				// Empty the #battle-ground content to make room for new content
				var parent = document.getElementById("battle-ground");
				parent.innerHTML = "";
	
				// Now update left enemy area display with new content
				var dataObj = {  parent_id: "display-defender",  h3_text:   "Your Opponent Is:" };
				game.createSectionHeading(dataObj);
			
				// Create enemy display list from enemy array
				var dataObj = {
					array: game.yourEnemyArray,
					parent_id: "display-defender"	  ,
					ul_id: 	   "defender-character"	  ,
					li_class:  "li-defender-character",
					li_id:     "defender"			  ,
					img_class: "bg-black"			  ,
					p1_class:  "character-label"	  ,
					p2_class:  "character-health"     ,
					p2_id:     "character-health"
				}
				game.createCharacterList(dataObj);

				// Now update enemy counter attack stats
				var parent = document.getElementById("attack-power-enemy");
				var p = parent.getElementsByTagName('p')[0];
				p.innerHTML = "Counter attack power: " + game.yourEnemyArray[0].counterAttackPower;
	
				// Now update battle display heading
				var dataObj = { 
					parent_id: "battle-ground", 
					h3_text:   "Battleground" 
				};
				game.createSectionHeading(dataObj);
			
				// Now create character display list for battleground area
				var dataObj = {
					array: game.currentBattleArray	  ,
					parent_id: "battle-ground"	  	  ,
					ul_id: 	   "battle-character"	  ,
					li_class:  "li-battle-character"  ,
					li_id:     "battle"			      ,
					img_class: "bg-blue"			  ,
					p1_class:  "character-label"	  ,
					p2_class:  "character-health"     ,
					p2_id:     "character-health"
				}
				game.createCharacterList(dataObj);
			}

			// Now change the background color of the second li-battle-character to match enemy color. Will always be in 2nd position (1)
			var li = document.getElementsByClassName("li-battle-character")[1];
			var img = li.children[1];
			img.setAttribute("class", "bg-black");

			// Set enemy already defeated back to false so that this append code does not run again (you are in an active fight)
			game.enemyAlreadyDefeated = false;
		
		} else {
			// If an attack is not in progress, and no character has recently been defeated (including you), do nothing on enemy image click
			alert("Sorry, but you can't run away from your fight! \nYou gotta finish to defend your rep, man!");
			console.log("entered enemy image click else statement");
		}
	});

	$('div#attack-section').on('click', 'button#attack-button', function(event) {

		// If enemy was just defeated, and a new enemy has not yet been selected, do not allow attack button to do anything
		if(game.defeatActiveMode) {
			alert("You can't attack without an opponent, knucklehead.  \nPlease select another!");
			console.log("Entered false return of attack button, since defeatActiveMode == true");
			return false;
		}

		// Generate an attack noise
		game.initializeAttackSound();

		// Set var you == your character, and var enemy == your enemy, for ease of access
		var your = game.yourCharacterArray[0];
		var enemy = game.yourEnemyArray[0];

		// Set your character's temp attack power == initial attack power for very first attack only (Note: will increment up as fights progress)
		// Note: your enemy's attack power will not increment during gameplay; yourTempAttackPower is just a copy of attackPower
		// PUT attack power inital append here.  later on, will be innterHTML instruction instead
		if(game.initialAttackClick) {
			// Now create the battle-feedback text for damage display. Need to put inside of function.
			var parent = document.getElementById("battle-feedback");
			var p = document.createElement("p");
			p.setAttribute("class", "text-green");
			parent.appendChild(p);
			p.innerHTML = "You attacked " + enemy.name + " for " + game.yourTempAttackPower + " damage. " + enemy.name + " retaliated for " + enemy.counterAttackPower + " damage.";
		} else {
			// Update battle feedback. <p> will always be index position 0
			var parent = document.getElementById("battle-feedback");
			var p = parent.getElementsByTagName("p")[0];
			p.innerHTML = "You attacked " + enemy.name + " for " + game.yourTempAttackPower + " damage. " + enemy.name + " retaliated for " + enemy.counterAttackPower + " damage.";
		
			// Update you attack power stats, before yourTempAttackPower is incremented (would be too high if not)
			// Do not do so for enemy; counter attack power never increases post enemy selection
			var parent = document.getElementById("attack-power-you");
			var p = parent.getElementsByTagName('p')[0];
			p.innerHTML = "Your attack power: " + game.yourTempAttackPower;
		}

		// Now reduce your health by your enemy's counter attack power
		your.healthPoints -= enemy.counterAttackPower;
		game.log("Your health was reduced by " + enemy.counterAttackPower + " points. \n Your health after attack: " + your.healthPoints);

		// Now reduce your enemy's health by your temp attack power. Must do so before incrementing temp attack power, else unfair for enemy!
		enemy.healthPoints -= game.yourTempAttackPower;
		game.log("Your enemy's health was reduced by " + game.yourTempAttackPower + " points.  \n Your enemy's health after attack: " + enemy.healthPoints);

		// Now increase your yourTempAttackPower by your attackPower base value
		game.yourTempAttackPower +=  your.attackPower;
		game.log("Your temp attack power after attack: " + game.yourTempAttackPower);

		// Now update your health inside of the left character display area
		var dataObj = { parentId: "display-protagonist", updateElement: "p", elementIndex: 1, healthPoints: your.healthPoints };
		game.updateHealthPoints(dataObj);

		// Now update your health inside of the battle area
		var dataObj = { parentId: "battle-ground", updateElement: "p", elementIndex: 1, healthPoints: your.healthPoints };
		game.updateHealthPoints(dataObj);

		// Now update enemy's health inside of the left character display area, only if it is not the last battle (div disappears at that point)
		if(game.enemiesDefeatedCount != game.enemiesAvailableArray.length - 1) {
			var dataObj = { parentId: "display-defender", updateElement: "p", elementIndex: 1, healthPoints: enemy.healthPoints }
			game.updateHealthPoints(dataObj);
		}

		// Now update the enemy's health inside of the battle area
		var dataObj = { parentId: "battle-ground", updateElement: "p", elementIndex: 3, healthPoints: enemy.healthPoints }
		game.updateHealthPoints(dataObj);

		// Now check health values, to see if anybody was defeated, or if fight needs to continue
		if(your.healthPoints > 0 && enemy.healthPoints <= 0) {
			// Increment the enemies defeated count by 1. Once it reaches same value as enemies available array, game is over.
			game.enemiesDefeatedCount += 1;

			// Only tell the player to select another enemy if he/she has not won the game yet
			var msg = (game.enemiesDefeatedCount == game.enemiesAvailableArray.length) ? "" : "Please select another enemy.";
			alert("Nice way to go for the juggular; you won the fight!\n" + msg);
			// You won the fight.  First, set enemy already defeated val to true. Will dictate handling of next enemy selection
			game.enemyAlreadyDefeated = true;

			// Set defeat active mode to true so that attack button doesn't do anything
			game.defeatActiveMode = true;
			
			// Now remove the enemies from the screen. Start with the battleground area enemy
			var ul = document.getElementById("battle-character");
			var li = ul.getElementsByTagName('li')[1]; // Enemy will always be 2nd
			ul.removeChild(li);

			// Alse remove enemy img and enemy label from left side area and replace with <p class="side-defeat-label"> DEFEATED! </p>
			// Note: ONLY do this if it is not the last battle (otherwise, content does not exist and an error will trigger), preventing game win
			if(game.enemiesDefeatedCount < (game.enemiesAvailableArray.length - 1)) {
				var li = document.getElementsByClassName("li-defender-character")[0]; // Will always be 1st, as is the only item in container
				var p1 = li.getElementsByTagName('p')[0];
				var text = document.createTextNode("DEFEATED!");
				var img = li.getElementsByTagName('img')[0];
				var p2 = li.getElementsByTagName('p')[1];
				p1.setAttribute("class", "side-defeat-label");
				p1.innerHTML = "";
				p1.appendChild(text);
				li.removeChild(img);
				li.removeChild(p2);
			}

			// Continue fighting by selecting another enemy (only if there are enemies left in the enemiesAvailableArray)
			if(game.enemiesDefeatedCount == game.enemiesAvailableArray.length) {
				// No more enemies left, so you won the game! Congrats!

				// First, remove page content and
				game.initializeBgMusic("win-theme");
				alert("Congratulations, you won the game! You are Jedi Master!");
				return false;
			}

		} else if (your.healthPoints <= 0 && enemy.healthPoints > 0) {
			// You lost the fight.  Game over!!
			// Set defeat active mode to true so that attack button doesn't do anything
			game.defeatActiveMode = true;
			game.initializeBgMusic("lose-theme");
			alert("You lost the game; you need to work on your Jedi Master skills!");

		} else if (your.healthPoints <= 0 && enemy.healthPoints <= 0) {
			// Your health and enemy's health when below 0. You both died, but one character died more than the other...
			// Set defeat active mode to true so that attack button doesn't do anything
			game.defeatActiveMode = true;
			var character = (your.healthPoints > enemy.healthPoints) ? "your enemy" : "you";
			alert("Game over!  You both died, but " + character + " died more!");
		} else {
			// All other combinations being exhausted, now the only option left is to continue fighting
			game.defeatActiveMode = false;
			game.attackActiveMode = true;
		}

		// Set initialAttackClick == false so that next time attack is clicked, temp attack power does not get reset to initial attack power value
		game.initialAttackClick = false;
	});
});