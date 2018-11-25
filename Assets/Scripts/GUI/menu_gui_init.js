#pragma strict

public var gameTitleTexture	: Texture2D;
public var bgLabel			: Texture2D;
public var placePointer		: Texture2D;
public var sliderLabel		: Texture2D;
public var sliderPointer	: Texture2D;
public var background		: Texture2D[]		= new Texture2D[2];
public var buttons			: Texture2D[]		= new Texture2D[14];
public var movementArt		: Texture2D[]		= new Texture2D[4];

private var tempStyle		: GUIStyle			= GUIStyle();
private var gFuncs			: gui_controller;
private var sFuncs			: script_funcs;

function Start()
{
	sFuncs	= script_funcs();
	gFuncs	= gui_controller();
}

function OnGUI()
{	
	if(global_vars.m_highScoreTab || global_vars.m_settingsTab) return;
	
	tempStyle.normal.background	= buttons[0];
	if(GUI.Button(gFuncs.guiRect_C(0.5, 0.5, 200.0, 200.0), "", tempStyle))
	{
		global_vars.soundClick.Play();
		Application.LoadLevel("level_scene_1");
	}
	tempStyle.normal.background	= buttons[1];
	if(GUI.Button(gFuncs.guiRect_C(0.25, 0.5, 100.0, 100.0), "", tempStyle))
	{
		global_vars.soundClick.Play();
		
		var camera : GameObject = GameObject.Find("Main Camera");
		var s_gui				= camera.AddComponent(settings_gui);
		
		s_gui.background		= background[1];
		s_gui.buttons[0]		= buttons[3];
		s_gui.label				= sliderLabel;
		s_gui.pointer			= sliderPointer;
		
		for(var i : int = 1; i < 8; i ++)
		{
			if(i < 5)
			{
				s_gui.movementArt[i - 1]	= movementArt[i - 1];
			}
			s_gui.buttons[i]				= buttons[6 + i];
		}
	}
	tempStyle.normal.background	= buttons[2];
	if(GUI.Button(gFuncs.guiRect_C(0.75, 0.5, 100.0, 100.0), "", tempStyle))
	{
		global_vars.soundClick.Play();
		
		camera					= GameObject.Find("Main Camera");
		var hs_gui				= camera.AddComponent(high_score_gui);
		
		hs_gui.bgLabel			= bgLabel;
		hs_gui.placePointer		= placePointer;
		hs_gui.background		= background[0];
		
		for(i = 0; i < 4; i ++)
		{
			hs_gui.buttons[i] = buttons[3 + i];
		}
	}
	tempStyle.normal.background	= buttons[3];
	if(GUI.Button(gFuncs.guiRect_C(0.95, 0.07, 50.0, 50.0), "", tempStyle))
	{
		global_vars.soundClick.Play();
		sFuncs.saveHighScore();
		Application.Quit();
	}
}