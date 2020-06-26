//=============================================================================
// Lunar Guard Plugins - Better Damage Popup
// LGP_BetterDamagePopup.js
//=============================================================================

var Imported = Imported || {};
Imported.LGP_BetterDamagePopup = true;

var LGP = LGP || {};
LGP.BDP = LGP.BDP || {};
LGP.BDP.version = 1.7;

/*:
 * @title Better Damage Popup
 * @author Azel
 * @date 13.07.18
 * @version 1.6
 * @filename LGP_BetterDamagePopup.js
 *
 * @plugindesc v1.6 YEP_BattleEngineCore required! 
 * completly reworked the damage popup system.
 *
 * @param ---Font Settings---
 * @default
 *
 * @param Font Family
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
 * @default 10
 *
 * @param Text Shadow
 * @parent ---Font Settings---
 * @desc Requires LGP_CustomWindowText. Drop a Shadow behind the Number
 * @type boolean
 * @default true
 *
 * @param ---Popup Duration Settings---
 * @default
 *
 * @param Popup Duration
 * @parent ---Popup Duration Settings---
 * @desc The duration of the damage popup in frames.
 * @type number
 * @default 90
 *
 * @param Popup Number Duration
 * @parent ---Popup Duration Settings---
 * @desc The duration of the number in frames.
 * @type number
 * @default 40
 *
 * @param Popup Crit Duration
 * @parent ---Popup Duration Settings---
 * @desc The duration of the Crit damage effect in frames.
 * @type number
 * @default 20
 *
 * @param Popup Miss Duration
 * @parent ---Popup Duration Settings---
 * @desc The duration of the Miss effect in frames.
 * @type number
 * @default 30
 * 
 * @param ---Popup Custom Code---
 * @default
 *
 * @param Custom Text Values
 * @parent ---Popup Custom Code---
 * @desc Storage for your custom text you might wanna use.
 * @type text[]
 * @default ["+","-","EFFECTIVE","WEAK","ABSORBED","UP","DOWN"]
 *
 * @param Popup Position Code
 * @parent ---Popup Custom Code---
 * @desc Custom popup postion code. Run in Sprite_Battler. Leave it empty to run default code by Yanfly.
 * @type note
 * @default "// All Popup start from the sprite's center\nsprite.x = this.x;\nsprite.y = this.y - this.height / 2;"
 *
 * @param Popup Movement Code
 * @parent ---Popup Custom Code---
 * @desc Custom popup movement Code. Run in Sprite_Damage. Leave it empty to run default code by LGP.
 * @type note
 * @default ""
 *
 * @param Draw Number Popup Code
 * @parent ---Popup Custom Code---
 * @desc Here you can customize how damage will be displayed. Leave it empty to run default code by LGP.
 * @type note
 * @default ""
 *
 * @param Draw Miss Popup Code
 * @parent ---Popup Custom Code---
 * @desc Here you can customize how missing will be displayed. Leave it empty to run default code by LGP.
 * @type note
 * @default ""
 *
 * @param Draw Buff Popup Code
 * @parent ---Popup Custom Code---
 * @desc Here you can customize how buffs will be displayed. Leave it empty to run default code by LGP.
 * @type note
 * @default ""
 * 
 * @param Draw State Popup Code
 * @parent ---Popup Custom Code---
 * @desc Here you can customize how states will be displayed. Leave it empty to run default code by LGP.
 * @type note
 * @default ""
 *
 * @param Draw Custom Popup Code
 * @parent ---Popup Custom Code---
 * @desc Here you can customize how custom text will be displayed. Leave it empty to run default code by LGP.
 * @type note
 * @default ""
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
 * @param TP Damage Color
 * @parent ---Color Settings---
 * @desc The Color of the TP Damage Number.
 * @default rgb(150,150,100)
 *
 * @param TP Damage Outline Color
 * @parent ---Color Settings---
 * @desc The Outline Color of the TP Damage Number.
 * @default rgb(50,50,0)
 *
 * @param TP Recover Color
 * @parent ---Color Settings---
 * @desc The Color of the TP Recover Number.
 * @default rgb(255,255,150) 
 *
 * @param TP Recover Outline Color
 * @parent ---Color Settings---
 * @desc The Outline Color of the TP Recover Number.
 * @default rgb(100,100,50)
 *
 * @param Miss Color
 * @parent ---Color Settings---
 * @desc The Color of the "Miss" String.
 * @default rgb(255,255,255)
 *
 * @param Miss Outline Color
 * @parent ---Color Settings---
 * @desc The Outline Color of the "Miss" String.
 * @default rgb(100,100,100)
 *
 * @param State Add Color
 * @parent ---Color Settings---
 * @desc The Color of the added state popup.
 * @default rgb(255,255,255)
 *
 * @param State Add Outline Color
 * @parent ---Color Settings---
 * @desc The outline color of the added state popup.
 * @default rgb(100,100,100)
 *
 * @param State Remove Color
 * @parent ---Color Settings---
 * @desc The color of the removed state popup.
 * @default rgb(255,255,255)
 *
 * @param State Remove Outline Color
 * @parent ---Color Settings---
 * @desc The outline color of the removed state popup.
 * @default rgb(100,100,100)
 *
 * @param Buff Add Color
 * @parent ---Color Settings---
 * @desc The color of the added buff popup.
 * @default rgb(255,255,255)
 *
 * @param Buff Add Outline Color
 * @parent ---Color Settings---
 * @desc The outline color of the added buff popup.
 * @default rgb(100,100,100)
 *
 * @param Debuff Add Color
 * @parent ---Color Settings---
 * @desc The color of the added debuff popup.
 * @default rgb(255,255,255)
 *
 * @param Debuff Add Outline Color
 * @parent ---Color Settings---
 * @desc The oultine color of the added debuff popup.
 * @default rgb(100,100,100)
 *
 * @param Buff Remove Color
 * @parent ---Color Settings---
 * @desc The color of the removed buff popup.
 * @default rgb(255,255,255)
 *
 * @param Buff Remove Outline Color
 * @parent ---Color Settings---
 * @desc The outline color of the removed buff popup.
 * @default rgb(100,100,100)
 *
 * @help
 * ============================================================================
 * Yanfly's Lunatic Mode JavaScipts Functions
 * ============================================================================
 * ----------------------------------------------------------------------------
 * battler.customPopup(TEXT, FORMAT)
 * ----------------------------------------------------------------------------
 * - Creates a custom Popup during a battle.
 * TEXT    - String: that will be displayed.
 * FORMAT  - NUMBER: Depends on customisation. Default option are 1 for recover
 *                   and 2 for damage.
 *                   If you're using draw custom Popup code you may create your
 *                   own format choices that use numbers.
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
 * we want to give the player information about his regenerated HP we call
 * "user.customPopup(...);". That function enables many ways on how you want
 * to display certain information during a battle.
 *
 * ----------------------------------------------------------------------------
 * battler.startDamagePopup()
 * ----------------------------------------------------------------------------
 * - Starts manualy a damage popup if damage has been done/recovered. 
 *
 * Example (From a State Notebox):
 *
 * <Custom Action Start Effect> //from YEP_BuffsStatesCore
 *   var value = Math.floor(user.mhp * 0.05);
 *   user.gainHp(value);
 *   user.startDamagePopup();
 * </Custom Action Start Effect>
 *
 * Before every Action the user does, one recovers 5% of ones Max HP. Since 
 * no damagepopup will appear we have to call "user.startDamagePopup();" 
 * manually instead.
 *
 * ============================================================================
 * Lunatic Code - JavaScript Code for customisation
 * ============================================================================
 * 
 * A damage popup mechanic is based on already made design choices.
 * Since this plugin may not provide the desired functions, you're still able
 * to implement your idea in your game.
 * 
 * In the Parameter Section "Popup Custom Code" I created some "do-it-yourself"
 * noteboxes. Inside these you can overwrite the default code and use your own 
 * instead. If the notebox remains empty, the default code will be used.
 *
 * You may want to study the default Code in this Plugin to get all the
 * important variables and functions you have to consider.
 *
 * ============================================================================
 * Goals for later
 * ============================================================================
 *
 * [DONE] Replace picture with bitmap text.
 * [DONE] Change font name, Font Size, text color and text color of the numbers.
 * [DONE] Highlits critical damage.
 * [DONE] Considers Yanfly's absorption barrier plugin and highlights absorbed damage.
 * [DONE] Number Format can be changed.
 * [DONE] Yanfly lunatic mode script calls to manually displays a custom popup
 * [DONE] Custom popup position and movement setup in parameters.
 * [DONE] Displays State Popups
 * [DONE] Displays Buff Popups.
 * [DONE] Popup can display icons.
 * [DONE] Damage resist format. aka displaying 'weak' and 'effective' damage.
 * [DONE] Elemental damage Popus. (not done by default)
 * [    ] A combo counter that displays the combined damage of an attack.
 * 
 * ============================================================================
 * Desription
 * ============================================================================
 *
 * This plugin changes the damage popup system of RPG Maker MV. 
 * Basically it gets rid of the picture and uses bitmap text instead. 
 * So we can easily change the looks of the damage popup numbers.
 * Furthermore it extends the functionability of YEP_BattleEngineCore, thus his
 * plugin is required.
 * 
 * Make sure you place this plugin under these to achive full compatibility:
 * YEP_BattleEngineCore - Definitly Required! This Plugin reworks his solution.
 * YEP_LoadCustomFonts  - Enables the freedom of choosing Custom Fonts
 * YEP_AborbtionBarrier - Enables Custom Shield Popup.
 * YEP_ElementCore      - Enables custom element popup numbers.
 * LGP_CustomWindowText - (not available yet) Enables Text Shadow.
 *
 * ============================================================================
 * Changelog (last updated: 07.09.18)
 * ============================================================================
 *
 * v1.0 - Fresh out of the oven.
 * v1.1 - Rewrote as a seperate plugin with added parameter settings.
 * v1.2 - New script call for Yanfly's Lunatic Mode "customDamagePopup(...)"
 *      - New Parameter to manually setup popup position, movement and 
 *        duration.
 *      - Fix for broad custom Fonts. Can be setup in plugin parameters.
 * v1.3 - New script call for Yanfly's Lunatic Mode "startDamagePopup()"
 *      - Changed damage popup movement.
 *      - Added multiple  draw custom Code parameters.
 *      - Added tp to parameter settings and default code.
 *      - Added Damage "Resist" to check elemental effectiveness.
 *      - Added custom elemental damage format possibility.
 *      - Added popup for States and Buffs.
 * v1.4 - Fixed Coding error.
 * v1.5 - Fixed Debuff error.
 * v1.6 - Fixed an error that caused no damage to appear.
 * v1.7 - Fixed an error that was caused by compatiblity issues with other plugins that for some reason set the x and y values of Sprite_Actor intances to 0.
 */
//=============================================================================

if (Imported.YEP_BattleEngineCore) {

//=============================================================================
// Parameter and Variables
//=============================================================================
LGP.Parameters = PluginManager.parameters('LGP_BetterDamagePopup');
LGP.Param = LGP.Param || {};

LGP.Param.BDPfontFamily = LGP.Parameters['Font Family'];
LGP.Param.BDPfontSize = Number(LGP.Parameters['Font Size']);
LGP.Param.BDPtextShadow = eval(LGP.Parameters['Text Shadow']);
LGP.Param.BDPfontSizeBuffer = Number(LGP.Parameters['Font Size Buffer']);

LGP.Param.BDPpopDuration = Number(LGP.Parameters['Popup Duration']);
LGP.Param.BDPpopNumberDuration = Number(LGP.Parameters['Popup Number Duration']);
LGP.Param.BDPpopCritDuration = Number(LGP.Parameters['Popup Crit Duration']);
LGP.Param.BDPpopMissDuration = Number(LGP.Parameters['Popup Miss Duration']);

LGP.Param.BDPcustomTextValues = eval(LGP.Parameters['Custom Text Values']);
LGP.Param.BDPpopPosCode = JSON.parse(LGP.Parameters['Popup Position Code']);
LGP.Param.BDPpopMovCode = JSON.parse(LGP.Parameters['Popup Movement Code']);
LGP.Param.BDPdrawNumberCode = JSON.parse(LGP.Parameters['Draw Number Popup Code']);
LGP.Param.BDPdrawMissCode = JSON.parse(LGP.Parameters['Draw Miss Popup Code']);
LGP.Param.BDPdrawBuffCode = JSON.parse(LGP.Parameters['Draw Buff Popup Code']);
LGP.Param.BDPdrawStateCode = JSON.parse(LGP.Parameters['Draw State Popup Code']);
LGP.Param.BDPdrawCustomPopupCode = JSON.parse(LGP.Parameters['Draw Custom Popup Code']);

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

LGP.Param.BDPtpDmgC = LGP.Parameters['TP Damage Color'];
LGP.Param.BDPtpDmgOC = LGP.Parameters['TP Damage Outline Color'];
LGP.Param.BDPtpRecC = LGP.Parameters['TP Recover Color'];
LGP.Param.BDPtpRecOC = LGP.Parameters['TP Recover Outline Color'];

LGP.Param.BDPmissC = LGP.Parameters['Miss Color'];
LGP.Param.BDPmissOC = LGP.Parameters['Miss Outline Color'];

LGP.Param.BDPstateAddC = LGP.Parameters['State Add Color'];
LGP.Param.BDPstateAddOC = LGP.Parameters['State Add Outline Color'];
LGP.Param.BDPstateRemoveC = LGP.Parameters['State Remove Color'];
LGP.Param.BDPstateRemoveOC = LGP.Parameters['State Remove Outline Color'];

LGP.Param.BDPbuffAddC = LGP.Parameters['Buff Add Color'];
LGP.Param.BDPbuffAddOC = LGP.Parameters['Buff Add Outline Color'];
LGP.Param.BDPdebuffAddC = LGP.Parameters['Debuff Add Color'];
LGP.Param.BDPdebuffAddOC = LGP.Parameters['Debuff Add Outline Color'];
LGP.Param.BDPbuffRemoveC = LGP.Parameters['Buff Remove Color'];
LGP.Param.BDPbuffRemoveOC = LGP.Parameters['Buff Remove Outline Color'];

//=============================================================================
// Game_Action
//=============================================================================
LGP.BDP.Game_Action_clear = Game_Action.prototype.clear;
Game_Action.prototype.clear = function() {
    LGP.BDP.Game_Action_clear.call(this);
    this._resist = '';
};

LGP.BDP.Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
Game_Action.prototype.calcElementRate = function(target) {
    var result = LGP.BDP.Game_Action_calcElementRate.call(this, target);
    if (result > 1) {
        this._resist = 'weak';
    } else if (result > 0 && result < 1) {
        this._resist = 'resist';
    } else if (result === 0) {
        this._resist = 'immune';
    } else if (result < 0) {
        this._resist = 'absorb';
    } else {
        this._resist = ''
    }
    return result;
};


LGP.BDP.Game_Action_executeDamage = Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage = function(target, value) {
    LGP.BDP.Game_Action_executeDamage.call(this, target, value);
    var result = target.result();
    if (Imported.YEP_ElementCore) result.itemElements = this.getItemElements();
    if (this._resist !== 'absorb' && value >= 0) {
        result.resist = this._resist;
    } else if (this._resist === 'absorb' && value < 0) {
        result.resist = 'absorb';
    }
};

//=============================================================================
// Game_ActionResult
//=============================================================================
LGP.BDP.Game_ActionResult_clear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function() {
    LGP.BDP.Game_ActionResult_clear.call(this);
    this.customText = {};
    this.customText.string = '';
    this.customText.format = 0;
    this.resist = '';
    this.itemElements = [];
};

Game_ActionResult.prototype.setCustomText = function(value, format) {
    this.customText.string = value.toString();
    this.customText.format = format;
};

Game_ActionResult.prototype.hasCustomText = function() {
    return (this.customText.string !== '');
};

Game_ActionResult.prototype.hasResist = function() {
    return (this.result !== '');
};

Game_ActionResult.prototype.hasElements = function() {
    return (this.itemElements.length > 0);
}

//=============================================================================
// Game_Battler
//=============================================================================

Game_Battler.prototype.customPopup = function(value, format) {
    var result = new Game_ActionResult();
    result.setCustomText(value, format);
    this._damagePopup.push(result);
};

Game_Battler.prototype.startDamagePopup = function() {
    var result = this.result();
    if (result.missed || result.evaded) {
		var copyResult = JsonEx.makeDeepCopy(result);
		copyResult.hpAffected = false;
		copyResult.mpDamage = 0;
		copyResult.tpDamage = 0;
		copyResult.addedStates = [];
		copyResult.removedStates = [];
		copyResult.addedBuffs = [];
		copyResult.addedDebuffs = [];
		copyResult.removedBuffs = [];
		this._damagePopup.push(copyResult);
    }
    if (result.hpAffected) {
		var copyResult = JsonEx.makeDeepCopy(result);
		copyResult.mpDamage = 0;
		copyResult.tpDamage = 0;
		copyResult.missed = false;
    	copyResult.evaded = false;
		copyResult.addedStates = [];
		copyResult.removedStates = [];
		copyResult.addedBuffs = [];
		copyResult.addedDebuffs = [];
		copyResult.removedBuffs = [];
		this._damagePopup.push(copyResult);
    }
    if (result.mpDamage !== 0) {
		var copyResult = JsonEx.makeDeepCopy(result);
		copyResult.hpAffected = false;
		copyResult.tpDamage = 0;
		copyResult.missed = false;
    	copyResult.evaded = false;
		copyResult.addedStates = [];
		copyResult.removedStates = [];
		copyResult.addedBuffs = [];
		copyResult.addedDebuffs = [];
		copyResult.removedBuffs = [];
		this._damagePopup.push(copyResult);
    }
    if (result.tpDamage !== 0) {
		var copyResult = JsonEx.makeDeepCopy(result);
		copyResult.hpAffected = false;
		copyResult.mpDamage = 0;
		copyResult.missed = false;
    	copyResult.evaded = false;
		copyResult.addedStates = [];
		copyResult.removedStates = [];
		copyResult.addedBuffs = [];
		copyResult.addedDebuffs = [];
		copyResult.removedBuffs = [];
		this._damagePopup.push(copyResult);
    }
    if (result.isStatusAffected()) {
    	var copyResult = JsonEx.makeDeepCopy(result);
    	copyResult.clear();
    	copyResult.addedStates = result.addedStates;
    	copyResult.removedStates = result.removedStates;
    	copyResult.addedBuffs = result.addedBuffs;
    	copyResult.addedDebuffs = result.addedDebuffs;
    	copyResult.removedBuffs = result.removedBuffs;
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
			this._damages.push(sprite);
			if (code === "") {
			    sprite.x = this._battler.spritePosX() + this.damageOffsetX();
			    sprite.y = this._battler.spritePosY() + this.damageOffsetY();        
				this.pushDamageSprite(sprite);
			} else {
			    try {
			        eval(code);    
			    } catch (e) {
			        LGP.Util.displayError(e, code, "CUSTOM POPUP POSITION ERROR")
			    }
			}

			BattleManager._spriteset.addChild(sprite);
			this._battler.clearResult();
		}
    } else {
        this._battler.clearDamagePopup();
    }
};


Sprite_Battler.prototype.pushDamageSprite = function(sprite) {
	var heightBuffer = Yanfly.Param.BECPopupOverlap;
	if (Yanfly.Param.BECNewPopBottom) {
		this._damages.forEach(function(spr) {
			for (var i = 0; i < spr.children.length; i++) {
				childSprite = spr.children[i];
				childSprite.anchor.y += heightBuffer;
			}
		}, this);
	} else {
		heightBuffer *= this._damages.length
		for (var i = 0; i < sprite.children.length; i++) {
			childSprite = sprite.children[i];
			childSprite.anchor.y += heightBuffer;
		}
	}
};


//=============================================================================
// Sprite_Damage
//=============================================================================

LGP.BDP.Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
Sprite_Damage.prototype.initialize = function() {
    LGP.BDP.Sprite_Damage_initialize.call(this);
    this._requestRefresh = false;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._fontSize = LGP.Param.BDPfontSize;
    this._fontFace = LGP.Param.BDPfontFamily;
    this._customTextValues = LGP.Param.BDPcustomTextValues;
    this._spriteIds = [];
    this._result = {};
    this._target = {};
};

Sprite_Damage.prototype.refreshDuration = function() {
    this._duration = this.getFullDuration();
};

Sprite_Damage.prototype.refreshNumberDuration = function() {
    this._numberDuration = this.getFullNumberDuration();
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

Sprite_Damage.prototype.getFullNumberDuration = function() {
    return LGP.Param.BDPpopNumberDuration;
};

Sprite_Damage.prototype.getFullCritDuration = function() {
    return LGP.Param.BDPpopCritDuration;
};

Sprite_Damage.prototype.getFullMissDuration = function() {
    return LGP.Param.BDPpopMissDuration;
};

Sprite_Damage.prototype.setup = function(target) {
    this._target = target;
    this._result = target.shiftDamagePopup();
    this._requestRefresh = true;
    this.refreshDuration();
    this.refreshNumberDuration();
    this.refreshMissDuration();
    this.refreshCritDuration();
};

Sprite_Damage.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this.isPlaying()) return;
    if (this._requestRefresh) this.refresh();
    this.updateDurations();
    if (this.children.length > 0) this.updateMovement();
};

Sprite_Damage.prototype.updateDurations = function() {
    if (this._duration > 0) this._duration--;
    if (this._numberDuration > 0) this._numberDuration--;
    if (this._missDuration > 0) this._missDuration--;
    if (this._critDuration > 0) this._critDuration--;
};

Sprite_Damage.prototype.updateMovement = function() {
    var code = LGP.Param.BDPpopMovCode;
    if (code !== '') {
        try {
            eval(code);
        } catch (e) {
            LGP.Util.displayError(e, code, "CUSTOM POPUP MOVEMENT ERROR");
        }
    } else {
        this.defaultMovementCode();
    }
};

Sprite_Damage.prototype.refresh = function() {
    var result = this._result;
    if (result.hpAffected || result.mpDamage !== 0 || result.tpDamage !== 0) this.drawNumber();
    if (result.missed || result.evaded) this.drawMiss();
    if (result.addedBuffs.length > 0 || result.addedDebuffs.length > 0 || result.removedBuffs.length > 0) this.drawBuff();
    if (result.addedStates.length > 0 ||  result.removedStates.length > 0) this.drawState();
    if (result.hasCustomText()) this.drawCustomText();
    this._requestRefresh = false;
};

Sprite_Damage.prototype.drawNumber = function() {
    var result = this._result;
    var code = LGP.Param.BDPdrawNumberCode;
    this._spriteIds["number"] = this.children.length;
    if (code !== '') {
        try {
            eval(code)
        } catch (e) {
            LGP.Util.displayError(e, code, "DRAW CUSTOM NUMBER POPUP ERROR");
        }
    } else {
        this.drawDefaultNumber();
    }
};

Sprite_Damage.prototype.drawMiss = function() {
    var result = this._result;
    var code = LGP.Param.BDPdrawMissCode;
    this._spriteIds["miss"] = this.children.length;
    if (code !== '') {
        try {
            eval(code);
        } catch (e) {
            LGP.Util.displayError(e, code, "DRAW CUSTOM MISS POPUP ERROR")
        }
    } else {
        this.drawDefaultMiss();
    }
};

Sprite_Damage.prototype.drawBuff = function() {
    var result = this._result;
    var code = LGP.Param.BDPdrawBuffCode;
    this._spriteIds["buff"] = this.children.length;
    if (code !== '') {
        try {
            eval(code);
        } catch (e) {
            LGP.Util.displayError(e, code, "DRAW CUSTOM BUFF POPUP ERROR")
        }
    } else {
        this.drawDefaultBuff();  
    } 
};

Sprite_Damage.prototype.drawState = function() {
    var result = this._result;
    var code = LGP.Param.BDPdrawStateCode;
    this._spriteIds["state"] = this.children.length;
    if (code !== '') {
        try {
            eval(code);
        } catch (e) {
            LGP.Util.displayError(e, code, "DRAW CUSTOM STATE POPUP ERROR")
        }
    } else {
        this.drawDefaultState();  
    } 

};

Sprite_Damage.prototype.drawCustomText = function() {
    var result = this._result;
    var code = LGP.Param.BDPdrawCustomPopupCode;
    this._spriteIds["custom"] = this.children.length;
    if (code !== '') {
        try {
            eval(code);
        } catch (e) {
            LGP.Util.displayError(e, code, "DRAW CUSTOM TEXT POPUP ERROR")
        }
    } else {
        this.drawDefaultCustomText();  
    } 
};

Sprite_Damage.prototype.defaultMovementCode = function() {
    var result = this._result;

    // Since we dont know which child is used for, we use this.getCild(...)to get the correct
    // sprite of the current effect.

    // Damage Numbers expect blocked damage
    if ((result.hpDamage > 0 || result.mpDamage > 0 || result.tpDamage > 0) && (Imported.YEP_AbsorptionBarrier || !result._barrierAffected)) {
    	var sprite = this.getChild("number");
    	var d = this._duration;	

    	sprite.scale.x = Math.min(1, sprite.scale.x + 0.05);
    	sprite.scale.y = Math.min(1, sprite.scale.y + 0.05);    	

    	if (this._target.isEnemy()) {
			sprite.x -= 0.5;
			sprite.y = (0.1 * Math.pow(sprite.x, 2) + (5 * sprite.x));
    	} else if (this._target.isActor()) {
			sprite.x += 0.5;
			sprite.y = -(-0.1 * Math.pow(sprite.x, 2) + (5 * sprite.x));
    	}
    }


    // Critical Effect on numbers
    if (result.critical) {
        var sprite = this.getChild("number");
        var d = this._critDuration;
        sprite.scale.x = Math.min(2, Math.max(1, (this.getFullCritDuration() / 100 * d)));
        sprite.scale.y = sprite.scale.x;   
    }

    
    // Healing Numbers
    if ((result.hpDamage < 0 || result.mpDamage < 0 || result.tpDamage < 0) || (Imported.YEP_AbsorptionBarrier && result._barrierAffected)) {
        if (!this._critDuration > 0){
            var sprite = this.getChild("number");

            sprite.scale.x = 1;
            sprite.scale.y = 1;

            var d = this._duration;
            sprite.y -= 0.4;
	        if (d < 10) sprite.opacity = 255 * d / 10
        }
    }

    // Missing animation
    if (result.missed || result.evaded) {
        var sprite = this.getChild("miss");
     	if (this._target.isEnemy()) {
			sprite.x -= 0.5;
			sprite.y = (0.1 * Math.pow(sprite.x, 2) + (5 * sprite.x));
    	} else if (this._target.isActor()) {
			sprite.x += 0.5;
			sprite.y = -(-0.1 * Math.pow(sprite.x, 2) + (5 * sprite.x));
    	}
    }

    // State effect
    if (result.addedStates.length > 0 || result.removedStates.length > 0) {
        var sprite = this.getChild("state");
       	sprite.y -= 0.5;
    }

    // Buff effect
    if (result.addedBuffs.length > 0 || result.removedBuffs.length > 0) {
        var sprite = this.getChild("buff");
       	sprite.y -= 0.5;
    }

    // Global Opacity
    if (this._duration < 10) {
    	this.opacity = 255 * this._duration / 10;
    }
};


Sprite_Damage.prototype.getChild = function(index) {
    return this.children[this._spriteIds[index]];
};

Sprite_Damage.prototype.drawDefaultNumber = function() {
    var result = this._result;
    var sprite = new Sprite();
    this.addChild(sprite);

    sprite.scale.x = 0;
    sprite.scale.y = 0;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;

    var heals = this._target.battler()._damages.filter(function(dmg) {
    	var result = dmg._result;
    	if ((result.hpDamage < 0 || result.mpDamage < 0 || result.tpDamage < 0)) {
	    	return dmg;
    	}
    });
    sprite.anchor.y += heals.length - 1;

    var value = 0;
    if (result.hpAffected) value = result.hpDamage;
    if (result.mpDamage !== 0) value = result.mpDamage;
    if (result.tpDamage !== 0) value = result.tpDamage;

    var number = Math.abs(value).toString();
    
    if (value < 0) number = eval(LGP.Param.BDPrecoverFormat.replace(number,value));    
    if (value > 0) number = eval(LGP.Param.BDPdamageFormat.replace(number,value)); 
    if (result.critical) number = eval(LGP.Param.BDPcritFormat.replace(number,value));
    if (Imported.YEP_AbsorptionBarrier && result._barrierAffected) number = eval(LGP.Param.BDPblockFormat.replace(number,value));
    
    var w = this.getTextWidth(number) + LGP.Param.BDPfontSizeBuffer;
    var h = this._fontSize;
    
    sprite.bitmap = new Bitmap(w, h);
    var bitmap = sprite.bitmap;  
    bitmap.fontFace = this._fontFace;
    bitmap.fontSize = this._fontSize;
    if (Imported.LGP_CustomWindowText) bitmap.textShadow = LGP.Param.BDPtextShadow;

    if (result.hpAffected) {
        if (value > 0) {
            if (Imported.YEP_AbsorptionBarrier && result._barrierAffected) {
                bitmap.textColor = LGP.Param.BDPshC;   
                bitmap.outlineColor = LGP.Param.BDPshOC;        
            } else {
                if (result.critical) {
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
    } else if (result.mpDamage !== 0) {
        if (value > 0) {
            bitmap.textColor = LGP.Param.BDPmpDmgC;
            bitmap.outlineColor = LGP.Param.BDPmpDmgOC
            } else {
            bitmap.textColor = LGP.Param.BDPmpRecC;
            bitmap.outlineColor = LGP.Param.BDPmpRecOC;
        } 
    } else if (result.tpDamage !== 0)
        if (value > 0) {
            bitmap.textColor = LGP.Param.BDPtpDmgC
            bitmap.outlineColor = LGP.Param.BDPtpDmgOC;
        } else {
            bitmap.textColor = LGP.Param.BDPtpRecC
            bitmap.outlineColor = LGP.Param.BDPtpRecOC;
        }
    
    if (result.resist !== '') {
    	var resSprite = new Sprite();
    	sprite.addChild(resSprite);
    	resSprite.anchor.x = 0.5;
    	resSprite.anchor.y = 1;
    	var resistText = '';
    	if (result.resist === 'weak') {
    		resistText = this._customTextValues[2];
    	} else if (result.resist === 'resist') {
    		resistText = this._customTextValues[3];
    	} else if (result.Resist === 'absorbed') {
    		resistText = this._customTextValues[4];
    	}
    	var rw = this.getTextWidth(resistText) + LGP.Param.BDPfontSizeBuffer;
    	var rh = this._fontSize;
    	resSprite.bitmap = new Bitmap(rw, rh);
        resSprite.bitmap.textColor = LGP.Param.BDPmissC;        
        resSprite.bitmap.outlineColor = LGP.Param.BDPmissOC;   		
        if (Imported.LGP_CustomWindowText) resSprite.bitmap.textShadow = LGP.Param.BDPtextShadow;
    	resSprite.bitmap.drawText(resistText, 0, 0, rw, h);
    	resSprite.scale.x = 0.8;
    	resSprite.scale.y = 0.8;
    }
    bitmap.drawText(number, 0, 0, w, h);
};

Sprite_Damage.prototype.drawDefaultMiss = function() {
    var sprite = new Sprite();
    this.addChild(sprite);

	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;

    var string = LGP.Param.BDPmissText;

    var w = this.getTextWidth(string) + LGP.Param.BDPfontSizeBuffer;
    var h = this._fontSize;

	sprite.bitmap = new Bitmap(w, h);
	sprite.bitmap.fontFace = this._fontFace;
	sprite.bitmap.fontSize = this._fontSize;
	if (Imported.LGP_CustomWindowText) sprite.bitmap.textShadow = LGP.Param.BDPtextShadow;
	sprite.bitmap.textColor = LGP.Param.BDPmissC;
	sprite.bitmap.outlineColor = LGP.Param.BDPmissOC;        
 
    var bitmap = sprite.bitmap;  
    bitmap.drawText(string, 0, 0, w, h);    
};

Sprite_Damage.prototype.drawDefaultBuff = function() {
    var result = this._result;
    var addedBuffs = result.addedBuffs;
    var addedDebuffs = result.addedDebuffs;
    var removedBuffs = result.removedBuffs;

 	var sprite = new Sprite();
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    this.addChild(sprite);

	for (var i = 0; i < addedBuffs.length; i++ ) {
        var buffSprite = new Sprite();
        sprite.addChild(buffSprite);
 
        buffSprite.anchor.x = 0.5;
        buffSprite.anchor.y = 0.5 + i; 

        var paramName = $dataSystem.terms.params[addedBuffs[i]];
        
        var w = Window_Base._iconWidth + 5 + this.getTextWidth(paramName) + LGP.Param.BDPfontSizeBuffer;
        var h = Window_Base._iconHeight;

        buffSprite.bitmap = new Bitmap(w, h);
        var bitmap = buffSprite.bitmap;
        bitmap.textColor = LGP.Param.BDPbuffAddC;   
        bitmap.outlineColor = LGP.Param.BDPbuffAddOC;   
        this.drawPopupIcon(bitmap, this._target.buffIconIndex(1, addedBuffs[i]), 0, 0);
        bitmap.drawText(paramName, Window_Base._iconWidth + 5, 0, w, h);
    }

    for (var i = 0; i < addedDebuffs.length; i++ ) {
        var buffSprite = new Sprite();
        sprite.addChild(buffSprite);

        buffSprite.anchor.x = 0.5;
        buffSprite.anchor.y = 0.5 + addedBuffs.length + i; 
        
 		var paramName = $dataSystem.terms.params[addedDebuffs[i]];
        
        var w = Window_Base._iconWidth + 5 + this.getTextWidth(paramName) + LGP.Param.BDPfontSizeBuffer;
        var h = Window_Base._iconHeight;
        
        buffSprite.bitmap = new Bitmap(w, h);
        var bitmap = buffSprite.bitmap;
        bitmap.textColor = LGP.Param.BDPdebuffAddC;   
        bitmap.outlineColor = LGP.Param.BDPdebuffAddOC;   
        this.drawPopupIcon(bitmap, this._target.buffIconIndex(-1, addedDebuffs[i]), 0, 0);
        bitmap.drawText(paramName, Window_Base._iconWidth + 5, 0, w, h);
    }

    for (var i = 0; i < removedBuffs.length; i++ ) {
        var buffSprite = new Sprite();
        sprite.addChild(buffSprite);

 		var sign = this._customTextValues[1];

        buffSprite.anchor.x = 0.5;
        buffSprite.anchor.y = 0.5 + addedBuffs.length + addedDebuffs.length + i; 
        
 		var paramName = $dataSystem.terms.params[removedBuffs[i]];
        
        var w = this.getTextWidth(sign) + this.getTextWidth(paramName) + Window_Base._iconWidth + 5 + LGP.Param.BDPfontSizeBuffer;
        var h = Window_Base._iconHeight;
        
        buffSprite.bitmap = new Bitmap(w, h);
        var bitmap = buffSprite.bitmap;
        bitmap.textColor = LGP.Param.BDPbuffRemoveC;   
        bitmap.outlineColor = LGP.Param.BDPbuffRemoveOC;   
        bitmap.drawText(sign, 0, 0, w, h);
        this.drawPopupIcon(bitmap,  this._target.buffIconIndex(1, removedBuffs[i]), this.getTextWidth(sign), 0);
        bitmap.drawText(paramName, this.getTextWidth(sign) + Window_Base._iconWidth + 5, 0, 0, h);
    }
};

Sprite_Damage.prototype.drawDefaultState = function() {
    var result = this._result;
    var addedStates = result.addedStateObjects();
    var removedStates = result.removedStateObjects();

    var sprite = new Sprite();
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    this.addChild(sprite);
    for (var i = 0; i < addedStates.length; i++) {
        var stateSprite = new Sprite();
        sprite.addChild(stateSprite);

        var sign = this._customTextValues[0];
 
        stateSprite.anchor.x = 0.5;
        stateSprite.anchor.y = 0.5 + i; 
        var string = addedStates[i].name;      
        
        var w = this.getTextWidth(sign) + this.getTextWidth(addedStates[i].name) + Window_Base._iconWidth + 5 + LGP.Param.BDPfontSizeBuffer;
        var h = Window_Base._iconHeight;

        stateSprite.bitmap = new Bitmap(w, h);
        var bitmap = stateSprite.bitmap;
        bitmap.textColor = LGP.Param.BDPmissC;   
        bitmap.outlineColor = LGP.Param.BDPmissOC;   
        bitmap.drawText(sign, 0, 0, w, h);
        this.drawPopupIcon(bitmap, addedStates[i].iconIndex, this.getTextWidth(sign), 0);
        bitmap.drawText(addedStates[i].name, this.getTextWidth(sign) + Window_Base._iconWidth + 5, 0, 0, h);
    }
    for (var i = 0; i < removedStates.length; i++) {
        var stateSprite = new Sprite();
        sprite.addChild(stateSprite);

        var sign = this._customTextValues[1];
 
        stateSprite.anchor.x = 0.5;
        stateSprite.anchor.y = (0.5 + addedStates.length) + i; 
        var string = removedStates[i].name;      
        
        var w = this.getTextWidth(sign) + this.getTextWidth(removedStates[i].name) + Window_Base._iconWidth + 5 + LGP.Param.BDPfontSizeBuffer;
        var h = Window_Base._iconHeight;

        stateSprite.bitmap = new Bitmap(w, h);
        var bitmap = stateSprite.bitmap;
        bitmap.textColor = LGP.Param.BDPmissC;   
        bitmap.outlineColor = LGP.Param.BDPmissOC;   
        bitmap.drawText(sign, 0, 0, w, h);
        this.drawPopupIcon(bitmap, removedStates[i].iconIndex, this.getTextWidth(sign), 0);
        bitmap.drawText(removedStates[i].name, this.getTextWidth(sign) + Window_Base._iconWidth + 5, 0, 0, h);
    }
};

Sprite_Damage.prototype.drawDefaultCustomText = function() {
    var result = this._result;
    var sprite = new Sprite();
    this.addChild(sprite);

    var string = result.customText.string;

    var w = this.getTextWidth(string) + LGP.Param.BDPfontSizeBuffer;
    var h = this._fontSize;

    sprite.bitmap = new Bitmap(w, this._fontSize);
    sprite.bitmap.fontFace = this._fontFace;
    sprite.bitmap.fontSize = this._fontSize;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    if (Imported.LGP_CustomWindowText) sprite.bitmap.textShadow = LGP.Param.BDPtextShadow;

    var bitmap = sprite.bitmap;  

    if (result.customText.format == 2) {   
        bitmap.textColor = LGP.Param.BDPhpDmgC;   
        bitmap.outlineColor = LGP.Param.BDPhpDmgOC;        
    } else if (result.customText.format == 1) {
        bitmap.textColor = LGP.Param.BDPhpRecC;   
        bitmap.outlineColor = LGP.Param.BDPhpRecOC;    
    }

    bitmap.drawText(string, 0, 0, w, h);
};

Sprite_Damage.prototype.drawPopupIcon = function(bitmap, iconIndex, x, y) {
    var iconBitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    bitmap.blt(iconBitmap, sx, sy, pw, ph, x, y);
};

Sprite_Damage.prototype.getTextWidth = function(text, fontSize) {
	var bitmap = new Bitmap();
	var fs = fontSize ||this._fontSize;
	bitmap._fontSize = fs;
	return bitmap.measureTextWidth(text);
};

//=============================================================================
// Utilities
//=============================================================================

LGP.Util = LGP.Util || {};

LGP.Util.displayError = function(e, code, message) {
    console.log(message);
    console.log(code || 'NON-EXISTENT');
    console.error(e);
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        require('nw.gui').Window.get().showDevTools();
    }
};

//=============================================================================
// end of file
//=============================================================================
}