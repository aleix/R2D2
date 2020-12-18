// Import the module.
var Omx = require('node-omxplayer');
 
// Create an instance of the player with the source.
var player = Omx('video.mp4');
 
// Control video/audio playback.
player.pause();
player.volUp();
player.quit();
