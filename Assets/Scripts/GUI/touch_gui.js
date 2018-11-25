#pragma strict

// IDs:
//
// 0	->	Explosion button
// 1	->	Teleport button
// 2	->	Left arrow
// 3	->	Right arrow
// 4	->	Pause button
//

private var btSize		: Vector2[]	= new Vector2[5];
private var scrW		: float[]	= new float[5];
private var scrH		: float[]	= new float[5];
private var MAX_SPEED	: float;
private var phase 		: TouchPhase;
private var pos 		: Vector2;

function Start () 
{
	var tmpBtSize	= (80 * global_vars.guiScaleV);
	var tmpBtSize2	= (140 * global_vars.guiScaleV);
	var tmpBtSize3	= (100 * global_vars.guiScaleV);
	
	btSize[0]		= Vector2(tmpBtSize * 0.5, tmpBtSize * 0.5);
	btSize[1]		= Vector2(tmpBtSize * 0.5, tmpBtSize * 0.5);
	btSize[2]		= Vector2(tmpBtSize2 * 0.5, tmpBtSize * 0.5);
	btSize[3]		= Vector2(tmpBtSize2 * 0.5, tmpBtSize * 0.5);
	btSize[4]		= Vector2(tmpBtSize3 * 0.5, tmpBtSize3 * 0.5);

	scrW[0]			= (Screen.width * 0.75);	// explosives
	scrW[1]			= (Screen.width * 0.85);	// teleports
	scrW[2]			= (Screen.width * 0.125);	// left
	scrW[3]			= (Screen.width * 0.325);	// right
	scrW[4]			= (Screen.width * 0.5);		// pause
	scrH[0]			= Screen.height - (Screen.height * 0.85);
	scrH[1]			= Screen.height - (Screen.height * 0.75);
	scrH[2]			= Screen.height - (Screen.height * 0.8725);
	scrH[3]			= Screen.height - (Screen.height * 0.8725);
	scrH[4]			= Screen.height - (Screen.height * 0.0875);
	
	MAX_SPEED		= 64.0 * movement_functions.velocityMultipler;
}

function FixedUpdate () 
{
	if(global_vars.paused || global_vars.gameEnd)	return;
	
	touchExplosion();
}

function touchExplosion()
{
	for(var i = 0; i < Input.touchCount; i ++) if(movement_functions.analogTouchId != i)
	{
		phase = Input.GetTouch(i).phase;
		if(phase == TouchPhase.Canceled || phase == TouchPhase.Ended && movement_functions.analogTouchId > i)
		{
			movement_functions.analogTouchId = i;
		}
		
		pos = Input.GetTouch(i).position;
		
		// Explosion button
		if(isTouched(pos, 0))
		{
			GetComponent(ground_controller).createExplosion(global_vars.player.transform.position, 30.0, 1);
			continue;
		}
		// Teleport button
		if(isTouched(pos, 1))
		{
			GetComponent(movement_functions).teleportPlayer();
			continue;
		}
		
		// Pause button
		if(isTouched(pos, 4) || Input.GetKeyDown(KeyCode.Escape))
		{
			Camera.main.GetComponent(level_gui).pauseGame();
		}
		
		// Movement arrows
		if(global_vars.movementType == global_consts.MOVE_ARROWS_0)
		{
			if(isTouched(pos, 2))
			{
				global_vars.player.rigidbody.velocity.x += -28.5 * movement_functions.velocityMultipler;
				if(global_vars.player.rigidbody.velocity.x < -MAX_SPEED)
				{
					global_vars.player.rigidbody.velocity.x	= -MAX_SPEED;
				}
			}
			else if(isTouched(pos, 3))
			{
				global_vars.player.rigidbody.velocity.x += 28.5 * movement_functions.velocityMultipler;
				if(global_vars.player.rigidbody.velocity.x > MAX_SPEED)
				{
					global_vars.player.rigidbody.velocity.x	= MAX_SPEED;
				}
			}
		}
	}
}

function isTouched(pos : Vector2, id : int) : boolean
{
	return isTouched(pos, scrW[id], scrH[id], btSize[id]);
}

function isTouched(pos : Vector2, width : float, height : float, size : Vector2) : boolean
{
	if(pos.x > (width - size.x) && pos.x < (width + size.x) && pos.y < (height + size.y) && pos.y > (height - size.y))
	{
		return true;
	}
	return false;
}