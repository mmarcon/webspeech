#Vocal Search 2

Vocal Search 2 is a simple experiment with the [Web Speech API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html).

You will need Chrome >= 25 to try this application, as no other browsers support it.

By clicking on the microphone icon or pressing `S` the browser will ask for permission to use the computer's microphone and then it will start listening for vocal commands.

Commands are expressed in **natural language**, for example:
 
 * `Find me a restaurant`
 * `Search for an Italian restaurant`
 * `Find a cafe around here`
 * `I feel like having a beer, can you look for a pub?`
 
The application will respond by searching for the correct venue (restaurant, italian restaurant, cafe, pub) in the HERE Place database and showing the 3 most relevant results with their address on the map and in a list.
 
Some implementation details can be found in [my blog](http://blog.marcon.me/post/43882807481/vocal-search), or by looking at the source code.
 
##Bugs
 
Sometime there seems to be an issue the first time listening is activated. Capturing times out before any voice can be recorded. I suspect it's a bug in Chrome's implementation. Simply try again.