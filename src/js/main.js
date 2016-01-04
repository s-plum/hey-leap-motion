// create playlist class

function Playlist() {
  this.songs = [];
  this.nowPlayingIndex = 0;
}

Playlist.prototype.add = function(song) {
  this.songs.push(song);
};

Playlist.prototype.play = function() {
  var currentSong = this.songs[this.nowPlayingIndex];
  currentSong.play();
};

Playlist.prototype.stop = function(){
  var currentSong = this.songs[this.nowPlayingIndex];
  currentSong.stop();
};

Playlist.prototype.next = function() {
  this.stop(); 
  this.nowPlayingIndex++;
  if(this.nowPlayingIndex === this.songs.length){
    this.nowPlayingIndex = 0;
  }
  this.play();
  this.renderInElement(player, list);
};

Playlist.prototype.prev = function() {
  this.stop(); 
  this.nowPlayingIndex--;
  if(this.nowPlayingIndex < 0){
    this.nowPlayingIndex = 0;
  }
  this.play();
  this.renderInElement(player, list);
};

Playlist.prototype.renderInElement = function(player, list) {
  player.innerHTML = "";
  list.innerHTML = "";
  var html = '<audio id="audio" autoplay="true" preload="auto" tabindex="0" controls="" >';
  html += '<source src="/audio/';
  html += this.songs[this.nowPlayingIndex].file;
  html += '" type="audio/mp3"/></audio>';
  player.innerHTML = html;
  for(var i = 0; i < this.songs.length; i++){
    var song = this.songs[i];
    list.innerHTML += song.toHTML();
  };
};



// create song class


function Song(title, artist, file) {
  this.title = title;
  this.artist = artist;
  this.file = file;
  this.isPlaying = false;
}


Song.prototype.play = function() {
  this.isPlaying = true;
};

Song.prototype.stop = function() {
  this.isPlaying = false;
};

Song.prototype.toHTML = function() {
  var htmlString = "<li";
  if(this.isPlaying){
    htmlString += " class='current'";
  }
  htmlString += ">";
  htmlString += this.title + " - " + this.artist + "</li>";
  
  return htmlString;
};




// generate playlist


var playlist = new Playlist();


var superFreak = new Song("Super Freak", "Rick James", "super_freak.mp3");
var tooYoung = new Song("Too Young", "Phoenix", "too_young.mp3");
var dancingQueen = new Song("Dancing Queen", "Abba", "dancing_queen.mp3");
var gimmeTwice = new Song("Gimme Twice", "The Royal Concept", "gimme_twice.mp3");
var bohemianRhapsody = new Song("Bohemian Rhapsody", "Queen", "bohemian_rhapsody.mp3");

playlist.songs.push(superFreak,tooYoung, dancingQueen, gimmeTwice, bohemianRhapsody);

var list = document.getElementById("list");
var player = document.getElementById("player");
playlist.renderInElement(player, list);

//variables for swipe delay
var justSwiped = false;
var swipeDelayTime = 60;
var timeSinceSwipe = 0;
var currentIndex = 0;




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
	listening = true;
	frameString = concatData("frame_id", frame.id);
	frameString += concatData("num_hands", frame.hands.length);
	frameString += concatData("num_fingers", frame.fingers.length);
	frameString += "<br>";

	for (var i = 0, len = frame.hands.length; i < len; i++) {
        hand = frame.hands[i];
        thumb = hand.fingers[0];



        /*
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
		*/

		frameString += concatData("grabStrength",hand.grabStrength);
		frameString += concatData("hand Roll", hand.roll());
		if (hand.grabStrength > .8 && hand.palmVelocity[2] < 200)
		{
			if (!audio.paused)
			{
				audio.pause();
				listening = false;
			}
		} else if (hand.grabStrength < .2 && hand.palmVelocity[2] < 200)
		{
			if (audio.paused)
			{
				audio.play();
				listening = true;
			}
		}

		frameString += concatData("Current Swipe Index",currentIndex);
		 if (frame.gestures.length > 0) {
		    for (var i = 0; i < frame.gestures.length; i++) {
		      var gesture = frame.gestures[i];
		      if(gesture.type == "swipe" && !justSwiped) {
		          //Classify swipe as either horizontal or vertical
		          var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
		          //Classify as right-left or up-down
		          if(isHorizontal){
		              if(gesture.direction[0] > 0){
		              	  swipeDirection = "right";
		                  playlist.next();
		                  console.log(swipeDirection);
		                  currentIndex ++;
		              } else {
		                  swipeDirection = "left";
		             	  playlist.prev();
		                  console.log(swipeDirection);
		                  currentIndex --;
		              }
		          } else { //vertical
		              if(gesture.direction[1] > 0){
		                  swipeDirection = "up";
		              } else {
		                  swipeDirection = "down";
		              }                  
		          }

		          justSwiped = true;  
		       } else 
		       {
			       	if (justSwiped)
			  		{
			  			timeSinceSwipe ++;
			  			frameString += concatData("Time since Swipe", timeSinceSwipe);
			  		} 

			  		if (timeSinceSwipe >= swipeDelayTime)
			  		{
			  			justSwiped = false;
			  			timeSinceSwipe = 0;
			  			frameString += "Ending Swipe Delay <br>";
			  		}
		       }
		     }
		  } else 
		  {
		  		if (justSwiped)
		  		{
		  			timeSinceSwipe ++;
			  		frameString += concatData("Time since Swipe", timeSinceSwipe);
		  		} 

		  		if (timeSinceSwipe >= swipeDelayTime)
		  		{
		  			justSwiped = false;
			  		timeSinceSwipe = 0;
			  		frameString += "Ending Swipe Delay <br>";
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