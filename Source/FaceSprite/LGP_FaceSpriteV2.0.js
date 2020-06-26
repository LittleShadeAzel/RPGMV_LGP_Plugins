//=============================================================================
// Lunar Gaurd Plugins - Face Sprite
// LGP_FaceSprite.js
//=============================================================================

var Imported = Imported || {};
Imported.LGP_FaceSprite = true;

var LGP = LGP || {};
LGP.FaceSprite = LGP.FaceSprite || {};
LGP.FaceSprite.version = 2.0;

/*:
 * @plugindesc v2.0 Show face sprites for messages just like in Pokemon 
 * Mystery Dungeon Series!
 * @author LGP
 *
 * @help
 * ============================================================================
 * Goals
 * ============================================================================
 *
 *      [DONE] Having Face Sprites
 *      [DONE] Set Face Sprite Positions
 *      [DONE] Face Sprites use Window.png 
 *      [    ] Feature for Border colorsceme.
 *      [    ] Feature for Backgroundcolor for expressing emotional statess.
 *      [    ] Animated Face Sprie 
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * FaceSpriteName name
 * This command lets you choose the File, wich contains the Face of your 
 * desired sprite. Replace 'name' with the Filename in your image folder 
 * '\img\faces' without the '.png'.
 *
 * FaceSpriteIndex index
 * This command determines the index of the File. Type for index a 
 * number from 0 to 7.
 *
 * FaceSpritePosition position
 * Sets the facesprite position. Replace the  'position' with a number on your
 * numpad. The position of the number on the numpad equals the position of the
 * facesprite on the screen.
 *
 * [7] [9]
 * [1] [3]
 *
 * FaceSpriteCustomPosition x y
 * Sets the facesprite position. Replace 'x' and 'y' for any number depending
 * on where you want the face on the screen.
 *
 * FaceSpriteClear
 * Removes stored data and clear the screen form the facesprite. 
 *
 * ============================================================================
 * Description
 * ============================================================================
 *
 * RPG Maker MV allows you to set a Face image in the dialog box.
 * In the Pokemon Mystery Dungeon series is the Face image a seperate box.
 * This Plugin does that.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.0:
 * - Fresh out from the oven.
 * - Faceimage apears ontop of the window.
 *
 * Version 2.0:
 * - Code reviewed. The Face image apears now behind the Window Frame and
 *   infront of the Window Background
 * - Added Param: Set the Message Window Margin. 
 */
  


//=============================================================================
// Parameter and Variables
//=============================================================================
LGP.Parameters = PluginManager.parameters('LGP_FaceSprite');
LGP.Param = LGP.Param || {};



    
//============================================================================
// Game_Interpreter
//============================================================================
LGP.FaceSprite.Game_Interpreter_clear = Game_Interpreter.prototype.clear;
Game_Interpreter.prototype.clear = function() {
    LGP.FaceSprite.Game_Interpreter_clear.call(this);
    this.clearFaceSpriteInformation();
};

LGP.FaceSprite.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    LGP.FaceSprite.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'FaceSpriteName') this.setFaceSpriteName(args);
    if (command === 'FaceSpriteIndex') this.setFaceSpriteIndex(args);
    if (command === 'FaceSpritePosition') this.setFaceSpritePosition(args);
    if (command === 'FaceSpriteCustomPosition') this.setFaceSpriteCustomPosition(args);
    if (command === 'FaceSpriteClear') this.setFaceSpriteEnd();
};

//clearFaceSpriteInformation
Game_Interpreter.prototype.clearFaceSpriteInformation = function() {
    this._spriteGraphicName = '';
    this._spriteGraphicIndex = 0;
    this._spriteGraphicPositionX = 0;
    this._spriteGraphicPositionY = 0;
};


//setFacespriteName
Game_Interpreter.prototype.setFaceSpriteName = function(args) {
    var text = '';
    if (args.length === 1) return this._spriteGraphicName = String(args[0]);
    for (var i = 0; i < args.length; ++i) {
      text = text + ' ' + args[i];
    }
    this._spriteGraphicName = text;  
    this.setFaceSpriteStart();
};


//setFaceSprtieIndex
Game_Interpreter.prototype.setFaceSpriteIndex = function(args) {
    this._spriteGraphicIndex = parseInt(args[0]);
    this.setFaceSpriteStart();
};

//setFaceSpritePositin
Game_Interpreter.prototype.setFaceSpritePosition = function(args) {
    var index = parseInt(args[0]); 
    var width = Graphics.boxWidth; //- //Window_Base._faceWidth;
    var height = Graphics.boxHeight; //- Window_Base._faceHeight;
    var spriteposition;
    var spriteGraphicPositionGrid = {
        BL : {x: width * 0.05, y: height * 0.4}, 
        BR : {x: width * 0.83, y: height * 0.4}, 
        TL : {x: width * 0.05, y: height * 0.1},
        TR : {x: width * 0.83, y: height * 0.1}   
    };
    switch (index) {
        case 1:
            spriteposition = spriteGraphicPositionGrid.BL;break;
        case 3:
            spriteposition = spriteGraphicPositionGrid.BR;break;
        case 7:
            spriteposition = spriteGraphicPositionGrid.TL;break;
        case 9:
            spriteposition = spriteGraphicPositionGrid.TR;break;
        default: return;    
    }   
    this._spriteGraphicPositionX = Math.floor(spriteposition.x);
    this._spriteGraphicPositionY = Math.floor(spriteposition.y);  
    this.setFaceSpriteStart();
};

//setFaceSpriteCustomPosition
Game_Interpreter.prototype.setFaceSpriteCustomPosition = function(args) {
    var x = parseInt(args[0]);
    var y = parseInt(args[1]);
    this._spriteGraphicPositionX = Math.floor(x);
    this._spriteGraphicPositionY = Math.floor(y); 
    this.setFaceSpriteStart();
};

//setFaceSpriteStart
Game_Interpreter.prototype.setFaceSpriteStart = function() {
    if (!this._spriteGraphicName) return;
                                                                                              
    var faceSpriteData = [
        this._spriteGraphicName,
        this._spriteGraphicIndex,
        this._spriteGraphicPositionX,
        this._spriteGraphicPositionY
    ];     
    var scene = SceneManager._scene;
    if (scene._faceSpriteWindow) scene.startFaceSpriteWindow(faceSpriteData);
};

//setFaceSpriteEnd
Game_Interpreter.prototype.setFaceSpriteEnd = function() {
    var scene = SceneManager._scene;
    if (scene._faceSpriteWindow) scene.clearFaceSpriteWindow();
    this.clearFaceSpriteInformation();
};


//=============================================================================
// Scene_Base
//=============================================================================
Scene_Base.prototype.createFaceSpriteWindow = function() {
    this._faceSpriteWindow = new Window_FaceSprite();
    this.addChild(this._faceSpriteWindow);
};
    
//startFaceSpriteWindow
Scene_Base.prototype.startFaceSpriteWindow = function(faceSpriteData) {
    this._faceSpriteWindow.setFaceSpriteData(faceSpriteData);  
};

//clearFaceSpriteWindow
Scene_Base.prototype.clearFaceSpriteWindow = function() {
    this._faceSpriteWindow.clearFaceSpriteData();
};


//=============================================================================
// Scene_Battle
//=============================================================================

//createAllWindows
LGP.FaceSprite.Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    LGP.FaceSprite.Scene_Battle_createAllWindows.call(this);
    this.createFaceSpriteWindow();
};

//createAllWindows
//=============================================================================
// Scene_Map
//=============================================================================
LGP.FaceSprite.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    LGP.FaceSprite.Scene_Map_createAllWindows.call(this);
    this.createFaceSpriteWindow();
};


//============================================================================
// Window_FaceSprite
//============================================================================
function Window_FaceSprite() {
    this.initialize.apply(this, arguments);
}

Window_FaceSprite.prototype = Object.create(Window_Base.prototype);
Window_FaceSprite.prototype.constructor = Window_FaceSprite;

//initialize
Window_FaceSprite.prototype.initialize = function() {
    var ww = this._faceWidth;
    var wh = this._faceHeight;
    Window_Base.prototype.initialize.call(this, 0, 0, ww, wh);
    this.clear();
    this.hide();
    this.close();
};

//clear
Window_FaceSprite.prototype.clear = function() {
    this._graphicBitmap = undefined;
    this._graphicLoaded = false;
    this._graphicLoading = false;
    this._graphicName = '';
    this._graphicIndex = 0;
    this._graphicPostionX = 0;
    this._graphicPostionY = 0;
};

//update
Window_FaceSprite.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this.isHideFaceSpriteWindow()) {
        //this.hide();
        this.close();
    } else if (this._graphicLoaded) {
        if (this._graphicLoading && this._graphicBitmap.width <= 0) return;
        this.refresh();
        this.show();
        this.open();
    }else if (!this._graphicName) {
       this.processFaceSpriteData();
    }
};

//isHideFaceSpriteWindow
Window_FaceSprite.prototype.isHideFaceSpriteWindow = function() {
    if ($gameParty.inBattle() && BattleManager._victoryPhase) return true;
    if (!this._show) return true;
    return false;
};

//processFaceSpriteData
Window_FaceSprite.prototype.processFaceSpriteData = function() {
    var faceSpriteData = this._currentData;
    if (!faceSpriteData) return;
    this._graphicName = faceSpriteData[0] || '';
    this._graphicIndex = faceSpriteData[1] || 0;
    this._graphicPositionX = faceSpriteData[2] || 0;
    this._graphicPositionY = faceSpriteData[3] || 0;
    this.loadFaceSprite();
    this._graphicLoaded = true;
};

//setFaceSpriteData
Window_FaceSprite.prototype.setFaceSpriteData = function(faceSpriteData) {
    if (!faceSpriteData) return;
    this._currentData = faceSpriteData;
    this._show = true; 
    this.hide();
    this.close(); 
};

//clearFaceSpriteData
Window_FaceSprite.prototype.clearFaceSpriteData = function() {
    this._currentData = [];
    this._show = false;
    this.show();
    this.open();
};

//loadFaceSpriteData
Window_FaceSprite.prototype.loadFaceSprite = function() {
    this._graphicLoading = false;
    this._graphicBitmap = ImageManager.loadFace(this._graphicName);
    this._graphicLoading = true;
};

//refresh
Window_FaceSprite.prototype.refresh = function() {
    this.contents.clear();
    this.move(this._graphicPositionX,this._graphicPositionY, Window_Base._faceWidth, Window_Base._faceHeight)
    this.drawFaceSprite();
    this.clear();    
};

//drawFaceSprite
Window_FaceSprite.prototype.drawFaceSprite = function(){
    this._faceSprite = new Sprite();
    this._faceSprite.bitmap = new Bitmap(144,144);  

    var width = width || Window_Base._faceWidth;
    var height = height || Window_Base._faceHeight;
    var bitmap = ImageManager.loadFace(this._graphicName);
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(0 + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(0 + Math.max(height - ph, 0) / 2);
    var sx = this._graphicIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(this._graphicIndex / 4) * ph + (ph - sh) / 2;
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

