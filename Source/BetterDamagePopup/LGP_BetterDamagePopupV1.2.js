//=============================================================================
// Lunar Guard Plugins - Better Damage Popup
// LGP_BetterDamagePopup.js
//=============================================================================

var Imported = Imported || {};
Imported.LGP_BetterDamagePopup = true;

var LGP = LGP || {};
LGP.BDP = LGP.BDP || {};
LGP.BDP.version = 1.2;

/*:
 * @title Better Damage Popup
 * @author Azel
 * @date 13.07.18
 * @version 1.1
 * @filename LGP_BetterDamagePopup.js
 *
 * @plugindesc v1.1 Improves Damage Popups by using Text instead of Picture.
 *
 * @param ---Popup Settings---
 * @default
 *
 * @param Popup Duration
 * @parent ---Popup Settings---
 * @desc The duration of the damage popup in frames.
 * @type number
 * @default 90
 *
 * @param Popup Crit Duration
 * @parent ---Popup Settings---
 * @desc The duration of the Crit damage effect in frames.
 * @type number
 * @default 20
 *
 * @param Popup Miss Duration
 * @parent ---Popup Settings---
 * @desc The duration of the Miss effect in frames.
 * @type number
 * @default 30
 *
 * @param Popup Position Code
 * @parent ---Popup Settings---
 * @desc Custom popup postion code. Run in Sprite_Battler. Leave it empty to run default code by Yanfly.
 * @type note
 * @default ""
 *
 * @param Popup Movement Code
 * @parent ---Popup Settings---
 * @desc Custom popup movement Code. Run in Sprite_Damage. Leave it empty to run default code by LGP.
 * @type note
 * @default ""
 *
 * @param ---Font Settings---
 * @default
 *
 * @param Font
 * @parent ---Font Settings---
 * @desc YEP_CustomFonts Required! The Font that's beeing used for Damage Popups.
 * @default GameFont
 *
 * @param Font Size
 * @parent ---Font Settings---
 * @desc Size of the Damage Popup Font
 * @type number
 * @default 28
 *
 * @param Font Size Buffer
 * @parent ---Font Settings---
 * @desc If by any means the damage number displayed got cut off a bit, 
 * increase here the number a bit. This can happen.
 * @type number
 * @default 20
 *
 * @param Text Shadow
 * @parent ---Font Settings---
 * @desc Requires LGP_CustomWindowText. Drop a Shadow behind the Number
 * @type boolean
 * @default true
 *
 * @param ---Format Settings---
 * @default 
 *
 * @param Damage Number Format
 * @parent ---Format Settings---
 * @desc Popup Number Format when the Damange has been done.
 * @default "-" + number
 *
 * @param Recover Number Format
 * @parent ---Format Settings---
 * @desc Popup Number Format when the Damange has been recovered.
 * @default "+" + number
 *
 * @param Blocked Number Format
 * @parent ---Format Settings---
 * @desc Popup Number Format when the Damange has been blocked.
 * @default "(" + number + ")"
 *
 * @param Critical Number Format
 * @parent ---Format Settings---
 * @desc Popup Number Format when the Damange has been Critical.
 * @default number + "!"
 *
 * @param ---Miss Settings---
 * @default
 *
 * @param Miss Text
 * @parent ---Miss Settings---
 * @desc Text for the "Miss" Popup
 * @default MISS
 *
 * @param ---Color Settings---
 * @default
 *
 * @param HP Damage Color
 * @parent ---Color Settings---
 * @desc The Color of the HP Damage Number.
 * @default rgb(255,50,50)
 *
 * @param HP Damage Outline Color
 * @parent ---Color Settings---
 * @desc The Outline Color of the HP Damage Number.
 * @default rgb(100,0,0)
 *
 * @param HP Recover Color
 * @parent ---Color Settings---
 * @desc The Color of the HP Recover Number.
 * @default rgb(50,255,50)
 *
 * @param HP Recover Outline Color
 * @parent ---Color Settings---
 * @desc The Outline Color of the HP Recover Number.
 * @default rgb(0,100,0)
 *
 * @param Absorbed Damage Color
 * @parent ---Color Settings---
 * @desc YEP_AbsorptionBarrier Required! The Color of the Absorbed 
 * Damage Number
 * @default rgb(255,255,255)
 *
 * @param Absorbed Damage Outline Color
 * @parent ---Color Settings---
 * @desc YEP_AbsorptionBarrier Required! The Outline Color of the Absorbed
 * Damage Number. 
 * @default rgb(100,100,100)
 *
 * @param Critical Damage Color
 * @parent ---Color Settings---
 * @desc The Color of the Critical Damage Number.
 * @default rgb(255,100,50)
 *
 * @param Critical Damage Outline Color
 * @parent ---Color Settings---
 * @desc The Outline Color of the Critical Damage Number.
 * @default rgb(100,25,0)
 *
 * @param MP Damage Color
 * @parent ---Color Settings---
 * @desc The Color of the MP Damage Number.
 * @default rgb(100,150,150)
 *
 * @param MP Damage Outline Color
 * @parent ---Color Settings---
 * @desc The Outline Color of the MP Damage Number.
 * @default rgb(0,50,50)
 *
 * @param MP Recover Color
 * @parent ---Color Settings---
 * @desc The Color of the MP Recover Number.
 * @default rgb(150,255,255) 
 *
 * @param MP Recover Outline Color
 * @parent ---Color Settings---
 * @desc The Outline Color of the MP Recover Number.
 * @default rgb(50,100,100)
 *
 * @param Miss Color
 * @parent ---Color Settings---
 * @desc The Color of the "Miss" String.
 * @default rgb(50,50,50)
 *
 * @param Miss Outline Color
 * @parent ---Color Settings---
 * @desc The Outline Color of the "Miss" String.
 * @default rgb(150,150,150)
 *
 * @help
 * ============================================================================
 * Yanfly's Lunatic Mode Script Calls
 * ============================================================================
 * ----------------------------------------------------------------------------
 * customPopup(TEXT, FORMAT) -> works only Battler, Actor and Enemy.
 * ----------------------------------------------------------------------------
 * TEXT    - String: that will be displayed.
 * FORMAT  - NUMBER: 0 - Default. No format will be applied.
 *                   1 - Will be formated as if it would be a recover.
 *                   2 - Will be formated as if it would be received damage.
 *
 * Example (From a State Notebox):
 *
 * <Custom Action Start Effect> //from YEP_BuffsStatesCore
 *   var value = Math.floor(user.mhp * 0.05);
 *   user.customPopup("HP Recover: " + value, 1);
 *   user.gainHp(value);
 * </Custom Action Start Effect>
 *
 * Before every Action the user does, one recovers 5% of ones Max HP. Since 
 * a default damagepopup wouldn't appear on the screen, we call customPopup 
 * instead.
 *
 * ============================================================================
 * Custom Formula Defaults
 * ============================================================================
 * ----------------------------------------------------------------------------
 * Popup Position Code
 * ----------------------------------------------------------------------------
 * Origin Point of every Damage Popup Number on the screen.
 * The Battler Sprite has an anchor.x = 0.5 and anchor.y = 1.0. This means the 
 * "true" position of the sprite is the bottom middle point. The anchor of the 
 * damage popup sprite is in the very center.
 * 'this'              - Sprite_Battler
 * 'this._damagePopup' - Array: Yanfly's Solution. Stores temporary Sprites.
 * 'sprite'            - Sprite_Damage: A reference variable.
 *
 * Example:
 *var cx = this.x;
 *var cy = this.y - this.height / 2;
 *sprite.x = cx + (this._battler._damagePopup.length > 0) ? cx - this.width / 2 + Math.random() * this.width / 2 + 10 : cx;
 *sprite.y = cy + (this._battler._damagePopup.length > 0) ? cy - this.height / 2 + Math.random() * this.height / 2 + 10 : cy;
 *
 * Origin postion is in the center. Then after the first hit all other spawn on
 * a random postion. Be careful with your coding, since one mistake
 * can be really awkward to find.
 *
 * ----------------------------------------------------------------------------
 * Popup Movement Code
 * ----------------------------------------------------------------------------
 * The default code for the custom Movement code.
 * 'this'               - Sprite: Sprite_Damage.
 * 'this.children[0]'   - Sprite: Used for Numbers.
 * 'this.children[3]'   - Sprite: Used for "Miss".
 * 'this.children[6]'   - Sprite: Used for custom text.
 * 'this._hpDmg'        - Number: HP Damage Value, if below 0 it's a recover.
 * 'this._mpDmg'        - Number: MP Damage Value. If below 0 it's a recover.
 * 'this._isCrit'       - Boolean: True means Damage Value has been critical.
 * 'this._isMissed'     - Boolean: True means the action has been a miss.
 * 'this._customText'   - Array: 1 -> Text; 2 -> Format (lookup in descritpoin)
 * 'this._duration'     - Number: The lifetime of the popup in frames.
 * 'this._critDuration' - Number: The duration of a crit effect in frames
 * 'this.opacity'       - Number: the opacite of Sprite_Damage. Also the 
 *                        instance where damage popups can fade out.
 *
 * Example:
 *
if (this._isCrit && this._critDuration > 0) {
    var sprite = this.children[0];
    var d = this._critDuration;
    sprite.scale.x = Math.min(2, Math.max(1, (this.getFullCritDuration() / 100 * d)));
    sprite.scale.y = sprite.scale.x;   
}
if (this._hpDmg < 0 || this._mpDmg < 0) {
    if (!this._critDuration > 0){
        var sprite = this.children[0];
        var d = this._duration;
        var y = (d - 1) / d;
        sprite.y -= y;
    }
}
if (this._isMissed) {
    var sprite = this.children[3];
    var d = this._duration;
    var x = (d - 1) / d;
    sprite.x += x;
}
if (this._duration < 10) {
    this.opacity = 255 * this._duration / 10;
}

if (this._missDuration < 10){
    this.children[3].opacity = 255 * this._missDuration / 10;
}
 *
 * I hope you know JavaScript. Here you can fully control Movement, scaling 
 * and fadeout of the sprites. Be careful with your coding, since one mistake
 * can be really awkward to find.
 *
 * ============================================================================
 * Goals for later
 * ============================================================================
 *
 *      [DONE] Replace picture with bitmap text.
 *      [DONE] Change font name, Font Size, text color and text color of the 
 *             numbers.
 *      [DONE] Highlights critical damage.
 *      [DONE] Considers Yanfly's absorption barrier plugin and highlights
 *             absorbed damage.
 *      [DONE] Number Format can be changed.
 *      [DONE] Yanfly lunatic mode scriptcall to manualy displays a custom 
 *             popup.
 *      [DONE] Custom popup postions and movement setup in parameters.
 *      [    ] Custom state formats.
 *      [    ] Custom popup can display icons.
 *      [    ] A combo counter that displays the combined damage of an attack.
 * 
 * ============================================================================
 * Desription
 * ============================================================================
 *
 * Make sure you place this plugin under these to achive full compatibility:
 * YEP_BattleEngineCore - Definitly Required! This Plugin reworks his solution.
 * YEP_AborbtionBarrier - Enables Custom Shield Popup
 * YEP_LoadCustomFonts  - Enabeles the freedom of choosing Custom Fonts
 * LGP_CustomWindowText - Enables shadow for Damage Popup Numbers.
 *
 * This plugin changes the damage popup system of RPG Maker MV. Basically it
 * gets rid of the picture and uses bitmap text instead. So we can easily
 * change the looks and behaiviors of the damage popup numbers.
 * 
 * *YEP_BattleEngineCore already uses damage popup. This plugin overwrites his
 * code.
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * v1.0 - Fresh out of the oven.
 * v1.1 - Rewrote as a seperate plugin with added parameter settings.
 * v1.2 - New script call for Yanfly's Lunatic Mode "customDamagePopup()"
 *      - New Parameter to manually setup popup position, movement and 
 *        duration.
 *      - Fix for broad custom Fonts. Can be setup in plugin parameters.
 *
 */
//=============================================================================

if (Imported.YEP_BattleEngineCore) {

//=============================================================================
// Parameter and Variables
//=============================================================================
LGP.Parameters = PluginManager.parameters('LGP_BetterDamagePopup');
LGP.Param = LGP.Param || {};

LGP.Param.BDPpopDuration = Number(LGP.Parameters['Popup Duration']);
LGP.Param.BDPpopCritDuration = Number(LGP.Parameters['Popup Crit Duration']);
LGP.Param.BDPpopMissDuration = Number(LGP.Parameters['Popup Miss Duration']);
LGP.Param.BDPpopPosCode = JSON.parse(LGP.Parameters['Popup Position Code']);
LGP.Param.BDPpopMovCode = JSON.parse(LGP.Parameters['Popup Movement Code']);

LGP.Param.BDPfont = LGP.Parameters['Font'];
LGP.Param.BDPfontSize = Number(LGP.Parameters['Font Size']);
LGP.Param.BDPtextShadow = eval(LGP.Parameters['Text Shadow']);
LGP.Param.BDPfontSizeBuffer = Number(LGP.Parameters['Font Size Buffer']);

LGP.Param.BDPdamageFormat = LGP.Parameters['Damage Number Format'];
LGP.Param.BDPrecoverFormat = LGP.Parameters['Recover Number Format'];
LGP.Param.BDPblockFormat = LGP.Parameters['Blocked Number Format'];
LGP.Param.BDPcritFormat = LGP.Parameters['Critical Number Format'];

LGP.Param.BDPmissText = LGP.Parameters['Miss Text'];

LGP.Param.BDPhpDmgC = LGP.Parameters['HP Damage Color'];
LGP.Param.BDPhpDmgOC = LGP.Parameters['HP Damage Outline Color'];
LGP.Param.BDPhpRecC = LGP.Parameters['HP Recover Color'];
LGP.Param.BDPhpRecOC = LGP.Parameters['HP Recover Outline Color'];

LGP.Param.BDPshC = LGP.Parameters['Absorbed Damage Color'];
LGP.Param.BDPshOC = LGP.Parameters['Absorbed Damage Outline Color'];
LGP.Param.BDPcritC = LGP.Parameters['Critical Damage Color'];
LGP.Param.BDPcritOC = LGP.Parameters['Critical Damage Outline Color'];

LGP.Param.BDPmpDmgC = LGP.Parameters['MP Damage Color'];
LGP.Param.BDPmpDmgOC = LGP.Parameters['MP Damage Outline Color'];
LGP.Param.BDPmpRecC = LGP.Parameters['MP Recover Color'];
LGP.Param.BDPmpRecOC = LGP.Parameters['MP Recover Outline Color'];

LGP.Param.BDPmissC = LGP.Parameters['Miss Color'];
LGP.Param.BDPmissOC = LGP.Parameters['Miss Outline Color'];

//=============================================================================
// Game_Battler
//=============================================================================
LGP.BDP.Game_ActionResult_clear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function() {
    LGP.BDP.Game_ActionResult_clear.call(this);
    this.customText = ['', 0];
};

Game_ActionResult.prototype.setCustomText = function(value , format) {
    this.customText[0] = value;
    this.customText[1] = format;
};

Game_ActionResult.prototype.hasCustomText = function() {
    return (this.customText[0] !== '');
};

//=============================================================================
// Game_Battler
//=============================================================================

Game_Battler.prototype.customPopup = function(value, format) {
    var result = this.result();
    result.setCustomText(value, format);
    if (result.hasCustomText) {
        var copyResult = JsonEx.makeDeepCopy(result);
        copyResult.hpAffected = false;
        copyResult.mpDamage = 0;
        this._damagePopup.push(copyResult);
    }
};

//=============================================================================
// Sprite_Battler
//=============================================================================
Sprite_Battler.prototype.setupDamagePopup = function() {
    if (this._battler.isDamagePopupRequested()) {
      if (this._battler.isSpriteVisible()) {
        var sprite = new Sprite_Damage();
        var code = LGP.Param.BDPpopPosCode;
        sprite.setup(this._battler);
        if (code === "") {
            console.log('yey');
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();        
            this.pushDamageSprite(sprite);
        } else {
            eval(code);    
        }
        BattleManager._spriteset.addChild(sprite);
        this._battler.clearResult();
      }
    } else {
      this._battler.clearDamagePopup();
    }
};


//=============================================================================
// Sprite_Damage
//=============================================================================

LGP.BDP.Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
Sprite_Damage.prototype.initialize = function() {
    LGP.BDP.Sprite_Damage_initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.clearData();
    this.createSprites();
};

Sprite_Damage.prototype.clearData = function() {
    this._requestRefresh = false;
    this._isBlocked = false;
    this._isMissed = false;
    this._isCrit = false;   
    this._isCustomText = false
    this._fontSize = LGP.Param.BDPfontSize;
    this._fontFace = LGP.Param.BDPfont;
    this._hpDmg = 0;
    this._mpDmg = 0;
    this._customText = [];
    this.refreshDuration();
    this.refreshMissDuration();
    this.refreshCritDuration();
};

LGP.BDP.Sprite_Damage_setup = Sprite_Damage.prototype.setup;
Sprite_Damage.prototype.setup = function(target) {
    var result = target._damagePopup[0];
    LGP.BDP.Sprite_Damage_setup.call(this, target);
    if (result.hasCustomText()) {
        this.setupCustomText(result.customText);
    }
};

Sprite_Damage.prototype.refreshDuration = function() {
    this._duration = this.getFullDuration();
};

Sprite_Damage.prototype.refreshMissDuration = function() {
    this._missDuration = this.getFullMissDuration();
};

Sprite_Damage.prototype.refreshCritDuration = function() {
    this._critDuration = this.getFullCritDuration();
};

Sprite_Damage.prototype.getFullDuration = function() {
    return LGP.Param.BDPpopDuration;
};

Sprite_Damage.prototype.getFullCritDuration = function() {
    return LGP.Param.BDPpopCritDuration;
};

Sprite_Damage.prototype.getFullMissDuration = function() {
    return LGP.Param.BDPpopMissDuration;
};

Sprite_Damage.prototype.createSprites = function(){
    this.createHpNumberSprite();
    this.createMpNumberSprite();
    this.createShNumberSprite();
    this.createMissSprite();
    this.createCritSprite();
    this.createComboSprite();
    this.createCustomSprite();
};

Sprite_Damage.prototype.createHpNumberSprite = function() {
    var hpNumberSprite = new Sprite();
    this.addChildAt(hpNumberSprite, 0);
};


Sprite_Damage.prototype.createMpNumberSprite = function() {
    var mpNumberSprite = new Sprite();
    this.addChildAt(mpNumberSprite, 1);
};

Sprite_Damage.prototype.createShNumberSprite = function() {
    var shNumberSprite = new Sprite();
    this.addChildAt(shNumberSprite, 2);
};

Sprite_Damage.prototype.createMissSprite = function() {
    var missSprite = new Sprite();
    this.addChildAt(missSprite, 3);
};

Sprite_Damage.prototype.createCritSprite = function() {
    var critSprite = new Sprite();
    this.addChildAt(critSprite, 4);
};

Sprite_Damage.prototype.createComboSprite = function() {
    var comboSprite = new Sprite();
    this.addChildAt(comboSprite, 5);
};

Sprite_Damage.prototype.createCustomSprite = function() {
    var customSprite = new Sprite();
    this.addChildAt(customSprite, 6);
};

Sprite_Damage.prototype.createDigits = function(type, value) {
    if (type == 0) {
        this._hpDmg = value;
    } else if (type == 2) {
        this._mpDmg = value;
    }
    this._requestRefresh = true;
};

Sprite_Damage.prototype.createMiss = function() {
    this._isMissed = true;
    this._requestRefresh = true;
};

Sprite_Damage.prototype.setupCriticalEffect = function() {
    this._isCrit = true;
    this._requestRefresh = true;
};

Sprite_Damage.prototype.setupBarrierEffect = function() {
    this._isBlocked = true;
    this._requestRefresh = true;
};

Sprite_Damage.prototype.setupCustomText = function(value) {
    this._customText = value;
    this._isCustomText = true;
    this._requestRefresh = true;
};

Sprite_Damage.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateDurations();
    this.updateMovement();
    if (this._requestRefresh) this.refresh();
};

Sprite_Damage.prototype.updateDurations = function() {
    if (this._duration > 0) this._duration--;
    if (this._missDuration > 0) this._missDuration--;
    if (this._critDuration > 0) this._critDuration--;
};

Sprite_Damage.prototype.updateMovement = function(){
    var code = LGP.Param.BDPpopMovCode;
    if (code === ''){
        if (this._isCrit && this._critDuration > 0) {
            var sprite = this.children[0];
            var d = this._critDuration;
            sprite.scale.x = Math.min(2, Math.max(1, (this.getFullCritDuration() / 100 * d)));
            sprite.scale.y = sprite.scale.x;   
        }
        if (this._hpDmg < 0 || this._mpDmg < 0) {
            if (!this._critDuration > 0){
                var sprite = this.children[0];
                var d = this._duration;
                var y = (d - 1) / d;
                sprite.y -= y;
            }
        }
        if (this._isMissed) {
            var sprite = this.children[3];
            var d = this._duration;
            var x = (d - 1) / d;
            sprite.x += x;
        }
        if (this._duration < 10) {
            this.opacity = 255 * this._duration / 10;
        }

        if (this._missDuration < 10){
            this.children[3].opacity = 255 * this._missDuration / 10;
        }
    } else {
        eval(code);
    }
};


Sprite_Damage.prototype.refresh = function() {
    if (this._hpDmg !== 0) this.drawNumber(0, this._hpDmg);
    if (this._mpDmg !== 0) this.drawNumber(2, this._mpDmg);
    if (this._isMissed) this.drawMiss();
    if (this._isCustomText) this.drawCustomText();
    this._requestRefresh = false;
};

Sprite_Damage.prototype.drawNumber = function(type, value) {
    var number = Math.abs(value).toString();

    if (value < 0) {
    	number = eval(LGP.Param.BDPrecoverFormat.replace(number,value));	
    } else {
    	number = eval(LGP.Param.BDPdamageFormat.replace(number,value));	
    }

    if (this._isCrit) number = eval(LGP.Param.BDPcritFormat.replace(number,value));
    if (this._isBlocked) number = eval(LGP.Param.BDPblockFormat.replace(number,value));

    var w = (this._fontSize) * number.length + LGP.Param.BDPfontSizeBuffer;
    var h = this._fontSize * 2;
    
    var numberSprite = this.children[0];
    if (!numberSprite.bitmap) {
        numberSprite.bitmap = new Bitmap(w, h);
        numberSprite.bitmap.fontFace = this._fontFace;
        numberSprite.bitmap.fontSize = this._fontSize;
        numberSprite.anchor.x = 0.5;
        numberSprite.anchor.y = 0.5;
        if (Imported.LGP_CustomWindowText) numberSprite.bitmap.textShadow = LGP.Param.BDPtextShadow;
    } else {
        numberSprite.bitmap.clear();
    }
    var bitmap = numberSprite.bitmap;  
  
    if (type == 0) {
        if (value > 0) {
            if (this._isBlocked) {
                bitmap.textColor = LGP.Param.BDPshC;   
                bitmap.outlineColor = LGP.Param.BDPshOC;        
            } else {
                if (this._isCrit) {
                    bitmap.textColor = LGP.Param.BDPcritC;   
                    bitmap.outlineColor = LGP.Param.BDPcritOC;        
                } else {
                    bitmap.textColor = LGP.Param.BDPhpDmgC;   
                    bitmap.outlineColor = LGP.Param.BDPhpDmgOC;        
                }
            }
        } else {
	        bitmap.textColor = LGP.Param.BDPhpRecC;   
	        bitmap.outlineColor = LGP.Param.BDPhpRecOC;    
        }
    } else if (type == 2) {
        if (value > 0) {
            bitmap.textColor = LGP.Param.BDPmpDmgC;
            bitmap.outlineColor = LGP.Param.BDPmpDmgOC
            } else {
            bitmap.textColor = LGP.Param.BDPmpRecC;
            bitmap.outlineColor = LGP.Param.BDPmpRecOC;
        } 
    }
    bitmap.drawText(number, 0, 0, w, h, 'center');
};

Sprite_Damage.prototype.drawMiss = function() {
    var missSprite = this.children[3];
    var string = LGP.Param.BDPmissText;
    var w = (this._fontSize) * string.length + LGP.Param.BDPfontSizeBuffer;
    if (!missSprite.bitmap) {
        missSprite.bitmap = new Bitmap(w, this._fontSize * 2);
        missSprite.bitmap.fontFace = this._fontFace;
        missSprite.bitmap.fontSize = this._fontSize;
        missSprite.anchor.x = 0.5;
        missSprite.anchor.y = 0.5;
        if (Imported.LGP_CustomWindowText) missSprite.bitmap.textShadow = LGP.Param.BDPtextShadow;
        missSprite.outlineColor = LGP.Param.BDPmissC;        
        missSprite.textColor = LGP.Param.BDPmissOC;
    } else {
        missSprite.bitmap.clear();
    }  
    var bitmap = missSprite.bitmap;  
    bitmap.drawText(string, 0, 0, w, this._fontSize * 2, 'center');    
};

Sprite_Damage.prototype.drawCustomText = function() {
    var customSprite = this.children[6];
    var string = this._customText[0];

    var w = (this._fontSize) * string.length + LGP.Param.BDPfontSizeBuffer;

    if (!customSprite.bitmap) {
        customSprite.bitmap = new Bitmap(w, this._fontSize * 2);
        customSprite.bitmap.fontFace = this._fontFace;
        customSprite.bitmap.fontSize = this._fontSize;
        customSprite.anchor.x = 0.5;
        customSprite.anchor.y = 0.5;
        if (Imported.LGP_CustomWindowText) customSprite.bitmap.textShadow = LGP.Param.BDPtextShadow;
        customSprite.outlineColor = LGP.Param.BDPmissC;        
        customSprite.textColor = LGP.Param.BDPmissOC;
    } else {
        customSprite.bitmap.clear();
    }  

    var bitmap = customSprite.bitmap;  

    if (this._customText[1] == 2) {   
        bitmap.textColor = LGP.Param.BDPhpDmgC;   
        bitmap.outlineColor = LGP.Param.BDPhpDmgOC;        
    } else if (this._customText[1] == 1) {
        bitmap.textColor = LGP.Param.BDPhpRecC;   
        bitmap.outlineColor = LGP.Param.BDPhpRecOC;    
    }
    bitmap.drawText(string, 0, 0, w, this._fontSize * 2, 'center');
};



//=============================================================================
// end of file
//=============================================================================
}