#pragma strict

public var background			: Texture2D;
public var buttons				: Texture2D[]	= new Texture2D[9];
public var movementArt			: Texture2D[]	= new Texture2D[4];
public var label				: Texture2D;
public var pointer				: Texture2D;
public var paused				: boolean;
public var watchingTab			: int;

private var ptrMasterAudio		: float;
private var ptrAudioHrznPos		: float;
private var lastTouchPos		: Vector2;
private var touchPosDiff		: Vector2;
private var resetedAfterChange	: boolean		= true;
private var tempStyle			: GUIStyle		= GUIStyle();
private var textStyle			: GUIStyle		= GUIStyle();
private var gFuncs				: gui_controller;
private var sFuncs				: script_funcs;

function Start () 
{
	global_vars.m_settingsTab	= true;
	ptrMasterAudio				= global_vars.audioMasterVolume;
	ptrAudioHrznPos				= Screen.width * 0.56625 + ((Screen.width * 0.3125) * ptrMasterAudio);
	gFuncs						= gui_controller();
	sFuncs						= script_funcs();
	
	textStyle.font				= global_vars.mainTextStyle.font;
	textStyle.normal.textColor	= Color(0.8, 0.8, 0.8);
	textStyle.alignment			= TextAnchor.UpperLeft;
}

function OnGUI () 
{
	tempStyle.normal.background = background;
	GUI.Label(gFuncs.guiRect_C(0.5, 0.5, 800, 480), "", tempStyle);
	
	tempStyle.normal.background	= buttons[0];
	if(GUI.Button(gFuncs.guiRect_C(0.94, 0.92, 64.0, 64.0), "", tempStyle) || Input.GetKeyDown(KeyCode.Escape))
	{
		if(global_vars.paused)
		{
			global_vars.paused			= false;
			Screen.sleepTimeout 		= SleepTimeout.NeverSleep;
			Time.timeScale 				= 1.0;
			global_vars.lastEscPress	= Time.timeSinceLevelLoad;
			if(global_vars.movementType == global_consts.MOVE_ACC_0)
			{
				global_vars.defaultAccPos = Input.acceleration.y;
			}
		}
	
		global_vars.m_settingsTab	= false;
		global_vars.soundClick.Play();
		sFuncs.saveOptions();
		Destroy(this.GetComponent(settings_gui));
	}
	
	tempStyle.normal.background	= buttons[1];
	if(watchingTab == 0)
	{
		GUI.Label(gFuncs.guiRect_C(0.125, 0.235, 121, 121), "", tempStyle);
		
		setMoveGUI();
	}
	else
	{
		tempStyle.normal.background	= buttons[2];
		GUI.Label(gFuncs.guiRect_C(0.125, 0.235, 121, 121), "", tempStyle);
	}
	
	tempStyle.normal.background	= buttons[1];
	if(watchingTab == 1)
	{
		GUI.Label(gFuncs.guiRect_C(0.125, 0.487, 121, 121), "", tempStyle);
		
		//Master audio level changer
		GUI.Label(gFuncs.guiRect_L(0.23, 0.25, 200, 43), "Master level:", textStyle);
		tempStyle.normal.background	= label;
		GUI.Label(gFuncs.guiRect_R(0.91, 0.24, 300, 32), "", tempStyle);
		tempStyle.normal.background	= pointer;
		GUI.Label(gFuncs.guiRect_C(ptrAudioHrznPos / Screen.width, 0.24, 50, 32), "", tempStyle);
		
		//Mute switcher
		GUI.Label(gFuncs.guiRect_L(0.23, 0.75, 200, 43), "Mute:", textStyle);
		tempStyle.normal.background	= buttons[6];
		if(GUI.Button(gFuncs.guiRect_C(0.60, 0.74, 43, 43), "", tempStyle))
		{
			if(global_vars.audioMuted == true)
			{
				global_vars.audioMuted	= false;
				AudioListener.volume	= ptrMasterAudio;
			}
			else
			{
				global_vars.audioMuted	= true;
				AudioListener.volume	= 0.0;
			}
			global_vars.soundClick.Play();
		}
		tempStyle.normal.background	= buttons[7];
		if(GUI.Button(gFuncs.guiRect_C(0.85, 0.74, 43, 43), "", tempStyle))
		{
			if(global_vars.audioMuted == true)
			{
				global_vars.audioMuted	= false;
				AudioListener.volume	= ptrMasterAudio;
			}
			else
			{
				global_vars.audioMuted	= true;
				AudioListener.volume	= 0.0;
			}
			global_vars.soundClick.Play();
		}
		
		textStyle.alignment	= TextAnchor.UpperCenter;
		if(global_vars.audioMuted == true)	GUI.Label(gFuncs.guiRect_C(0.725, 0.75, 100, 43), "ON", textStyle);
		else								GUI.Label(gFuncs.guiRect_C(0.725, 0.75, 100, 43), "OFF", textStyle);
		textStyle.alignment	= TextAnchor.UpperLeft;
		
	}
	else
	{
		tempStyle.normal.background	= buttons[2];
		GUI.Label(gFuncs.guiRect_C(0.125, 0.487, 121, 121), "", tempStyle);
	}
	
	tempStyle.normal.background	= buttons[1];
	if(watchingTab == 2)
	{
		GUI.Label(gFuncs.guiRect_C(0.125, 0.739, 121, 121), "", tempStyle);
		
		if(global_vars.paused)
		{
			if(GUI.Button(gFuncs.guiRect_C(0.55, 0.25, 250.0, 70.0), "Restart", global_vars.buttonStyle[0]))
			{
				global_vars.m_settingsTab	= false;
				sFuncs.saveHighScore();
				Application.LoadLevel(Application.loadedLevel);
			}
			else if(GUI.Button(gFuncs.guiRect_C(0.55, 0.50, 250.0, 70.0), "Main menu", global_vars.buttonStyle[0]))
			{
				global_vars.m_settingsTab	= false;
				sFuncs.saveHighScore();
				Application.LoadLevel("menu_scene_main");
			}
			else if(GUI.Button(gFuncs.guiRect_C(0.55, 0.75, 250.0, 70.0), "Exit", global_vars.buttonStyle[0]))
			{
				sFuncs.saveHighScore();
				Application.Quit();
			}
		}
		else
		{
			GUI.Label(gFuncs.guiRect_L(0.215, 0.5, 650, 350), "Author:\n\tKarol 'karus' Drwila\nSounds:\n\tanton, pfujimoto, pcaeldries, freqman\n\totchfilter, sergenious, chipfork\n\tcorsica-s, ceebfrack, the-bizniss\nSpecial thanks for:\n\tSlodka, Woldan", textStyle);
		}
	}
	else
	{
		tempStyle.normal.background	= buttons[2];
		GUI.Label(gFuncs.guiRect_C(0.125, 0.739, 121, 121), "", tempStyle);
	}
	
	tempStyle.normal.background	= buttons[3];
	if(GUI.Button(gFuncs.guiRect_C(0.125, 0.235, 121, 121), "", tempStyle))
	{
		global_vars.soundClick.Play();
		watchingTab = 0;
	}
	tempStyle.normal.background	= buttons[4];
	if(GUI.Button(gFuncs.guiRect_C(0.125, 0.487, 121, 121), "", tempStyle))
	{
		global_vars.soundClick.Play();
		watchingTab = 1;
	}
	tempStyle.normal.background	= buttons[5];
	if(GUI.Button(gFuncs.guiRect_C(0.125, 0.739, 121, 121), "", tempStyle))
	{
		global_vars.soundClick.Play();
		watchingTab = 2;
	}
	
}

function Update()
{
	for(var i : int = 0; i < Input.touchCount; i ++)
	{
		var pos 	: Vector2 		= Input.GetTouch(i).position;
		var phase 	: TouchPhase 	= Input.GetTouch(i).phase;
		
		if(phase == TouchPhase.Began)
		{
			switch(watchingTab)
			{
				case 0:
					lastTouchPos = pos;
					break;
				case 1:
					if((pos.x >= Screen.width * 0.56625 && pos.x <= Screen.width * 0.87875) && (pos.y <= Screen.height - (Screen.height * 0.20875) && pos.y >= Screen.height - (Screen.height * 0.27125)))
					{
						ptrMasterAudio					= (pos.x - (Screen.width * 0.56625)) / (Screen.width * 0.3125);
						global_vars.audioMasterVolume	= ptrMasterAudio;
						AudioListener.volume			= ptrMasterAudio;
						ptrAudioHrznPos				 	= pos.x;
						global_vars.soundClick.Play();
					}
					break;
			}
		}
		if(phase == TouchPhase.Moved && resetedAfterChange)
		{
			switch(watchingTab)
			{
				case 0:
					if(!resetedAfterChange) break;
					
					touchPosDiff = pos - lastTouchPos;
					
					if(touchPosDiff.x > 150.0)
					{
						global_vars.movementType ++;
						if(global_vars.movementType == global_consts.MOVE_TYPES_COUNT)
						{
							global_vars.movementType = 0;
						}
						resetedAfterChange	= false;
						touchPosDiff.x		= 0.0;
						sFuncs.saveOptions();
						global_vars.soundClick.Play();
					}
					else if(touchPosDiff.x < -150.0)
					{
						global_vars.movementType --;
						if(global_vars.movementType == -1)
						{
							global_vars.movementType = global_consts.MOVE_TYPES_COUNT - 1;
						}
						touchPosDiff = Vector2.zero;
						resetedAfterChange = false;
						touchPosDiff.x		= 0.0;
						sFuncs.saveOptions();
						global_vars.soundClick.Play();
					}
					break;
			}
		}
		if(phase == TouchPhase.Ended || phase == TouchPhase.Canceled)
		{
			switch(watchingTab)
			{
				case 0:
					touchPosDiff = Vector2.zero;
					resetedAfterChange = true;
					break;
			}
		}
	}
}

function setMoveGUI()
{
	var moveRect	:	Rect	= gFuncs.guiRect_C(0.57, 0.5, 400.0, 224.0);
	
	tempStyle.normal.background = movementArt[0];
	GUI.Label(moveRect, "", tempStyle);
			
	tempStyle.normal.background = buttons[6];
	if(GUI.Button(gFuncs.guiRect_C(0.26, 0.5, 80, 80), "", tempStyle))
	{
		global_vars.soundClick.Play();
		global_vars.movementType --;
		if(global_vars.movementType == -1)
		{
			global_vars.movementType = global_consts.MOVE_TYPES_COUNT - 1;
		}
		sFuncs.saveOptions();
	}
	tempStyle.normal.background = buttons[7];
	if(GUI.Button(gFuncs.guiRect_C(0.88, 0.5, 80, 80), "", tempStyle))
	{
		global_vars.soundClick.Play();
		global_vars.movementType ++;
		if(global_vars.movementType == global_consts.MOVE_TYPES_COUNT)
		{
			global_vars.movementType = 0;
		}
		sFuncs.saveOptions();
	}
		
	moveRect.x += touchPosDiff.x;
			
	textStyle.alignment			= TextAnchor.UpperCenter;
	switch(global_vars.movementType)
	{
		case global_consts.MOVE_ANALOG_0:
			tempStyle.normal.background = movementArt[1];
			GUI.Label(moveRect, "", tempStyle);
			GUI.Label(gFuncs.guiRect_C(0.57, 0.22, 250, 40), "Virtual Analog", textStyle);
			break;
		case global_consts.MOVE_ACC_0:
			tempStyle.normal.background = movementArt[2];
			GUI.Label(moveRect, "", tempStyle);
			GUI.Label(gFuncs.guiRect_C(0.57, 0.22, 250, 40), "Tilt", textStyle);
			break;
		case global_consts.MOVE_ARROWS_0:
			tempStyle.normal.background = movementArt[3];
			GUI.Label(moveRect, "", tempStyle);
			GUI.Label(gFuncs.guiRect_C(0.57, 0.22, 250, 40), "Arrows", textStyle);
			break;
	}
	textStyle.alignment			= TextAnchor.UpperLeft;
}