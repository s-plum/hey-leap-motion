// declare dependencies
var Leap = window.Leap = require('leapjs');
var THREE = window.THREE = require('three');
	
require('../../node_modules/leapjs-plugins/main/bone-hand/leap.bone-hand');	
require('../../node_modules/leapjs-plugins/main/hand-hold/leap.hand-hold');
require('../../node_modules/leapjs-plugins/main/hand-entry/leap.hand-entry');	

var output = document.getElementById('output'),
	frameString = "",
	handString = "",
	fingerString = "",
	hand,
	finger,
	thumb,
	listening = false,
	options = {
		enableGestures: true
	},
	audio = document.getElementsByTagName('audio')[0];
	audio.volume = 0.5;

function concatData(id, data) {
	return id + ": " + data + "<br>";
}

function getFingerName(fingerType) {
	switch(fingerType) {
		case 0:
		  return 'Thumb';
		break;

		case 1:
		  return 'Index';
		break;

		case 2:
		  return 'Middle';
		break;

		case 3:
		  return 'Ring';
		break;

		case 4:
		  return 'Pinky';
		break;
	}
}
    
function concatJointPosition(id, position) {
	return id + ": " + position[0] + ", " + position[1] + ", " + position[2] + "<br>";
}

//Loop to get back frame data from the device
Leap.loop(options, function(frame) {
	handString = '';
	eventName = '';
	listening = false;
	frameString = concatData("frame_id", frame.id);
	frameString += concatData("num_hands", frame.hands.length);
	frameString += concatData("num_fingers", frame.fingers.length);
	frameString += "<br>";

	for (var i = 0, len = frame.hands.length; i < len; i++) {
        hand = frame.hands[i];
        thumb = hand.fingers[0];

        var eventName = '';
        var handY = hand.palmPosition[1];
        var thumbY = thumb.tipPosition[1];

		if (handY < thumbY && Math.abs(handY - thumbY) > 75 && Math.abs(thumb.direction[1]) > 0.65)
		{
			eventName = 'thumbsUp';
			audio.play();
		}
		else if (handY >= thumbY && Math.abs(thumb.direction[1]) > 0.65)
		{
			eventName = 'thumbsDown';
		}
		else if (hand.fingers[2].extended) {
			var extendedFingers = [];
			for (var j=0; j < hand.fingers.length; j++) {
				if (hand.fingers[j].extended) {
					extendedFingers.push(hand.fingers[j]);
				}
			}

			if (extendedFingers.length === 1) {
				eventName = 'flippedOff';
			}
			else if (extendedFingers.length === 5) {
				eventName = 'listening'
			}

			var isTheBird = true;
			for (var j=0; j < hand.fingers.length; j++) {
				if (j === 2 && !hand.fingers[j].extended || j !== 2 && hand.fingers[j].extended) {
					isTheBird = false;
					break;
				}
			}

			if (isTheBird) {
				eventName = 'flippedOff';
				audio.pause();
			}
			else {
				listening = true;
			}
		}

		handString += concatData('event_name', eventName);
		if (listening && Math.abs(hand.direction[1]) < 0.5) {
			//detect up and down motions
			handString += concatData('moving_x', Math.abs(hand.palmVelocity[0]) > 200);
			handString += concatData('moving_y', Math.abs(hand.palmVelocity[1]) > 200);
			handString += concatData('moving_z', Math.abs(hand.palmVelocity[2]) > 200);

			if (Math.abs(hand.palmVelocity[1]) > 200) {
				handString += concatData('velocity_y', hand.palmVelocity[1]);
				delta = 0.05;
				if (hand.palmVelocity[1] < 0) {
					delta = -0.05;
				}
				var newVolume = audio.volume + delta;
				if (newVolume > 0 && newVolume < 1) {
					audio.volume = newVolume;
				}
			}
		}

		frameString += handString;
    }

	output.innerHTML = frameString;
}).use('boneHand', {
	targetEl: document.body,
	arm: true
});