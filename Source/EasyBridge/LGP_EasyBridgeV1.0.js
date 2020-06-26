//==================================================================================================
// Lunar Guard Plugins - Easy Bridge
// LGP_EasyBridge.js
//==================================================================================================
var Imported = Imported || {};
Imported.LGP_EasyBridge = true;

var LGP = LGP || {};
LGP.EB = LGP.EB || {};
LGP.EB.version = 1.0;

 /*:
 * @title LGP Easy Bridge
 * @author Alex
 * @date 26.12.17
 * @version 1.0
 * @filename LGP_EasyBridge.js
 *
 * @plugindesc v1.0 Needs GALV_EventSpawner! Create easy toggable Bridges for your game
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
 * @desc Determines the waittime in frames between the bridge parts
 * @type Number
 * @default 10
 *
 *
 * @help
 * ============================================================================
 * Goals
 * ============================================================================
 *
 *      [DONE] Creating a Bridge while playing
 *      [DONE] Options for Direction and length.
 *      [DONE] Destroy the Bridge.
 *      [DONE] Two Events can controll their bridge. Also works for cluster.
 *      [    ] Play Create/Destroy-Animation for Bridge.
 *      [DONE] Create a Bridge from custom start point.
 *      [DONE] Player can walk under the bridge.
 *      [DONE] NPC can walk under the bridge while Player is on the Bridge.
 *      [    ] Player fall event when falling down from a "shrinking" bridge
 *      [    ] Bridge can change direction midway building. 
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
 *
 * 	Bridge <direction> <legth>
 * 	- This Command creates a bridge right next to its event.
 *	<direction>	Uses the combination of following letters: 'N', 'E', 'S', 'W'.
 *				N -> North; E -> East; S -> South; W -> West
 *				Each Letter is a direction. More letter = more viable directions
 *				It doesn't matter in which sequence the letters are typed in.
 *	<legth>		A Simple Interger value above 0.
 * 				It will determin how long the bridge will get.
 *				Length applies the SAME on all defined directions!
 *
 *	ClearBridge
 *	- This command will 'destroy' the bridge from the event.
 *
 *	SynchBridge <eventID,eventID,...>
 *	- This commands binds an Event with another. Means that one bridge can be
 *	  toggled from two events.
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

 */
//=============================================================================

if (Imported.Galv_EventSpawner) {

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

//=============================================================================
// Easy Bridge
//=============================================================================

LGP.EB.directionGrid = [[0,1],[1,0],[0,-1],[-1,0]];

//=============================================================================
// Game_Interpreter
//=============================================================================
LGP.EB.Game_Interpreter_initialize = Game_Interpreter.prototype.initialize;
Game_Interpreter.prototype.initialize = function(depth) {
	LGP.EB.Game_Interpreter_initialize.call(this, depth);
	this._isSameBridgeEnter = false;
	this._lastBridgeEnterId = 0;
};

LGP.EB.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	LGP.EB.Game_Interpreter_pluginCommand.call(this, command, args);
	if (command === 'Bridge') this.bridge(args);
	if (command === 'ClearBridge') this.clearBridge();
	if (command === 'SynchBridge') this.synchBridge(args);
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
	this._possibleBridgeDirections = [];
	this._currentBridgeDirection = [];
	this._currentPlayerPosision = [];
	this._currentBridgeLength = 0;
	this._bridgeLength = 0;
	this._requestBridgeRefresh = false;
	this._bridgeParts = [];
	this._buildSpeed = 0;
	this._usedBridgeLength = 0;
	this._isLadder = false;
	this._isHost = true;
	this._offsetPosition = [];
	this._hasOffset = false;
	this._layerValue = [];
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
	this._isHost = true;
};

Game_Event.prototype.setBridgeData = function(pData) {
	this._possibleBridgeDirections = pData[0] || [];
	this._bridgeLength = pData[1] || 0;
	this._currentPlayerPosision = pData[2] || [];
};

LGP.EB.Game_Event_update = Game_Event.prototype.update;
Game_Event.prototype.update = function() {
	LGP.EB.Game_Event_update.call(this);
	this.updateBridge();
};

Game_Event.prototype.updateBridge = function() {
	this.updateBridgeData();
	this.updateSynch();
	this.updateBridgeRefresh();
	this.updateLayering();
	
};

Game_Event.prototype.updateBridgeData = function() {
	if (!this.isActorInValidDirection()) return;

	if (this._currentBridgeLength !== this._bridgeLength) {
		this._currentBridgeLength = this._bridgeLength;
	}
	this.updateBridgeBuilding();
};

Game_Event.prototype.updateBridgeBuilding = function() {
	if (this._usedBridgeLength == this._currentBridgeLength) return;
    if (this._buildSpeed == 0) {
	    if (this._usedBridgeLength < this._currentBridgeLength) {
			this._usedBridgeLength = Math.min(this._usedBridgeLength + 1, this._currentBridgeLength);
			this._buildSpeed = LGP.Param.EBBuildDelay;	
			this._isBuilding = true;
		} else {
			this._usedBridgeLength = this._currentBridgeLength; //Math.max(this._usedBridgeLength - 1, this._currentBridgeLength);
			this._buildSpeed = LGP.Param.EBBuildDelay;
			this._isBuilding = false;
		}
		this._requestBridgeRefresh = true;	
	};
	this._buildSpeed--;
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


Game_Event.prototype.updateSynch = function() {
	if (!this._isHost) return;
	if (this._subscribers.length == 0) return;
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
	sEvent._possibleBridgeDirections = this._possibleBridgeDirections;
	sEvent._currentBridgeDirection = this._currentBridgeDirection;
	sEvent._currentPlayerPosision = this._currentPlayerPosision;
	sEvent._bridgeLength = this._bridgeLength;
	//sEvent._bridgeParts = this._bridgeParts;
	sEvent._isHost = false;
	

};




Game_Event.prototype.updateBridgeRefresh = function() {
	if (this._requestBridgeRefresh) this.refreshBridge();
};

Game_Event.prototype.refreshBridge = function() {
	//execute Galv Script based on bridge Data
	if (this._isBuilding) {
		var tileId = this.evaluateTile(this._currentBridgeDirection);
		Galv.SPAWN.overlap = 'all';
		
		var homeX = (this._hasOffset) ? this._offsetPosition[0] : this._x;
		var homeY = (this._hasOffset) ? this._offsetPosition[1] : this._y;
		var x = eval(homeX + (this._currentBridgeDirection[0] * (this._usedBridgeLength)));
		var y = eval(homeY + (this._currentBridgeDirection[1] * (this._usedBridgeLength)));
		if (this._isHost) this._bridgeParts.push($gameMap._events.length);
		if (this._isHost) Galv.SPAWN.event(tileId,x,y);
		this._requestBridgeRefresh = false;
	} else if (!this._isBuilding) {
		var parts = this._bridgeParts;	
		for (var i = 0; i < parts.length; i++) {
			$gameMap.unspawnEvent(parts[i]);
			if (Galv.SPAWN.onScene()) SceneManager._scene._spriteset.unspawnEvent(parts[i]);	
			this._bridgeParts = [];
		}
		/*
		$gameMap.unspawnEvent(parts[this._usedBridgeLength]);
		if (Galv.SPAWN.onScene()) SceneManager._scene._spriteset.unspawnEvent(parts[this._usedBridgeLength]);
		this._bridgeParts.pop();
		*/
		this._requestBridgeRefresh = false;
	}
	
};


Game_Event.prototype.evaluateTile = function(pDirection) {
	if (this._isLadder) return LGP.Param.EBLadderEvent;
	if ((this._bridgeParts.length == 0) || (this._bridgeParts.length+1 == this._bridgeLength)) {
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
	//if (!this.isPlayerOnBridge()) return;
	
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

	if (this.isPlayerOnBridge()) {
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
}


Game_Event.prototype.isPlayerOnBridge = function() {
	
	value = false;
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

Game_Event.prototype.isPlayerOnBridgeEntrance = function() {
	
	value = false;
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
// END OF FILE
//=============================================================================
};