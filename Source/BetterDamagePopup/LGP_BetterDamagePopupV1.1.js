//=============================================================================
// Lunar Guard Plugins - Better Damage Popup
// LGP_BetterDamagePopup.js
//=============================================================================

var Imported = Imported || {};
Imported.LGP_BetterDamagePopup = true;

var LGP = LGP || {};
LGP.BDP = LGP.BDP || {};
LGP.BDP.version = 1.1;

/*:
 * @title Better Damage Popup
 * @author Azel
 * @date 13.07.18
 * @version 1.1
 * @filename LGP_BetterDamagePopup.js
 *
 * @plugindesc v1.1 Improves Damage Popups by using Text instead of Picture.
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
 * @desc YEP_AbsorptionBarrier Required! The Color of the Absorbed Damage Number
 * @default rgb(255,255,255)
 *
 * @param Absorbed Damage Outline Color
 * @parent ---Color Settings---
 * @desc YEP_AbsorptionBarrier Required! The Outline Color of the Absorbed Damage Number. 
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
 * Goals for later
 * ============================================================================
 *
 *      [DONE] Replace picture with bitmap text.
 *      [DONE] Change font name, Font Size, text color and text color of the numbers.
 *      [DONE] Highlights critical damage.
 *      [DONE] Considers Yanfly's absorption barrier plugin and highlights absorbed Damage.
 *      [DONE] Number Format can be changed.
 *      [    ] A combo counter that displays the combined damage of an attack.
 * 
 * ============================================================================
 * Desription
 * ============================================================================
 *
 * Make sure you place this plugin under these ones to achive full compatibility:
 * YEP_BattleEngineCore - *To prevent conflict
 * YEP_AborbtionBarrier - Enables Custom Shield Popup
 * YEP_LoadCustomFonts  - Enabeles the freedom of choosing Custom Fonts
 * LGP_CustomWindowText - Enables shadow for Damage Popup Numbers.
 *
 * This plugin changes the damage popup system of RPG Maker MV. Basically  it gets
 * rid of the picture and uses bitmap text instead. So we can easily  change the 
 * looks of the damage popup numbers.
 * 
 * *YEP_BattleEngineCore already uses damage popup. This plugin overwrites his
 * code.
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * v1.0 - Fresh out of the oven.
 * v1.1 - Rewrote as a seperate plugin with added parameter settings.
 *
 */
//=============================================================================


//=============================================================================
// Parameter and Variables
//=============================================================================
LGP.Parameters = PluginManager.parameters('LGP_BetterDamagePopup');
LGP.Param = LGP.Param || {};

LGP.Param.BDPfont = LGP.Parameters['Font'];
LGP.Param.BDPfontSize = Number(LGP.Parameters['Font Size']);
LGP.Param.BDPtextShadow = eval(LGP.Parameters['Text Shadow']);

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
// Sprite_Battler
//=============================================================================

Sprite_Battler.prototype.setupDamagePopup = function() {
    if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            var sprite = new Sprite_Damage();
            var cx = this.x - this.width / 2 + sprite._fontSize / 2;
            var cy = this.y - this.height / 2 - sprite._fontSize / 2;
            sprite.x = (this._damages.length > 0) ? cx - 50 + Math.random() * 50 + 10 : cx;
            sprite.y = (this._damages.length > 0) ? cy - 50 + Math.random() * 50 + 10 : cy;
            sprite.setup(this._battler);
            this._damages.push(sprite);
            this.parent.parent.addChild(sprite);
        }
        this._battler.clearDamagePopup();
        this._battler.clearResult();
    }
};


//=============================================================================
// Sprite_Damage
//=============================================================================

LGP.BDP.Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
Sprite_Damage.prototype.initialize = function() {
    LGP.BDP.Sprite_Damage_initialize.call(this);
    this.clearData();
    this.createSprites();
};

Sprite_Damage.prototype.clearData = function() {
    this._requestRefresh = false;
    this._isBlocked = false;
    this._isMissed = false;
    this._isCrit = false;   
    this._fontSize = LGP.Param.BDPfontSize;
    this._fontFace = LGP.Param.BDPfont;
    this._hpDmg = 0;
    this._mpDmg = 0;
    this._scaleCap = 2;
    this.refreshDuration();
    this.refreshMissDuration();
    this.refreshCritDuration();
};

Sprite_Damage.prototype.refreshDuration = function() {
    this._duration = 90;
};

Sprite_Damage.prototype.refreshMissDuration = function() {
    this._missDuration = 60;
};

Sprite_Damage.prototype.refreshCritDuration = function() {
    this._critDuration = this.getFullCritDuration();
};

Sprite_Damage.prototype.getFullCritDuration = function() {
    return 20;
};

Sprite_Damage.prototype.createSprites = function(){
    this.createHpNumberSprite();
    this.createMpNumberSprite();
    this.createShNumberSprite();
    this.createMissSprite();
    this.createCritSprite();
    this.createComboSprite();
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

Sprite_Damage.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateDurations();
    this.updateScale();
    this.updatePosition();
    this.updateFlash();
    this.updateOpacity();
    if (this._requestRefresh) this.refresh();
};

Sprite_Damage.prototype.updateDurations = function() {
    if (this._duration > 0) this._duration--;
    if (this._missDuration > 0) this._missDuration--;
    if (this._critDuration > 0) this._critDuration--;
};

Sprite_Damage.prototype.updateScale = function() {
    if (!this._isCrit) return;
    if (!this._critDuration > 0) return;
    var sprite = this.children[0];
    var d = this._critDuration;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.scale.x = Math.min(this._scaleCap, Math.max(1, (this.getFullCritDuration() / 100 * d)));
    sprite.scale.y = sprite.scale.x;
};

Sprite_Damage.prototype.updatePosition = function(){
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
};

Sprite_Damage.prototype.updateFlash = function() {
    return;
};

Sprite_Damage.prototype.updateOpacity = function() {
    if (this._duration < 10) {
        this.opacity = 255 * this._duration / 10;
    }

    if (this._missDuration < 10){
        this.children[3].opacity = 255 * this._missDuration / 10;
    }
};

Sprite_Damage.prototype.refresh = function() {
    if (this._hpDmg !== 0) this.drawNumber(0, this._hpDmg);
    if (this._mpDmg !== 0) this.drawNumber(2, this._mpDmg);
    if (this._isMissed) this.drawMiss();
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

    var w = (this._fontSize) * number.length;
    var h = this._fontSize * 2;
    
    var numberSprite = this.children[0];
    if (!numberSprite.bitmap) {
        numberSprite.bitmap = new Bitmap(w, h);
        numberSprite.bitmap.fontFace = this._fontFace;
        numberSprite.bitmap.fontSize = this._fontSize;
        if (Imported.LGP_CustomWindowText) numberSprite.bitmap.textShadow = LGP.Param.BDPtextShadow;
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
    var w = (this._fontSize) * string.length + 20;
    if (!missSprite.bitmap) {
        missSprite.bitmap = new Bitmap(300, this._fontSize * 2);
        missSprite.bitmap.fontFace = this._fontFace;
        missSprite.bitmap.fontSize = this._fontSize;
        if (Imported.LGP_CustomWindowText) missSprite.bitmap.textShadow = LGP.Param.BDPtextShadow;
        missSprite.outlineColor = LGP.Param.BDPmissC;        
        missSprite.textColor = LGP.Param.BDPmissOC;
    }    
    var bitmap = missSprite.bitmap;  
    bitmap.drawText(string, 0, 0, w, this._fontSize * 2, 'left');
};

//=============================================================================
// end of file
//=============================================================================
