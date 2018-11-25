#pragma strict

public var groundTextures	: Texture2D[]	= new Texture2D[3];
public var skybox			: Texture2D[]	= new Texture2D[3];
public var spriteScenery	: Sprite[]		= new Sprite[18];
public var spriteCloud		: Sprite[]		= new Sprite[9];

function Start () 
{
	#if UNITY_EDITOR
	global_vars.guiScaleV 	= Screen.width / 800.0;
	global_vars.guiScaleH 	= Screen.height / 480.0;
	#elif UNITY_ANDROID
	if(Screen.orientation == ScreenOrientation.Landscape)
	{
		global_vars.guiScaleV 	= Screen.width / 800.0;
		global_vars.guiScaleH 	= Screen.height / 480.0;
	}
	else if(Screen.orientation == ScreenOrientation.Portrait)
	{
		global_vars.guiScaleV 	= Screen.width / 480.0;
		global_vars.guiScaleH 	= Screen.height / 800.0;
	}
	#endif
	
	var sFuncs	= script_funcs();
	
	sFuncs.loadOptions();
	sFuncs.loadHighScore();
	
	AudioListener.volume		= global_vars.audioMasterVolume;
	
	global_vars.scenerySet		= Random.Range(0, 3);
	global_vars.lastScenerySet	= global_vars.scenerySet;
	
	updateScnryTxt();
}

function updateScnryTxt()
{
	var temp : GameObject;
	var sFuncs	= script_funcs();
	
	// environment
	for(var i : int = 0; i < 6; i ++)
	{
		temp = GameObject.Find("scenery_" + i);
		
		var model = sFuncs.getSceneryModelID(temp);
		
		temp.GetComponent(SpriteRenderer).sprite	= spriteScenery[model + (6 * global_vars.scenerySet)];
		
		if(i > 2) continue;
		
		// clouds
		temp = GameObject.Find("cloud_" + i);
		
		temp.GetComponent(SpriteRenderer).sprite	= spriteCloud[Random.Range(0, 3) + (3 * global_vars.scenerySet)];
	}
	
	var grounds				= GameObject.FindGameObjectsWithTag("ground");
	for(var gid : GameObject in grounds)
	{
		gid.renderer.material.mainTexture			= groundTextures[global_vars.scenerySet];
		gid.renderer.material.mainTextureScale.x	= gid.transform.localScale.x / 25.0;
	}
	
	GameObject.Find("skybox").renderer.material.mainTexture	= skybox[global_vars.scenerySet];
}