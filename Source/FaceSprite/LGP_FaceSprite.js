//=============================================================================
// Lunar Gaurd Plugins - Face Sprite
// LGP_FaceSprite.js
//=============================================================================

var Imported = Imported || {};
Imported.LGP_FaceSprite = true;

var LGP = LGP || {};
LGP.FS = LGP.FS || {};
LGP.FS.version = 3.3;

/*:
 * @title Face Sprite
 * @author Azel
 * @date 26.06.2020
 * @version 3.3
 * @filename LGP_FaceSprite.js
 *
 * @plugindesc v3.3 Displays Face Sprite in Messages in a saparate Window
 *
 *
 * @param Position List
 * @type string[][]
 * @desc For setting up positions used by the plugin. FSPos uses its parameter as index for this list. The values are 2D Numbers.
 * @default ["[\"0.0\",\"0.0\"]","[\"0.05\",\"0.4\"]","[\"0.45\",\"0.4\"]","[\"0.7\",\"0.4\"]","[\"0.05\",\"0.25\"]","[\"0.45\",\"0.25\"]","[\"0.7\",\"0.25\"]","[\"0.05\",\"0.1\"]","[\"0.45\",\"0.1\"]","[\"0.7\",\"0.1\"]"]
 *
 * @param Default Position
 * @type Number
 * @desc For setting up the default position. 
 * Resets the FSPos for every event call to the default.
 * @default 1
 *
 * @help
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * FaceSpritePosition position / FSPos position / FSPosition position
 * Sets the facesprite position. Replace the  'position' with a number on your
 * numpad. The position of the number on the numpad equals the position of the
 * facesprite on the screen. 
 *
 * The default Position is [1]. As it is  
 *
 * [7] [8] [9]
 * [4] [5] [6]
 * [1] [2] [3]
 *
 * In the parameter section you may setup more positions. Remember that the
 * 'position' argument is used as the index for the position list.
 *
 * ============================================================================
 * Script Commands
 * ============================================================================
 * --------------------------------------- 
 * $gameSystem.setFSPosition(index);
 * ---------------------------------------
 * Where index points to the value in the Position List.
 * Calling this sets the position of the Face Sprite window.
 *
 * ---------------------------------------
 * $gameSystem.setFSPositionXY(x, y);
 * ---------------------------------------
 * Where x and y are the aboslute positions on the screen in pixels.
 *
 * ============================================================================
 * Goals
 * ============================================================================
 *
 *      [DONE] Having face sprites.
 *      [DONE] Set face sprite positions.
 *      [DONE] Face sprite uses Window borders.
 *      [DONE] Face sprite takes the face from the message picture.
 *      [    ] Feature for custom border colorsceme.
 *      [    ] Feature for backgroundcolor for expressing emotional states.
 *      [    ] Animated face sprite.
 *      [    ] Change face sprite position with text codes.
 *
 * ============================================================================
 * Description
 * ============================================================================
 *
 * RPG Maker MV allows you to set a Face image in the dialog box.
 * In the Pokemon Mystery Dungeon series the Face is a seperate image in a box.
 * This Plugin does that now.
 *
 * Setup your Face in the "Show Text" command and you're good to go.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * v1.0:
 * - Fresh out from the oven.
 * - Faceimage apears ontop of the window.
 *
 * v2.0:
 * - Code reviewed. The Face image apears now behind the Window Frame and
 *   infront of the Window Background
 * - Added Param: Set the Message Window Margin. 
 *
 * v3.0:
 * - Code reviewed. Mostly all new stuff. Plugin Command FaceSpritePosition 
 *   stays at it is.
 * - Everything esle works pretty much automatic.
 *
 * v3.1:
 * - Updated Documentary.
 * v3.2
 * - Fixed a bug where a position command didn't function properly when the
 *   command was put before a message.
 * v3.3
 * - Acutally fixed the bug of 3.2
 * - Added "Position List" Parameter in the Plugin section.
 * - Reworked FSPos functions. They work diffrently but the use of it
 *   hasn't changed.
 * - Calling an event now sets the FSPos to the default value before the interpreter takes action.
 *   This solves a problem I had, when I reset the FSPos to the default at the end of the 
 *   MessageWindow logic.
 * - Added scriptcall $gameSystem.setFSPosition(index); to manually set the positon based on index.
 * - Added scriptcall $gameSystem.setFSPosition(x, y); to amnually set the position based on coords.
 */


//==================================================================================================
// Parameter and Variables
//==================================================================================================
LGP.Parameters = PluginManager.parameters('LGP_FaceSprite');
LGP.Param = LGP.Param || {};

var grid = to2DArray(LGP.Parameters['Position List']);
var defalutIndex = Number(LGP.Parameters['Default Position']);

function to2DArray(str) {
    try {
    var grid = eval(str);
        grid.forEach((element, index) =>  {
            grid[index] = eval(element);
            grid[index].forEach((element2, index2) => {
                grid[index][index2] = eval(element2);
            });
        });
    } catch(e) {
        console.log("Face Sprite Error: Position List couldnt be parsed into 2D Array object.")
        console.log("Please validate the Position List Parameter in the Plugin Setting.");
    }
    
    return grid;
}

//==================================================================================================
// Game_Interpreter
//==================================================================================================
LGP.FS.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    LGP.FS.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'FSPosition' ||command === 'FaceSpritePosition' || command === 'FSPos') $gameSystem.setFSPosition(parseInt(args));
};

LGP.FS.Game_Interpreter_setup = Game_Interpreter.prototype.setup;
Game_Interpreter.prototype.setup = function(list, eventId) {
    LGP.FS.Game_Interpreter_setup.call(this, list, eventId);
    $gameSystem.setFSPosition(defalutIndex);
};


//==================================================================================================
// Game_System
//==================================================================================================

LGP.FS.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    LGP.FS.Game_System_initialize.call(this);
    this._fsPos = [];
    this._fsGrid = grid;
};

Game_System.prototype.setFSPosition = function(index) {
    var coord = $gameSystem.getFSPositionFromGrid(index);
    var x = coord[0];
    var y = coord[1];
    this._fsPos = [x, y];
};

Game_System.prototype.setFSPositionXY = function(x, y) {
    this._fsPos = [x, y];
};


Game_System.prototype.getFSPositionFromGrid = function(index) {
    var x = Math.round(this._fsGrid[index][0] * Graphics.boxWidth);
    var y = Math.round(this._fsGrid[index][1] * Graphics.boxHeight);  
    return [x, y];
};

Game_System.prototype.getFSPosition = function() {
    return this._fsPos;
};

//==================================================================================================
// Window_Message
//==================================================================================================

LGP.FS.Window_Message_createSubWindows = Window_Message.prototype.createSubWindows;
Window_Message.prototype.createSubWindows = function() {
    LGP.FS.Window_Message_createSubWindows.call(this);
    this._faceSpriteWindow = new Window_FaceSprite(this);
    var scene = SceneManager._scene;
    scene.addChild(this._faceSpriteWindow);
};

LGP.FS.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function() {
    LGP.FS.Window_Message_terminateMessage.call(this);
    this._faceSpriteWindow.clear();
};

Window_Message.prototype.drawMessageFace = function() {
    //this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, 0); // No need for this anymore.
    ImageManager.releaseReservation(this._imageReservationId);
};

// Override newLineX
Window_Message.prototype.newLineX = function() {
    //return $gameMessage.faceName() === '' ? 0 : 168;
    return 0; // Since there is no Face in the message Box, ther's no need for an indent.
};


//==================================================================================================
// Window_FaceSprite
//==================================================================================================
function Window_FaceSprite() {
    this.initialize.apply(this, arguments);
}

Window_FaceSprite.prototype = Object.create(Window_Base.prototype);
Window_FaceSprite.prototype.constructor = Window_FaceSprite;

Window_FaceSprite.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow
    var ww = Window_Base._faceWidth;
    var wh = Window_Base._faceHeight;
    Window_Base.prototype.initialize.call(this, 0, 0, ww, wh);
    this._faceIndex = 0;
    this._faceName = '';
    this._faceSprite = null;
    this.openness = 0;
    this.clear();
};

Window_FaceSprite.prototype.clear = function() {

};

Window_FaceSprite.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.updateWindowAspects();
};

Window_FaceSprite.prototype.updateWindowAspects = function() {
    this.updateWindowData();
    this.updateWindowPosition();
    this.updateWindowOpacity();
    this.updateRefresh();
};

Window_FaceSprite.prototype.updateWindowData = function() {
    this._faceName = $gameMessage.faceName();
    this._faceIndex = $gameMessage.faceIndex();
    this._faceCoord = $gameSystem.getFSPosition();
};


Window_FaceSprite.prototype.updateWindowPosition = function() {
    this.move(this._faceCoord[0], this._faceCoord[1], Window_Base._faceWidth, Window_Base._faceHeight);
};

Window_FaceSprite.prototype.updateWindowOpacity = function() {
    if (!this._messageWindow) return;
    var parent = this._messageWindow;
    
    if (this.hasFace()) {
        this.openness = parent.openness;
    } else {
        this.openness = 0;
    }
};


Window_FaceSprite.prototype.hasFace = function() {
    return ($gameMessage.faceName() !== '' || $gameMessage.faceIndex() != 0);
};

Window_FaceSprite.prototype.updateRefresh = function() {
    this.refresh();
};

Window_FaceSprite.prototype.refresh = function() {
    // Draw Content
    this.createContents();
    this.contents.clear();
    this.drawFaceSprite(this._faceName, this._faceIndex, 0, 0);
};

Window_FaceSprite.prototype.drawFaceSprite = function(faceName, faceIndex){
    this._faceSprite = new Sprite();
    this._faceSprite.bitmap = new Bitmap(144,144);  

    var width = width || Window_Base._faceWidth;
    var height = height || Window_Base._faceHeight;
    var bitmap = ImageManager.loadFace(faceName);
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(0 + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(0 + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
    this._faceSprite.bitmap.blt(bitmap, sx, sy, sw, sh, dx, dy);

    //align the image like the background
    var m = this._margin;
    var w = this._width - m * 2;
    var h = this._height - m * 2;
    this._faceSprite.setFrame(0, 0, w, h);
    this._faceSprite.move(m, m);

    //color for Male / Female
    //this._windowFrameSprite.tint = 0xFFA298;    //Female
    //this._windowFrameSprite.tint = 0x98F5FF;  //Male

    //add to the windowSpriteContainer
    this._windowSpriteContainer.removeChildren(0,this._windowSpriteContainer.children.lenght);
    this._windowSpriteContainer.addChild(this._windowBackSprite);
    this._windowSpriteContainer.addChild(this._faceSprite);
    this._windowSpriteContainer.addChild(this._windowFrameSprite);
};

//=============================================================================
// End of File
//=============================================================================

