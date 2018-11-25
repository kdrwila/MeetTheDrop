#pragma strict

public var gameOverTexutre		: Texture2D;
public var menuBckg				: Texture2D[]	= new Texture2D[3];
public var movementArt			: Texture2D[]	= new Texture2D[4];
public var settingsTxt			: Texture2D[]	= new Texture2D[9];
public var placePointer			: Texture2D;
public var hiddenStyle			: GUIStyle;

private var menuTab				: int;
private var playerScoreLabel	: int[]			= new int[3];
private var lastTouchPos		: Vector2;
private var touchPosDiff		: Vector2;
private var resetedAfterChange	: boolean		= true;
private var keyboardOpen		: boolean;
private var hScoreCreated		: boolean;
private var scaleVptr			: float			= 0.7;
private var scaleHptr			: float			= 0.7;
private var tempStyle			: GUIStyle		= GUIStyle();
private var gFuncs				: gui_controller;
private var gMFuncs				: moving_gui;
private var keyboard 			: TouchScreenKeyboard;
private var sFuncs				: script_funcs;

function Awake()
{
	for(var i : int = 0; i < 3; i ++)
	{
		playerScoreLabel[i] = -1;
	}
}

function Start()
{
	gFuncs	= gui_controller();
	sFuncs	= script_funcs();
	gMFuncs	= GetComponent(moving_gui);
}

function OnGUI()
{	
	if(global_vars.gameEnd)
	{
		tempStyle.normal.background = settingsTxt[5];
		if(GUI.Button(gFuncs.guiRect_L(0.0, 0.5, 180.0, 396.0), "", tempStyle))
		{
			global_vars.soundClick.Play();
			sFuncs.saveHighScore();
			Application.LoadLevel("menu_scene_main");
		}
		tempStyle.normal.background = settingsTxt[6];
		if(GUI.Button(gFuncs.guiRect_C(0.8875, 0.5, 180.0, 396.0), "", tempStyle))
		{
			global_vars.soundClick.Play();
			sFuncs.saveHighScore();
			Application.LoadLevel(Application.loadedLevel);
		}
		
		showHighScore();
	}
}

function FixedUpdate()
{
	if(keyboardOpen)
	{
		if(keyboard.done)
		{
			for(var i : int = 0; i < keyboard.text.length; i ++)
			{
				if(keyboard.text[i] == "|" || keyboard.text[i] == "'")
				{
					keyboard.text = keyboard.text.Remove(i, i + 1);
   					keyboard.text = keyboard.text.Insert(i, "_");
				}
			}
			
			player_settings.playerName							= keyboard.text;
			global_vars.highScoreName[global_vars.playerPlace]	= keyboard.text;
			PlayerPrefs.SetString("player_name", keyboard.text);
		}
		if(keyboard)
		{
			player_settings.playerName = keyboard.text;
		}
		
	}
}

function showHighScore()
{
	var place		: int;
	
	if(global_vars.playerPlace > 97)		place = global_vars.playerPlace - 94;
	else if(global_vars.playerPlace < 3)	place = global_vars.playerPlace + 1;
	else									place = 3;
	
	tempStyle.normal.background = settingsTxt[7];
	for(var i : int = 0; i < 5; i ++) if(i != place - 1)
	{
		var tempPlace : int = global_vars.playerPlace + ((-place + 1) + i);
		if(i < place - 1)
		{
			GUI.Label(gFuncs.guiRect_C(0.5, 0.21625 + (0.117 * i), 440, 56), "", tempStyle);
			GUI.Label(gFuncs.guiRect_L(0.27, 0.23125 + (0.117 * i), 240, 56), (tempPlace + 1) + ". " + global_vars.highScoreName[tempPlace], global_vars.hsTextStyle);
			GUI.Label(gFuncs.guiRect_R(0.73, 0.23125 + (0.117 * i), 130, 56), "" + global_vars.highScore[tempPlace], global_vars.hsTextStyle);
		}
		else
		{
			GUI.Label(gFuncs.guiRect_C(0.5, 0.28625 + (0.117 * i), 440, 56), "", tempStyle);
			GUI.Label(gFuncs.guiRect_L(0.27, 0.31125 + (0.117 * i), 240, 56), (tempPlace + 1) + ". " + global_vars.highScoreName[tempPlace], global_vars.hsTextStyle);
			GUI.Label(gFuncs.guiRect_R(0.73, 0.31125 + (0.117 * i), 130, 56), "" + global_vars.highScore[tempPlace], global_vars.hsTextStyle);
		}
	}
	
	if(playerScoreLabel[0] == -1)
	{
		playerScoreLabel[0] = gMFuncs.initMovingGui(1, 0.1, Vector2(440, 56), Vector2(0.5, -0.71375 + (0.117 * (place - 1))), Vector2(0.0, 1.0), settingsTxt[7]);
		playerScoreLabel[1] = gMFuncs.initMovingGui(0, 0.1, Vector2(240, 56), Vector2(0.27, -0.68875 + (0.117 * (place - 1))), Vector2(0.0, 1.0), (global_vars.playerPlace + 1) + ". " + player_settings.playerName);
		playerScoreLabel[2] = gMFuncs.initMovingGui(2, 0.1, Vector2(130, 56), Vector2(0.73, -0.68875 + (0.117 * (place - 1))), Vector2(0.0, 1.0), "" + (global_vars.playerSettings.mainScore + global_vars.playerSettings.addScore));
	}
	else if(gMFuncs.isFinished(playerScoreLabel[0]) || hScoreCreated)
	{
		if(!hScoreCreated)
		{
			gMFuncs.destroyMovingGui(playerScoreLabel[0]);
			gMFuncs.destroyMovingGui(playerScoreLabel[1]);
			gMFuncs.destroyMovingGui(playerScoreLabel[2]);
			hScoreCreated				= true;
		}
				
		tempStyle.normal.background	= settingsTxt[7];
		GUI.Label(gFuncs.guiRect_C(0.5, 0.28625 + (0.117 * (place - 1)), 440, 56), "", tempStyle);
		GUI.Label(gFuncs.guiRect_L(0.27, 0.31125 + (0.117 * (place - 1)), 240, 56),  (global_vars.playerPlace + 1) + ". " + player_settings.playerName, global_vars.hsTextStyle);
		GUI.Label(gFuncs.guiRect_R(0.73, 0.31125 + (0.117 * (place - 1)), 130, 56), "" + (global_vars.playerSettings.mainScore + global_vars.playerSettings.addScore), global_vars.hsTextStyle);
		
		tempStyle.normal.background = placePointer;
		GUI.Label(gFuncs.guiRect_L(0.235, 0.28625 + (0.117 * (place - 1)), 34, 55), "", tempStyle);
		
		tempStyle.normal.background	= settingsTxt[8];
		if(GUI.Button(gFuncs.guiRect_C(0.4, 0.30625 + (0.117 * (place - 2)), 256, 32), "", tempStyle))
		{
			global_vars.soundClick.Play();
			keyboard		= TouchScreenKeyboard.Open(player_settings.playerName, TouchScreenKeyboardType.ASCIICapable);
			keyboardOpen	= true;
		}
	}
}