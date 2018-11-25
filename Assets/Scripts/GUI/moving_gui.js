#pragma strict

private var MAX_GUI		: int			= 4;

private var finished	: boolean[] 	= new boolean[MAX_GUI];
private var diff		: Vector2[]		= new Vector2[MAX_GUI];
private var step		: Vector2[]		= new Vector2[MAX_GUI];
private var pos			: Vector2[]		= new Vector2[MAX_GUI];
private var scale		: Vector2[]		= new Vector2[MAX_GUI];
private var text 		: String[]		= new String[MAX_GUI];
private var texture		: Texture2D[]	= new Texture2D[MAX_GUI];
private var type		: int[]			= new int[MAX_GUI];
private var removeTime	: float[]		= new float[MAX_GUI];

private var gFuncs		: gui_controller;
private var tempStyle	: GUIStyle		= GUIStyle();

function Start()
{
	gFuncs = gui_controller();
	for(var i = 0; i < MAX_GUI; i ++)
	{
		diff[i].x = Mathf.Infinity;
	}
}

function FixedUpdate () 
{
	updateGui();
}

function updateGui()
{
	if(!global_vars.gameEnd) return;
	
	for(var i : int = 0; i < MAX_GUI; i ++) if(diff[i].x != Mathf.Infinity)
	{
		if(!finished[i])
		{
			pos[i].x	+= step[i].x;
			pos[i].y	+= step[i].y;
						
			diff[i].x	-= step[i].x;
			diff[i].y	-= step[i].y;
		}
				
		if(diff[i].x > (-step[i].x - 0.01) && diff[i].x < (step[i].x + 0.01) && diff[i].y > (-step[i].y - 0.01) && diff[i].y < (step[i].y + 0.01))
		{
			removeTime[i]	= Time.timeSinceLevelLoad + 5.0;
			finished[i]		= true;
		}
				
		if((removeTime[i] < Time.timeSinceLevelLoad) && finished[i])
		{
			diff[i].x = Mathf.Infinity;
		}
	}
}

function OnGUI()
{
	for(var i : int = 0; i < MAX_GUI; i ++) if(diff[i].x != Mathf.Infinity)
	{
		switch(type[i])
		{
			case 0:
				if(texture[i] != null)
				{
					tempStyle.normal.background = texture[i];
					GUI.Label(gFuncs.guiRect_L(pos[i], scale[i]), text[i], tempStyle);
				}
				else GUI.Label(gFuncs.guiRect_L(pos[i], scale[i]), text[i], global_vars.hsTextStyle);
				break;
			case 1:
				if(texture[i] != null)
				{
					tempStyle.normal.background = texture[i];
					GUI.Label(gFuncs.guiRect_C(pos[i], scale[i]), text[i], tempStyle);
				}
				else GUI.Label(gFuncs.guiRect_C(pos[i], scale[i]), text[i], global_vars.hsTextStyle);
				break;
			case 2:
				if(texture[i] != null)
				{
					tempStyle.normal.background = texture[i];
					GUI.Label(gFuncs.guiRect_R(pos[i], scale[i]), text[i], tempStyle);
				}
				else GUI.Label(gFuncs.guiRect_R(pos[i], scale[i]), text[i], global_vars.hsTextStyle);
				break;
		}
	}
}

function initMovingGui(_type : int, _speed : float, _scale : Vector2, _pos : Vector2, _diff : Vector2, _text : String, _texture : Texture2D) : int
{
	for(var i = 0; i < MAX_GUI; i ++) if(diff[i].x == Mathf.Infinity)
	{
		scale[i] 	= _scale;
		pos[i]		= _pos;
		diff[i]		= _diff;
		text[i]		= _text;
		texture[i]	= _texture;
		type[i]		= _type;
		finished[i]	= false;
		
		step[i].x	= _diff.x / _speed * Time.smoothDeltaTime;
		step[i].y	= _diff.y / _speed * Time.smoothDeltaTime;
		
		return i;
	}
	return -1;
}

function initMovingGui(_type : int, _speed : float, _scale : Vector2, _pos : Vector2, _diff : Vector2, _text : String) : int
{
	return initMovingGui(_type, _speed, _scale, _pos, _diff, _text, null);
}

function initMovingGui(_type : int, _speed : float, _scale : Vector2, _pos : Vector2, _diff : Vector2, _texture : Texture2D) : int
{
	return initMovingGui(_type, _speed, _scale, _pos, _diff, "", _texture);
}

function isFinished(id : int) : boolean
{
	if(id == -1) return true;
	
	return finished[id];
}

function destroyMovingGui(id : int)
{
	diff[id].x = Mathf.Infinity;
}