//=============================================================================
// Lunar Gaurd Plugins - Face Sprite
// LGP_FaceSprite.js
//=============================================================================

var Imported = Imported || {};
Imported.LGP_FaceSprite = true;

var LGP = LGP || {};
LGP.FS = LGP.FS || {};
LGP.FS.version = 3.1;

/*:
 * @title Face Sprite
 * @author Azel
 * @date 04.11.17
 * @version 3.1
 * @filename LGP_FaceSprite.js
 *
 * @plugindesc v3.1 Displays Face Sprite in Messages in a saparate Window
 *
 * @help
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
 * Plugin Commands
 * ============================================================================
 *
 * FaceSpritePosition position / FSPos position
 * Sets the facesprite position. Replace the  'position' with a number on your
 * numpad. The position of the number on the numpad equals the position of the
 * facesprite on the screen. Default is always [1] Bottom Left.
 *
 * [7] [9]
 * [1] [3]
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
 */
  


//==================================================================================================
// Parameter and Variables
//==================================================================================================
LGP.Parameters = PluginManager.parameters('LGP_FaceSprite');
LGP.Param = LGP.Param || {};

//==================================================================================================
// Game_Interpreter
//==================================================================================================
LGP.FS.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    LGP.FS.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'FaceSpritePosition' || command === 'FSPos') this.setFaceSpritePosition(args);
};

Game_Interpreter.prototype.setFaceSpritePosition = function(args) {
    var coord = $gameSystem.getFSPos(Number(args));
    var x = coord[0];
    var y = coord[1];
    $gameSystem.setFaceSpritePosition(x, y);
};

//==================================================================================================
// Game_System
//==================================================================================================

LGP.FS.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    LGP.FS.Game_System_initialize.call(this);
    this._faceSpritePos = [0, 0];
};

Game_System.prototype.setFaceSpritePosition = function(x, y) {
    this._faceSpritePos = [x, y];
};

Game_System.prototype.getFaceSpritePosition = function() {
    return this._faceSpritePos;
};

Game_System.prototype.getFSPosGrid = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var grid = {
        BL : {x: width * 0.05, y: height * 0.4}, 
        BR : {x: width * 0.83, y: height * 0.4}, 
        TL : {x: width * 0.05, y: height * 0.1},
        TR : {x: width * 0.83, y: height * 0.1}   
    };
    return grid;
};

Game_System.prototype.getFSPos = function(index) {
    var grid = $gameSystem.getFSPosGrid();
    var pos = [];
    switch (index) {
        case 1:
            pos = grid.BL;break;
        case 3:
            pos = grid.BR;break;
        case 7:
            pos = grid.TL;break;
        case 9:
            pos = grid.TR;break;
        default:  pos = grid.BL;break;    
    }
    var x = Math.round(pos.x);
    var y = Math.round(pos.y);  

    return [x, y];
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
    //$gameSystem.setFaceSpritePosition(0, 0);  
};

Window_Message.prototype.drawMessageFace = function() {
    //this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, 0); // No need for this anymore.
    ImageManager.releaseReservation(this._imageReservationId);
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
    this._requestRefresh = false;
    this.openness = 0;
    this.clear();
    //this.hide();
};

Window_FaceSprite.prototype.clear = function() {
    this._faceIndex = 0;
    this._faceName = '';
    this._faceSprite = null;
    this._faceCoord = [];
};

Window_FaceSprite.prototype.clearFSSystemData = function(){
    $gameSystem.setFaceSpritePosition(0, 0);
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
    if (!this.hasFace()) return;
    this._faceIndex = $gameMessage.faceIndex();
    this._faceName = $gameMessage.faceName();
    this._requestRefresh = true;     
};

Window_FaceSprite.prototype.updateWindowPosition = function() {
    this._faceCoord = $gameSystem.getFaceSpritePosition();
        if (this._faceCoord[0] == 0 || this._faceCoord[1] == 0) {
        this._faceCoord = $gameSystem.getFSPos(1);    
    }
    this.move(this._faceCoord[0], this._faceCoord[1], Window_Base._faceWidth, Window_Base._faceHeight);
};

Window_FaceSprite.prototype.updateWindowOpacity = function() {
    if (!this._messageWindow) return;
    parent = this._messageWindow;
    
    if (!this.hasFace() || this._faceName === '') {
        this.close();
        return;
    } 
    this.openness = parent.openness;
    if (this.isClosed()) this.clearFSSystemData();
};


Window_FaceSprite.prototype.hasFace = function() {
    return ($gameMessage.faceName() !== '' || $gameMessage.faceIndex() != 0);
};

Window_FaceSprite.prototype.updateRefresh = function() {
    if (this._requestRefresh) this.refresh();
};

Window_FaceSprite.prototype.refresh = function() {
    this.createContents();
    this.contents.clear();
    this.drawFaceSprite(this._faceName, this._faceIndex, 0, 0);
    this._requestRefresh = false;
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

