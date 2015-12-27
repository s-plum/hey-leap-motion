# Leap Motion - Audio Test

This is a basic and somewhat hacked-together demo of mapping Leap Motion hand gesture controls to application commands. 

## Setup dependencies

* [Leap Motion](https://www.leapmotion.com/product/desktop) and [Leap Motion SDK](https://developer.leapmotion.com/)
* [Node.js](https://nodejs.org/en/download/)
* [Gulp](http://gulpjs.com/)

## Run the app

1. After cloning the repo, run `npm install` from the project root to download all application dependencies.
2. Run `gulp serve` from the project root to start the app server.
3. Plug in your Leap Motion. Make sure the device has been configured to work with your computer, if you have not already done so, and that the Leap device is on and tracking your hand motions.
4. Go to http://localhost:3000 in Chrome to view the application.

## Play around

* Give the leap motion the middle finger (make sure your other fingers are gripped in close to your palm) to stop the music.
* Thumbs up to restart the music.
* Hold your hand flat, palm down, and move it up (while still holding it parallel to the floor) to raise the volume.
* Hold your hand flat, palm down, and move it down (while still holding it parallel to the floor) to lower the volume.
* Thumbs down is unmapped but will register as a distinct action.

## Edit the code

You can adjust the screen output and action mappings, or add new action mappings, by editing `src/js/main.js`. You will need to stop the app server (CTRL + C in the terminal window running the app) and restart it with the watch command (`gulp serve --watch`) so that it will rebuild every time you change the application code.