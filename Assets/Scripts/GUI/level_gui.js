#pragma strict

public var analogTextures 	: Texture[]		= new Texture[2];
public var hud				: Texture[]		= new Texture[2];
public var background		: Texture;
public var buttons			: Texture[]		= new Texture[8];
public var sliderPointer	: Texture;
public var sliderLabel		: Texture;
public var movementArt		: Texture[]		= new Texture[4];

private var tempStyle		: GUIStyle		= GUIStyle();
private var gFuncs			: gui_controller;
private var analogPos		: Vector2;
private var analogCurrPos	: Vector2;
private var frameSkip		: int;

#if UNITY_EDITOR
private var MAX_SPEED		: float;
#endif

function Start()
{
	gFuncs 		= gui_controller();
	
	#if UNITY_EDITOR
	MAX_SPEED	= 64.0 * movement_functions.velocityMultipler;
	#endif
}

function FixedUpdate()
{	
	frameSkip ++;
	
	if(frameSkip == 2)
	{
		updateAnalogPos();
		
		frameSkip = 0;
	}
}

function OnGUI()
{
	if(global_vars.paused || global_vars.gameEnd) return;
	
	//GUI.Label(gFuncs.guiRect_L(0.02, 0.95, 700, 40), GetComponent(debug_funcs).gyroDebugLog, global_vars.mainTextStyle);
	
	GUI.Label(gFuncs.guiRect_L(0.02, 0.18, 200, 30), player_settings.scoreString, global_vars.mainTextStyle);
	
	if(global_vars.player.GetComponent(player_move).doublePointsTime > Time.timeSinceLevelLoad)
	{
		global_vars.mainTextStyle.normal.textColor = Color.yellow;
		GUI.Label(gFuncs.guiRect_L(0.16 + (0.02 * (player_settings.scoreString.Length - 7)), 0.18, 200, 30), "x2", global_vars.mainTextStyle);
		global_vars.mainTextStyle.normal.textColor = Color.black;
	}
	
	// explosives count
	GUI.Label(gFuncs.guiRect_C(0.85, 0.92, 60, 30), "" + global_vars.playerSettings.explosivesCount, global_vars.mainTextStyle);
	
	// teleports count
	GUI.Label(gFuncs.guiRect_C(0.95, 0.82, 60, 30), "" + global_vars.playerSettings.teleportsCount, global_vars.mainTextStyle);
	
	if(global_vars.movementType != global_consts.MOVE_ARROWS_0)	tempStyle.normal.background = hud[0];
	else														tempStyle.normal.background = hud[1];
	
	GUI.Label(gFuncs.guiRect_C(0.5, 0.5, 800, 480), "", tempStyle);
	
	if(global_vars.movementType == global_consts.MOVE_ANALOG_0)
	{
		if(movement_functions.analogCreated)
		{
			tempStyle.normal.background = analogTextures[0];
			GUI.Label(gFuncs.guiRect_C(analogPos.x, analogPos.y, 128, 128), "", tempStyle);
			tempStyle.normal.background = analogTextures[1];
			GUI.Label(gFuncs.guiRect_C(analogCurrPos.x, analogCurrPos.y, 128, 128), "", tempStyle);
		}
	}
	
	#if UNITY_EDITOR
	if(global_vars.movementType == global_consts.MOVE_ARROWS_0)
	{
		if(GUI.Button(gFuncs.guiRect_C(0.13, 0.87, 140, 80), ""))
		{
			global_vars.player.rigidbody.velocity.x += -28.5 * movement_functions.velocityMultipler;
			if(global_vars.player.rigidbody.velocity.x > MAX_SPEED)
			{
				global_vars.player.rigidbody.velocity.x	= MAX_SPEED;
			}
		}
		else if(GUI.Button(gFuncs.guiRect_C(0.33, 0.87, 140, 80), ""))
		{
			global_vars.player.rigidbody.velocity.x += 28.5 * movement_functions.velocityMultipler;
			if(global_vars.player.rigidbody.velocity.x > MAX_SPEED)
			{
				global_vars.player.rigidbody.velocity.x	= MAX_SPEED;
			}
		}
	}

	if(GUI.Button(gFuncs.guiRect_C(0.5, 0.08, 100.0, 100.0), "") || (Input.GetKeyDown(KeyCode.Escape) && global_vars.lastEscPress + 0.5 < Time.timeSinceLevelLoad))
	{
		pauseGame();
	}
	
	if(GUI.Button(gFuncs.guiRect_C(0.75, 0.85, 80.0, 80.0), ""))
	{
		GetComponent(ground_controller).createExplosion(global_vars.player.transform.position, 30.0, 1);
	}

	if(GUI.Button(gFuncs.guiRect_C(0.85, 0.75, 80.0, 80.0), ""))
	{
		GetComponent(movement_functions).teleportPlayer();
	}
	
	#endif
}

function pauseGame()
{
	global_vars.paused 			= true;
	Screen.sleepTimeout 		= SleepTimeout.SystemSetting;
	Time.timeScale 				= 0.0;
	global_vars.lastEscPress	= Time.timeSinceLevelLoad;
		
	var camera : GameObject = GameObject.Find("main_camera_0");
	var s_gui				= camera.AddComponent(settings_gui);
		
	s_gui.background		= background;
	s_gui.label				= sliderLabel;
	s_gui.pointer			= sliderPointer;
	s_gui.watchingTab		= 2;
		
	for(var i : int = 0; i < 8; i ++)
	{
		if(i < 4)
		{
			s_gui.movementArt[i]	= movementArt[i];
		}
		s_gui.buttons[i]				= buttons[i];
	}
}

function updateAnalogPos()
{
	analogPos		= Vector2(movement_functions.analogPos.x * global_vars.reciprocalScreen.x, (Screen.height - movement_functions.analogPos.y) * global_vars.reciprocalScreen.y);
	analogCurrPos	= Vector2(movement_functions.analogCurrentPos.x * global_vars.reciprocalScreen.x, (Screen.height - movement_functions.analogCurrentPos.y) * global_vars.reciprocalScreen.y);
}