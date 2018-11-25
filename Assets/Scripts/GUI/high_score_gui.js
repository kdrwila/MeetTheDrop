#pragma strict

public var bgLabel				: Texture2D;
public var buttons				: Texture2D[]		= new Texture2D[4];
public var placePointer			: Texture2D;
public var background			: Texture2D;

private var watchingPlace		: int;
private var gFuncs				: gui_controller;
private var tempStyle			: GUIStyle			= GUIStyle();
private var globalBestName		: String;
private var globalBestPlace 	: int;
private var globalBestPoints	: int;

private var watchingGlobal		: boolean;
private var loadedGlobal		: boolean;
private var loadingData			: boolean;
private var foundBest			: boolean;
private var resetQuestion		: boolean;

private var globalNames			: String[]			= new String[100];
private var globalPoints		: int[]				= new int[100];
private var globalUID			: String[]			= new String[100];
	
function Start () 
{
	global_vars.m_highScoreTab	= true;
	watchingPlace				= global_vars.lastPlace;
	gFuncs 						= gui_controller();
	watchingGlobal				= false;
	loadedGlobal				= false;
	loadingData					= false;
	foundBest					= false;
	resetQuestion				= false;
	
	tempStyle.font				= global_vars.mainTextStyle.font;
	tempStyle.alignment			= TextAnchor.MiddleCenter;
}

function OnGUI() 
{

	if(resetQuestion)
	{
		tempStyle.normal.background = background;
		GUI.Label(gFuncs.guiRect_C(0.5, 0.5, 450, 330), "", tempStyle);
			
		global_vars.mainTextStyle.alignment = TextAnchor.UpperCenter;
		GUI.Label(gFuncs.guiRect_C(0.5, 0.4, 440, 56), "Are you sure?", global_vars.mainTextStyle);
		global_vars.mainTextStyle.alignment = TextAnchor.UpperLeft;
			
		tempStyle.normal.background = buttons[3];
		if(GUI.Button(gFuncs.guiRect_C(0.35, 0.7, 150, 64), "No", tempStyle))
		{
			global_vars.soundClick.Play();
			resetQuestion = false;
		}
		if(GUI.Button(gFuncs.guiRect_C(0.65, 0.7, 150, 64), "Yes", tempStyle))
		{
			global_vars.soundClick.Play();
			for(var i : int = 0; i < 100; i ++)
			{
				global_vars.highScoreName[i]	= "None";
				global_vars.highScore[i]		= 0;
			}
			var sFuncs = script_funcs();
			
			sFuncs.saveHighScore();
			
			resetQuestion = false;
		}
		return;
	}

	tempStyle.normal.background = buttons[3];
	if(GUI.Button(gFuncs.guiRect_C(0.35, 0.9, 200, 64), "Local", tempStyle))
	{
		global_vars.soundClick.Play();
		watchingGlobal				= false;
		watchingPlace				= global_vars.lastPlace;
	}
	if(GUI.Button(gFuncs.guiRect_C(0.65, 0.9, 200, 64), "Global", tempStyle))
	{
		global_vars.soundClick.Play();
		watchingGlobal				= true;
		watchingPlace				= 0;
		if(!loadedGlobal)
		{
			loadingData = true;
			loadScores();
		}
	}

	tempStyle.normal.background = bgLabel;
	for(i = 0; i < 5; i ++)
	{
		GUI.Label(gFuncs.guiRect_C(0.5, 0.25625 + (0.117 * i), 440, 56), "", tempStyle);
		if(!watchingGlobal)
		{
			if(watchingPlace + i == global_vars.lastPlace)
			{
				tempStyle.normal.background = placePointer;
				GUI.Label(gFuncs.guiRect_L(0.235, 0.25425 + (0.117 * i), 34, 55), "", tempStyle);
				tempStyle.normal.background = bgLabel;
			}
			GUI.Label(gFuncs.guiRect_L(0.27, 0.28125 + (0.117 * i), 240, 56), (watchingPlace + i + 1) + ". " + global_vars.highScoreName[watchingPlace + i], global_vars.hsTextStyle);
			GUI.Label(gFuncs.guiRect_R(0.73, 0.28125 + (0.117 * i), 130, 56), "" + global_vars.highScore[watchingPlace + i], global_vars.hsTextStyle);	
		}
		else
		{
			GUI.Label(gFuncs.guiRect_L(0.27, 0.28125 + (0.117 * i), 240, 56), (watchingPlace + i + 1) + ". " + globalNames[watchingPlace + i], global_vars.hsTextStyle);
			GUI.Label(gFuncs.guiRect_R(0.73, 0.28125 + (0.117 * i), 130, 56), "" + globalPoints[watchingPlace + i], global_vars.hsTextStyle);
		}
	}
	
	if(watchingGlobal)
	{
		if(loadingData)
		{
			tempStyle.normal.background = background;
			GUI.Label(gFuncs.guiRect_C(0.5, 0.5, 450, 330), "", tempStyle);
						
			global_vars.mainTextStyle.alignment = TextAnchor.UpperCenter;
			GUI.Label(gFuncs.guiRect_C(0.5, 0.5, 440, 56), "Loading...", global_vars.mainTextStyle);
			global_vars.mainTextStyle.alignment = TextAnchor.UpperLeft;
		}
		
		if(!loadingData && foundBest)
		{
			tempStyle.normal.background = bgLabel;
			GUI.Label(gFuncs.guiRect_C(0.5, 0.13925, 440, 56), "", tempStyle);
			GUI.Label(gFuncs.guiRect_L(0.27, 0.16425, 240, 56), globalBestPlace + ". " + globalBestName, global_vars.hsTextStyle);
			GUI.Label(gFuncs.guiRect_R(0.73, 0.16425, 130, 56), "" + globalBestPoints, global_vars.hsTextStyle);
			tempStyle.normal.background = placePointer;
			GUI.Label(gFuncs.guiRect_L(0.235, 0.13825, 34, 55), "", tempStyle);
		}
	}
	else
	{
		tempStyle.normal.background = buttons[3];
		if(GUI.Button(gFuncs.guiRect_C(0.5, 0.1, 250, 64), "Reset scores", tempStyle))
		{
			resetQuestion = true;			
		}
	}
	
	tempStyle.normal.background	= buttons[0];
	if(GUI.Button(gFuncs.guiRect_C(0.94, 0.92, 64.0, 64.0), "", tempStyle))
	{
		global_vars.soundClick.Play();
		global_vars.m_highScoreTab	= false;
		Destroy(this.GetComponent(high_score_gui));
	}
	tempStyle.normal.background	= buttons[1];
	if(GUI.Button(gFuncs.guiRect_C(0.1, 0.5, 128.0, 128.0), "", tempStyle))
	{
		global_vars.soundClick.Play();
		if(watchingPlace > 0) watchingPlace --;
	}
	tempStyle.normal.background	= buttons[2];
	if(GUI.Button(gFuncs.guiRect_C(0.9, 0.5, 128.0, 128.0), "", tempStyle))
	{
		global_vars.soundClick.Play();
		if(watchingPlace < 95) watchingPlace ++;
	}
}

function loadScores()
{
	var www : WWW = new WWW("http://karus.server-pps.com/drop_stats.php?mode=read");
	yield www;
	
	var row 		: int		= 0;
	var type 		: int		= 0;
	var temp 		: char;
	var temp2 		: String;
	var spec 		: char		= "|"[0];
	var spec2 		: char		= "\n"[0];
	
	foundBest					= false;
	
	for(var i : int = 0; i < www.text.length; i ++)
	{
		temp = www.text[i];
		if(temp == spec)
		{
			if(type == 0)		globalUID[row] 		= temp2;
			else if(type == 1)	globalPoints[row]	= parseInt(temp2);
			
			type	= 1;
			temp2	= "";
		}
		else if(temp == spec2)
		{
			globalNames[row]	= temp2;
			type				= 0;
			temp2				= "";
			
			if(globalUID[row] == global_vars.uID && !foundBest)
			{
				globalBestPoints 	= globalPoints[row];
				globalBestName		= globalNames[row];
				globalBestPlace		= row + 1;
				foundBest			= true;
			}
			row ++;
		}
		else
		{
			temp2 = temp2 + "" + temp;
		}
	}
			 
	loadedGlobal	= true;
	loadingData		= false;
}