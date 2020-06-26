//==================================================================================================
// Lunar Guard Plugins - Easy Bridge
// LGP_EasyBridge.js
//==================================================================================================
var Imported = Imported || {};
Imported.LGP_EasyBridge = true;

var LGP = LGP || {};
LGP.EB = LGP.EB || {};
LGP.EB.version = 1.2;

 /*:
 * @title LGP Easy Bridge
 * @author Alex
 * @date 26.12.17
 * @version 1.2
 * @filename LGP_EasyBridge.js
 *
 * @plugindesc v1.2 Needs GALV_EventSpawner! Create easy toggable Bridges for your game
 *
 * @param BridgeTile Side ID
 * @desc The Event ID of the Event with the Side Bridge Tile
 * @type Number
 * @default 0
 *
 * @param BridgeTile Front ID
 * @desc The Event ID of the Event with the Front Bridge Tile

 * @type Number
 * @default 0 
 *
 * @param Empty ID
 * @desc The Event ID of the Event that make unpassable ledges passable. It's 
 * needed to get to the bridge if the bridge is behind a blocked passage.
 * @type Number
 * @default 0 
 *
 * @param Ladder ID
 * @desc The Event ID of the Event with the Ladder Tile
 * @type Number
 * @default 0
 *
 * @param Bridge Build Delay
 * @desc Determines the waittime in frames between the bridge parts.
 * @type Number
 * @min 1
 * @default 10
 *
 * @param Bridge Spawn Animation
 * @desc The animation which will be played on the spawned tile of the bridge.
 * @type Animation
 * @default 2
 *
 * @param Bridge Despawn Animation
 * @desc The animation which will be played on the dewspawned tile of the bridge.
 * @type Animation
 * @default 2
 *
 * @param Play Animation on Entrance
 * @desc Determines wether an animation should be played at each entrances of the bridge.
 * @type boolean
 * @default false
 *
 * @help
 * ============================================================================
 * Goals
 * ============================================================================
 *
 *      [DONE] Creating a Bridge while playing
 *      [DONE] Options for Direction and length.
 *      [DONE] Destroy the Bridge.
 *      [DONE] Play Create-Animation for Bridge.
 *      [DONE] Play Destroy-Animation for Bridge.
 *      [DONE] Create a Bridge from custom start point.
 *      [DONE] Player can walk under the bridge.
 *      [    ] Two Events can controll their bridge. Also works for cluster.
 *      [    ] Plugin should be an extension of YEP_EventCopier.
 *
 *
 * ============================================================================
 * Description
 * ============================================================================
 *
 * This Plugin gives Events the ability to create toggable Bridges. This way
 * the user can easly setup multiple bridges via Plugin Commands instead of 
 * configuring multiple Events that cost a lot of time and patience.
 * 
 * Plugin may be a bit "buggy". But it works overall fine. It will take time
 * to figgure out all the small errors in the code.
 *
 * ============================================================================
 * Pugin Commands
 * ============================================================================
 * ----------------------------------------------------------------------------
 * 	Bridge <direction> <length>
 * ----------------------------------------------------------------------------
 * 	- This Command creates a bridge right next to its event.
 *  - Only one bridge can be set per group of events.
 *	<direction>	Uses the combination of following letters: 'N', 'E', 'S', 'W'.
 *				N -> North; E -> East; S -> South; W -> West
 *				Each Letter is a direction. More letter = more viable directions
 *				It doesn't matter in which sequence the letters are typed in.
 *	<length>	A Simple Interger value above 0.
 * 				It will determin how long the bridge will get.
 *				Length applies the SAME on all defined directions!
 *
 * ----------------------------------------------------------------------------
 * BridgeOffset <offset>
 * ----------------------------------------------------------------------------
 * - This command positions the bridge Posistion to its offset positoin
 *  <offset     The offset is made of an x and y value of the new postion,
 *              seperated with a comma.
 *
 * ----------------------------------------------------------------------------
 *	ClearBridge
 * ----------------------------------------------------------------------------
 *	- This command will 'destroy' the bridge from the event.
 *
 * ----------------------------------------------------------------------------
 *	SynchBridge <eventID,...> 
 * ----------------------------------------------------------------------------
 *	- This commands binds an event with another. Means that one bridge can be
 *	  toggled from one or more events. 
 *  - You can define multiple events.
 *	<eventID>	The Event ID of the Event whose data shall be traded with.
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * v0.1 - First attempt.
 * v0.2 - Code rewritten for better future use.
 * v0.3 - Synch Bridge Data between two events now possible.
 * v0.4 - Player can walk under the bridge.
 * v1.0 - Stable Release.
 * v1.1 - Fix for Followers walking across the bridge.
 *      - Updated Code. It should run more consistently.
 *      - Added animation for spawning and despawing a bridge tile.
 * v1.2 - Fixed missing meta data from spawned events for GALV_CharacterAnimations.

 */
//=============================================================================

if (Imported.Galv_EventSpawner && Imported.YEP_EventCopier) {

//==================================================================================================
// Paramenter Variables
//==================================================================================================

LGP.Parameters = PluginManager.parameters('LGP_EasyBridge');
LGP.Param = LGP.Param || {};

LGP.Param.EBSideTileEvent = Number(LGP.Parameters['BridgeTile Side ID']);
LGP.Param.EBFrontTileEvent = Number(LGP.Parameters['BridgeTile Front ID']);
LGP.Param.EBEmptyEvent = Number(LGP.Parameters['Empty ID']);
LGP.Param.EBLadderEvent = Number(LGP.Parameters['Ladder ID']);
LGP.Param.EBBuildDelay = Number(LGP.Parameters['Bridge Build Delay']);
LGP.Param.EBspawnAnimation = Number(LGP.Parameters['Bridge Spawn Animation']);
LGP.Param.EBdespawnAnimation = Number(LGP.Parameters['Bridge Despawn Animation']);
LGP.Param.EBplayEntranceAnimation = eval(LGP.Parameters['Play Animation on Entrance']);

//=============================================================================
// Easy Bridge
//=============================================================================

LGP.EB.directionGrid = [[0,1],[1,0],[0,-1],[-1,0]];


//=============================================================================
// Game_Interpreter
//=============================================================================

LGP.EB.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	LGP.EB.Game_Interpreter_pluginCommand.call(this, command, args);
	if (command === 'Bridge') this.bridge(args);
	if (command === 'ClearBridge') this.clearBridge();
	//if (command === 'SynchBridge') this.synchBridge(args);
	if (command === 'Ladder') this.ladder();
	if (command === 'BridgeOffset') this.bridgeOffset(args);
};

Game_Interpreter.prototype.bridge = function(args) {
	//Prepare Arguments
	var data = []; //index 0 = directions; index 1 = length; index 2 = current Player Coord
    var str = this.argsToString(args);
    var player = $gamePlayer;
    if (str.match(/(\w{0,4}[NSWE])[ ](\d*)/i)) {
    	data[0] = this.setAllBridgeDirections(RegExp.$1); //defined Bridge directions
    	data[1] = RegExp.$2; //length
    	data[2] = [Math.round(player._x), Math.round(player._y)]; //current Player position.
    }
	this.startBridge(data);	
};

Game_Interpreter.prototype.argsToString = function(args) {
    var str = '';
    var length = args.length;
    for (var i = 0; i < length; ++i) {
      str += args[i] + ' ';
    }
    return str.trim();
};

Game_Interpreter.prototype.setAllBridgeDirections = function(pDirection) {
	var grid = LGP.EB.directionGrid;
	var array = [];
	var str = pDirection;
	for(var i = 0; i < str.length; i++) {
		var char = str.charAt(i);		
		switch(char) {
			case 'N': // Never
				//north
				array.push(grid[0]);
				break;
			case 'E': // Ever
				//east;
				array.push(grid[1]);
				break;
			case 'S': // Smoke
				//south
				array.push(grid[2]);
				break;
			case 'W': // Weed
				//west
				array.push(grid[3]);
				break;
			default: // Never Say Never.
				break;
		}
	}
	return array;
};

Game_Interpreter.prototype.startBridge = function(pData) {
	var event = $gameMap.event(this._eventId);
	event.setBridgeData(pData);
};

Game_Interpreter.prototype.clearBridge = function() {	
	var event = $gameMap.event(this._eventId);
	event.clearBridge();
	$gameMap.removeNullEvents();	
};

Game_Interpreter.prototype.synchBridge = function(pData) {
	var event = $gameMap.event(this._eventId);
	var subscribers = eval('[' + pData + ']');
	event.setSubscribers(subscribers);
};

Game_Interpreter.prototype.ladder = function() {
	var event = $gameMap.event(this._eventId);
	event.setLadder(true);
};

Game_Interpreter.prototype.bridgeOffset = function(pData) {
	var event = $gameMap.event(this._eventId);
	var offset =  eval('[' + pData + ']');
	event.setBridgeOffset(offset);
};

Game_Interpreter.prototype.isActorEnterBridge = function() {
	if (this.isSameBridgeEnter()) return;
	var value = ($gameMap.event(this._eventId)._y == Math.round($gamePlayer._y) && ($gameMap.event(this._eventId)._x == Math.round($gamePlayer._x)));
	return value;
};

//=============================================================================
// Game_Event
//=============================================================================

LGP.EB.Game_Event_initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function() {
	LGP.EB.Game_Event_initMembers.call(this);
	this.clearBridgeMembers();
	this.clearSynchData();
};

Game_Event.prototype.clearBridgeMembers = function() {
	this._requestBridgeRefresh = false;
	this._isLadder = false;
	this._isHost = false;
	this._hasOffset = false;
	this._bridgeExists = false;
	this._currentBridgeLength = 0;
	this._bridgeLength = 0;
	this._bridgeParts = [];
	this._buildSpeed = 0;
	this._usedBridgeLength = 0;
	this._offsetPosition = [];
	this._layerValue = [];
	this._possibleBridgeDirections = [];
	this._currentBridgeDirection = [];
	this._currentPlayerPosision = [];
};

LGP.EB.Game_Event_start = Game_Event.prototype.start;
Game_Event.prototype.start = function() {
	if (this.isBridgeActive()) return;
	LGP.EB.Game_Event_start.call(this);
};

Game_Event.prototype.isBridgeActive = function() {
	//console.log(this._eventId + ": " + this._usedBridgeLength + " " + this._currentBridgeLength);
	if (this._usedBridgeLength === this._currentBridgeLength) return false;
	return true;
};

Game_Event.prototype.setBridgeOffset = function(pData) {
	this._offsetPosition =  eval('[' + pData + ']');
	this._hasOffset = true;
};

Game_Event.prototype.clearSynchData = function() {
	this._subscribers = [];
};

Game_Event.prototype.setSubscribers = function(pSubscribers) {
	this._subscribers = pSubscribers;
	//this._isHost = true;
};

Game_Event.prototype.setBridgeData = function(pData) {
	this._possibleBridgeDirections = pData[0] || [];
	this._bridgeLength = Number(pData[1]) || 0;
	this._currentPlayerPosision = pData[2] || [];
	this._isHost = true;
};

LGP.EB.Game_Event_update = Game_Event.prototype.update;
Game_Event.prototype.update = function() {
	LGP.EB.Game_Event_update.call(this);
	this.updateBridge();
};

Game_Event.prototype.updateBridge = function() {
	if (!this._isHost) return;
	this.updateBridgeData();
	//this.updateBridgeSynch();
	this.updateBridgeRefresh();
	this.updateLayering();
};

Game_Event.prototype.updateBridgeData = function() {
	if (!this.isActorInValidDirection()) return;

	if (this._currentBridgeLength != this._bridgeLength) {
		this._currentBridgeLength = this._bridgeLength;
	}
	this.updateBridgeBuilding();
};

Game_Event.prototype.updateBridgeBuilding = function() {
	if (this._usedBridgeLength === this._currentBridgeLength) return;
	if (this._buildSpeed > 0) this._buildSpeed--;
    if (this._buildSpeed === 0) {
	    if (this._usedBridgeLength < this._currentBridgeLength) {
			this._usedBridgeLength = Math.min(this._usedBridgeLength + 1, this._currentBridgeLength);
			this._buildSpeed = LGP.Param.EBBuildDelay;	
			this._isBuilding = true;
		} else {
			this._usedBridgeLength = Math.max(this._usedBridgeLength - 1, this._currentBridgeLength);
			this._buildSpeed = LGP.Param.EBBuildDelay;
			this._isBuilding = false;
		}
		this._requestBridgeRefresh = true;	
		
	}
};

Game_Event.prototype.isActorInValidDirection = function() {
	var eventCoord = [this._x, this._y];
	var directionCoord = this._possibleBridgeDirections;
	var playerCoord = this._currentPlayerPosision;
	if (directionCoord.length == 1) {
		this._currentBridgeDirection = [eval(directionCoord[0][0]), -eval(directionCoord[0][1])];
		return true;
	}
	for (var i = 0; i < directionCoord.length; i++) {
		var validCoord = [eval(eventCoord[0] - directionCoord[i][0]), eval(eventCoord[1] + directionCoord[i][1])];
		if (playerCoord.equals(validCoord)) {
			this._currentBridgeDirection = [eval(directionCoord[i][0]), -eval(directionCoord[i][1])];
			return true;
		}
	}
	return false;
};

Game_Event.prototype.updateBridgeSynch = function() {
	if (this._usedBridgeLength !== this._bridgeLength) return;
	if (this._subscribers.length === 0) return;

	for (var i = 0; i < this._subscribers.length; i++) {
		var sEvent = $gameMap.event(this._subscribers[i]);	
		this.synchBridgeData(sEvent);
		this.synchSelfSwitch(sEvent);	
	}    
	this.clearSynchData();
};


Game_Event.prototype.synchSelfSwitch = function(pEvent) {
	var key =  $gameMap._mapId + "," + this._eventId + "," + "A"
	var sKey = $gameMap._mapId + "," + pEvent._eventId + "," + "A";
    $gameSelfSwitches.setValue(sKey,$gameSelfSwitches.value(key));
};

Game_Event.prototype.synchBridgeData = function(pEvent) {
	var sEvent = pEvent;
	sEvent._subscribers = [];
	sEvent._currentBridgeDirection = this._currentBridgeDirection;
	sEvent._currentPlayerPosision = this._currentPlayerPosision;
	sEvent._bridgeLength = this._bridgeLength;
	sEvent._currentBridgeLength = this._currentBridgeLength;
	sEvent._usedBridgeLength = this._usedBridgeLength;
	sEvent._bridgeExists = this._bridgeExists;
	sEvent._bridgeParts = this._bridgeParts;
	sEvent._possibleBridgeDirections = this._possibleBridgeDirections;
	sEvent._isHost = false;
};

Game_Event.prototype.updateBridgeRefresh = function() {
	if (this._requestBridgeRefresh) this.refreshBridge();
	this._requestBridgeRefresh = false;
};

Game_Event.prototype.refreshBridge = function() {
	//execute Galv Script based on bridge Data
	console.log(this._eventId + ": " + this._usedBridgeLength);
	if (this._isBuilding) {
		var tileEventId = this.evaluateTileEvent(this._currentBridgeDirection);
		Galv.SPAWN.overlap = 'all';
		
		var homeX = (this._hasOffset) ? this._offsetPosition[0] : this._x;
		var homeY = (this._hasOffset) ? this._offsetPosition[1] : this._y;
		var x = eval(homeX + (this._currentBridgeDirection[0] * (this._usedBridgeLength)));
		var y = eval(homeY + (this._currentBridgeDirection[1] * (this._usedBridgeLength)));

		

		if (this._bridgeExists) {
				//if A bridge already exist, move its location and adapt the image
				var event = $gameMap.event(this._bridgeParts[this._usedBridgeLength - 1]);
				if (event._x !== x && event._y !== y) {
					event._x = x;
					event._realX = x;
					event._y = y;
					event._realY = y;
				}
			var tileId = Yanfly.PreloadedMaps[Galv.SPAWN.spawnMapId].events[tileEventId].pages[0].image.tileId;
			event.setTileImage(tileId);
		} else {
			//if a bridge doe'nt exist, create one.
			this._bridgeParts.push($gameMap._events.length);
			Galv.SPAWN.event(tileEventId,x,y);
			var tileId = Yanfly.PreloadedMaps[Galv.SPAWN.spawnMapId].events[tileEventId].pages[0].image.tileId;
			var event = $gameMap.event(this._bridgeParts[this._usedBridgeLength - 1]);
		}
		event.requestAnimation(LGP.Param.EBspawnAnimation);
	} else {
		//Clear the image to make it look like the bridge's despawining.
		var event = $gameMap.event(this._bridgeParts[this._usedBridgeLength]);
		event.requestAnimation(LGP.Param.EBspawnAnimation);
		event.setTileImage(0);
	}
	if (this.isBridgeComplete()) this._bridgeExists = true; //one time flag.
};



Game_Event.prototype.evaluateTileEvent = function(pDirection) {
	if (this._isLadder) return LGP.Param.EBLadderEvent;
	if (this._usedBridgeLength - 1 == 0 || this._usedBridgeLength == this._bridgeLength) {
		return LGP.Param.EBEmptyEvent;
	}
	if ((pDirection.equals([1,0]) || (pDirection.equals([-1,0])))) {
		return LGP.Param.EBSideTileEvent;	
	} else if ((pDirection.equals([0,1]) || (pDirection.equals([0,-1])))) {
		return LGP.Param.EBFrontTileEvent;	
	}	
};

Game_Event.prototype.updateLayering = function() {	
	
	if (this._isLadder) return;
	if (!this.isBridgeComplete()) return;
	
	this._layerValue[0] = 0;
	this._layerValue[1] = 0;
	
	if (this.isPlayerOnBridgeEntrance()) {
		this._layerValue[0] = 2;
	} else {
		if (this._layerValue[2] == 3) {
			this._layerValue[0] = 2;
		} else {
			this._layerValue[0] = 0;
		}
	}

	if (this.isPlayerOnBridge() || this.isAnyFollowerOnBridge()) {
		this._layerValue[1] = 1;
	} else {
		this._layerValue[1] = 0;
	}

	this._layerValue[2] = this._layerValue[0] + this._layerValue[1];
	this.setBridgePriority(2);
	if (this._layerValue[2] === 3) this.setBridgePriority(0);
	//if (this._layerValue[2] === 1) this.setBridgePriority(1);
	
	// DEBUG
	//console.log(this._eventId + ": " + this._layerValue[0] + " + " + this._layerValue[1] + " = " + this._layerValue[2]);
};

Game_Event.prototype.setBridgePriority = function(pPrio) {
	for (var i = 0; i < this._bridgeParts.length; i++) {
		var event = $gameMap.event(this._bridgeParts[i]);
		var page = event.page();
		event.setPriorityType(pPrio);
	}
};

Game_Event.prototype.isBridgeComplete = function() {	
	if (this._bridgeLength <= 0) return false;
	if (this._bridgeParts.length != this._bridgeLength) return false;
	for (var i = 0; i < this._bridgeLength; i++) {
		var event = $gameMap.event(this._bridgeParts[i]);
		if (!event) return false;
	}
	return true;
};

Game_Event.prototype.isPlayerOnBridge = function() {
	
	var value = false;
	var playerCoord = [Math.round($gamePlayer._x),Math.round($gamePlayer._y)];
	for (var i = 0; i < this._bridgeParts.length; i++) {
		var event = $gameMap.event(this._bridgeParts[i]);
		var eventCoord = [event._x,event._y];
		if (playerCoord.equals(eventCoord)) {
			value = true;
			break;
		}
	}
	return value;
};

Game_Event.prototype.isAnyFollowerOnBridge = function(){
	if (!$gamePlayer.followers().isVisible()) return false;

	var value = false;
	var followers = $gamePlayer.followers();
	for (var i = 0; i < this._bridgeParts.length; i++) {
		var event = $gameMap.event(this._bridgeParts[i]);
		var eventCoord = [event._x,event._y];
		followers.forEach(function(follower){
			var followerCoord = [Math.round(follower._x), Math.round(follower._y)];
			if (followerCoord.equals(eventCoord)) {
				value = true;
			}
		}, this);
		if (value) break;
	}
	return value;
};

Game_Event.prototype.isPlayerOnBridgeEntrance = function() {
	var value = false;
	var playerCoord = [Math.round($gamePlayer._x),Math.round($gamePlayer._y)];
	var event = $gameMap.event(this._bridgeParts[0]);
	var eventCoord = [event._x,event._y];
	if (playerCoord.equals(eventCoord)) {
		value = true;
	} else {
		event = $gameMap.event(this._bridgeParts[this._bridgeParts.length-1]);
		eventCoord = [event._x,event._y];
		if (playerCoord.equals(eventCoord)) {
			value = true;
		}
	}
	return value;	
};

Game_Event.prototype.clearBridge = function() {
	this._bridgeLength = 0;	
	this._isHost = true;
};

Game_Event.prototype.setLadder = function(pLadder) {
	this._isLadder = pLadder;
};

	
//=============================================================================
// Galv.SPAWN
//=============================================================================

LGP.EB.Galv_SPAWN_event = Galv.SPAWN.event;
Galv.SPAWN.event = function(eventId,x,y,save) {
	LGP.EB.Galv_SPAWN_event.call(this,eventId, x, y, save);
	$gameMap.requestRefresh(); // Fixes Map passage issues
};

//=============================================================================
// Game_SpawnEvent
//=============================================================================
Game_SpawnEvent.prototype.initialize = function(mapId,eventId,x,y,spawnEventId,saveEvent) {
	this._spawnX = x;
	this._spawnY = y;
	this._spawnEventId = spawnEventId;
	this.isSpawnEvent = true;
	this.isSavedEvent = saveEvent;
	DataManager.extractMetadata(this.event());                 // Switched these functions
	Game_Event.prototype.initialize.call(this,mapId,eventId);  // to fix a bug.
};

//=============================================================================
// END OF FILE
//=============================================================================
};