let fs = require ('fs');
let https = require ('https');
let subscriptionKey = '3dc0c7a09697463287d93fbab7f90dc3';
let host = 'api.cognitive.microsofttranslator.com';
let path = '/translate?api-version=3.0';
let params = '&to=en';

export default class Pacman {
	constructor() {
		this.name = 'pacman';
		this.spritesheets = {
			walk: {name: this.name + '_' + 'walk', path: 'assets/sprites/pacman/pacman_walk.png'},
			death: {name: this.name + '_' + 'death', path: 'assets/sprites/pacman/pacman_death.png'},
		};
		this.width = 32;
		this.height = 32;

		this.velocity = 200;

		this.sprite = null;

		this.directions = {up: 'UP', down: 'DOWN', right: 'RIGHT', left: 'LEFT', none: 'NONE'};
        this.turnDirection = this.directions.none;

        this.marker = {x: 336, y: 560};
        this.adjacentTiles = {};
        this.turnPoint = {};


        // Other
        this.score = 0;
	}
}

var _resetVelocity = function(entity) {
    entity.body.velocity.x = 0;
    entity.body.velocity.y = 0;
};

Pacman.prototype.setVelocity = function(velocity) {
	this.velocity = velocity;
}

Pacman.prototype.getVelocity = function() {
	return this.velocity;
}

Pacman.prototype.getSprite = function() {
	return this.sprite;
}

Pacman.prototype.eatPill = function(scoreText) {
	this.score++;
	scoreText.text = 'Score: ' + this.score;
}

Pacman.prototype.preload = function(game) {
	game.load.spritesheet(this.spritesheets.walk.name, this.spritesheets.walk.path, this.width, this.height);
    game.load.spritesheet(this.spritesheets.death.name, this.spritesheets.death.path, this.width, this.height);
}

Pacman.prototype.create = function(game) {
	this.sprite = game.add.sprite(this.marker.x, this.marker.y, this.spritesheets.walk.name, 0);
	this.sprite.anchor.set(0.5);
	this.sprite.angle = 0;
    this.sprite.animations.add(this.spritesheets.walk.name, null, 6, true);
    game.physics.arcade.enable(this.sprite);

    this.sprite.play(this.spritesheets.walk.name);
}

Pacman.prototype.move = function(direction) {
	switch (this.turnDirection) {
		case this.directions.up:
			_resetVelocity(this.sprite);
			this.sprite.angle = 270;
	    	this.sprite.body.velocity.y = -this.velocity;
			break;
		case this.directions.right:
			_resetVelocity(this.sprite);
			this.sprite.angle = 0;
	        this.sprite.body.velocity.x = this.velocity;
			break;
		case this.directions.down:
			_resetVelocity(this.sprite);
			this.sprite.angle = 90;
	        this.sprite.body.velocity.y = this.velocity;
			break;
		case this.directions.left:
			_resetVelocity(this.sprite);
			this.sprite.angle = 180;
	        this.sprite.body.velocity.x = -this.velocity;
			break;
	}
}

Pacman.prototype.checkDirection = function(direction, game) {

	if (this.turnDirection == direction) {
		return;
	} else if (this.adjacentTiles[direction] == null) {
		return;
	} else if (this.adjacentTiles[direction].collides) {
		return;
	}

	this.turning = direction;

    this.turnPoint.x = (this.marker.x * this.width) + (this.width / 2);
    this.turnPoint.y = (this.marker.y * this.height) + (this.height / 2);

    if (game.math.fuzzyEqual(this.sprite.x, this.turnPoint.x, 6) ||
    	game.math.fuzzyEqual(this.sprite.y, this.turnPoint.y, 6)) {

    	this.turnDirection = direction;

    	this.sprite.x = this.turnPoint.x;
		this.sprite.y = this.turnPoint.y;

		this.sprite.body.reset(this.turnPoint.x, this.turnPoint.y);

		this.move(this.turning);

		this.turning = this.directions.none;
    }
}

Pacman.prototype.handleInput = function(game) {
	let language = document.getElementById("selectLang").value
	const SpeechRecognition = webkitSpeechRecognition
	const SpeechGrammarList = webkitSpeechGrammarList
	const SpeechRecognitionEvent = webkitSpeechRecognitionEvent

	let diagnostic = document.querySelector('.output')

	const testBtn = document.querySelector('button')

	const controls = ['up', 'down', 'left', 'right', 'restart']
	const grammar = 'JSGF V1.0; grammar controls; public <control> = ' + controls.join(' | ') + ' ;'

	const recognition = new SpeechRecognition();
	const speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList
	recognition.continuous = true;
	recognition.lang = language;
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;

	recognition.onresult = (event) => {
		let last = event.results.length - 1;
		let control = event.results[last][0].transcript;
		control = control.trim();

		diagnostic.textContent = 'Command received: ' + control.toUpperCase();

		console.log('Confidence: ' + event.results[0][0].confidence)

		let response_handler = function (response) {
			let body = '';
			response.on('data', function (d) {
				body += d;
			});
			response.on('end', function () {
				let json = JSON.stringify(JSON.parse(body), null, 4);
				console.log('am i here?', json);
				const translated = JSON.parse(body)[0].translations[0].text.toLowerCase()
				console.log('translated?????', translated)
			});
			response.on('error', function (e) {
				console.log('Error: ' + e.message);
			});
		};

		let get_guid = function () {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}

		let Translate = function (content) {
			let request_params = {
				method : 'POST',
				hostname : host,
				path : path + params,
				headers : {
					'Content-Type' : 'application/json',
					'Ocp-Apim-Subscription-Key' : subscriptionKey,
					'X-ClientTraceId' : get_guid (),
				}
			};

			let req = https.request(request_params, response_handler);

			req.write(content);
			req.end();
		}

		let content = JSON.stringify([{'Text': control}]);
		console.log('content', JSON.parse(content)[0].Text)

		Translate(content);

		if (control === 'up') {
			this.checkDirection(this.directions.up, game);
		} else if (control === 'down') {
			this.checkDirection(this.directions.down, game);
		} else if (control === 'right') {
			this.checkDirection(this.directions.right, game);
		} else if (control === 'left') {
			this.checkDirection(this.directions.left, game);
		} else if (control === 'restart') {
			location.reload(true)
		}
	}

	recognition.onstart = (event) => {
		console.log('SpeechRecognition.onstart')
	}
	recognition.onaudiostart = (event) => {
		console.log('SpeechRecognition.onaudiostart')
	}

	recognition.onsoundstart = (event) => {
		console.log('SpeechRecognition.onsoundstart')
	}

	recognition.onspeechstart = (event) => {
		console.log('SpeechRecognition.onspeechstart')
	}

	// recognition.onresult happens here

	recognition.onspeechend = () => {
		console.log('SpeechRecognition.onspeechend')
	}

	recognition.onsoundend = (event) => {
		console.log('SpeechRecognition.onsoundend')
	}

	recognition.onaudioend = (event) => {
		console.log('SpeechRecognition.onaudioend')
	}

	recognition.onend = (event) => {
		console.log('SpeechRecognition.onend')
	}

	recognition.onerror = (event) => {
		console.log('ERROR!!!!!')
		diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
	}

	recognition.onnomatch = (event) => {
		diagnostic.textContent = "I didn't recognise that control.";
		console.log('SpeechRecognition.onnomatch')
	}

	testBtn.onclick = () => {
		recognition.start();
		console.log('Ready to receive voice command.');
	}
}

Pacman.prototype.getAdjacentTiles = function(game) {
	this.marker.x = game.math.snapToFloor(Math.floor(this.sprite.x), this.width) / this.height;
	this.marker.y = game.math.snapToFloor(Math.floor(this.sprite.y), this.width) / this.height;

	var i = game.wall_layer.index;
	var x = this.marker.x;
	var y = this.marker.y;

	this.adjacentTiles[this.directions.left] = game.map.getTileLeft(i, x, y);
	this.adjacentTiles[this.directions.right] = game.map.getTileRight(i, x, y);
	this.adjacentTiles[this.directions.up] = game.map.getTileAbove(i, x, y);
	this.adjacentTiles[this.directions.down] = game.map.getTileBelow(i, x, y);
}

Pacman.prototype.update = function(game) {
	this.getAdjacentTiles(game);
	this.handleInput(game);
}
