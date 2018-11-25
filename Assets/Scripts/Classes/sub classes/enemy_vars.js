#pragma strict

// Main traps variables
public var trapType	: int;

// Laser variables
public var gapSize	: Vector2[]	= new Vector2[2];
public var gapY		: float;
public var gapY2	: float;

function OnDestroy()
{
	if(trapType == global_consts.TRAP_LASER && Camera.main != null && Application.loadedLevel == 1)
	{
		Camera.main.GetComponent(e_functions).destroyLaser();
	}
}