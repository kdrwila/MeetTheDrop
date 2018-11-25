#pragma strict

class script_funcs extends System.ValueType
{
	function getDistanceBetweenPoints2D(pos1 : Vector2, pos2 : Vector2) : float
	{
		if(pos1.x == pos2.x) 		return Mathf.Abs(pos1.y - pos2.y);
		else if(pos1.y == pos2.y)	return Mathf.Abs(pos1.x - pos2.x);
		else
		{
			var dist1 = Mathf.Abs(pos1.x - pos2.x);
			var dist2 = Mathf.Abs(pos1.y - pos2.y);
			return Mathf.Sqrt(Mathf.Pow(dist1, 2) + Mathf.Pow(dist2, 2));
		}
	}
	
	function getSineBetweenPoints2D(pos1 : Vector2, pos2 : Vector2) : SineEx
	{
		var result = SineEx();
		
		var dist1 = Mathf.Abs(pos1.x - pos2.x);
		var dist2 = getDistanceBetweenPoints2D(pos1, pos2);
		
		result.sine = dist1 / dist2;
		
		if(pos1.x <= pos2.x && pos1.y <= pos2.y)		result.quarter = 2;
		else if(pos1.x >= pos2.x && pos1.y <= pos2.y)	result.quarter = 3;
		else if(pos1.x >= pos2.x && pos1.y >= pos2.y)	result.quarter = 0;
		else if(pos1.x <= pos2.x && pos1.y >= pos2.y)	result.quarter = 1;
		
		return result;
	}
	
	function getNearPosFromAngle2D(pos1 : Vector2, angle : float, range : float, quarter : int) : Vector2
	{
		var pos : Vector2;
		switch(quarter)
		{
			case 0:
				pos.x = pos1.x + (range * Mathf.Sin(angle));
				pos.y = pos1.y + (range * Mathf.Cos(angle));
				break;
			case 1:
				pos.x = pos1.x - (range * Mathf.Sin(angle));
				pos.y = pos1.y + (range * Mathf.Cos(angle));
				break;
			case 2:
				pos.x = pos1.x - (range * Mathf.Sin(angle));
				pos.y = pos1.y - (range * Mathf.Cos(angle));
				break;
			case 3:
				pos.x = pos1.x + (range * Mathf.Sin(angle));
				pos.y = pos1.y - (range * Mathf.Cos(angle));
				break;
		}
		
		return pos;
	}
	
	function playAnimation(object : GameObject, columnSize : int, rowSize : int, colFrameStart : int, rowFrameStart : int, totalFrames : int, framesPerSecond : float)
	{
		var index	: int		= (Time.time * framesPerSecond) % totalFrames;
		var size	: Vector2	= Vector2(1.0 / columnSize, 1.0 / rowSize);
		var offset	: Vector2	= Vector2((size.x * colFrameStart) + (size.x * index), (1.0 - size.y) + (size.y * rowFrameStart));
		
		object.renderer.material.mainTextureOffset 	= offset;
		object.renderer.material.mainTextureScale	= size;
		
		if(object.renderer.material.HasProperty("_BumpMap"))
		{
			object.renderer.material.SetTextureOffset("_BumpMap", offset);
			object.renderer.material.SetTextureScale("_BumpMap", size);
		}
	}
	
	function saveOptions()
	{
		PlayerPrefs.SetInt("Move_type", global_vars.movementType);
		PlayerPrefs.SetFloat("Audio_master", global_vars.audioMasterVolume);
		PlayerPrefs.Save();
	}
	
	function loadOptions()
	{
		if(global_vars.loadedOptions) return;
		
		global_vars.movementType		= PlayerPrefs.GetInt("Move_type");
		global_vars.audioMasterVolume	= PlayerPrefs.GetFloat("Audio_master", 1.0);
		player_settings.playerName		= PlayerPrefs.GetString("player_name", "Player");
		global_vars.uID					= PlayerPrefs.GetString("uid", "");
				
		if(global_vars.uID == "" || global_vars.uID.length < 16) randomUID();
		
		global_vars.loadedOptions	= true;
	}
	
	function saveHighScore()
	{
		for(var i : int = 0; i < 100; i ++)
		{
			PlayerPrefs.SetInt("hs_" + i, global_vars.highScore[i]);
			PlayerPrefs.SetString("hs_name_" + i, global_vars.highScoreName[i]);
		}
	}
	
	function loadHighScore()
	{
		if(global_vars.loadedScores) return;
		
		for(var i : int = 0; i < 100; i ++)
		{
			global_vars.highScore[i]		= PlayerPrefs.GetInt("hs_" + i);
			global_vars.highScoreName[i]	= PlayerPrefs.GetString("hs_name_" + i);
		}
		
		global_vars.loadedScores = true;
	}
	
	function randomUID()
	{
		var charsAZaz09 : String	= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz01234656789";
		global_vars.uID				= "";
		
		for(var i : int = 0; i < 16; i ++)
		{
			global_vars.uID += "" + charsAZaz09[Random.Range(0, charsAZaz09.Length)];
		}
		PlayerPrefs.SetString("uid", global_vars.uID);
	}
	
	function getSceneryModelID(scnry : GameObject)
	{
		var tempSprite : Sprite = scnry.GetComponent(SpriteRenderer).sprite;
		var modelID : int = tempSprite.name[tempSprite.name.length - 1];

		return modelID - 48;
	}
}