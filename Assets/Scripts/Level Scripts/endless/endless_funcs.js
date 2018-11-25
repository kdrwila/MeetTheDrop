#pragma strict

public var prefabGap			: GameObject;

private var lastSetComponentId	: int		= 0;
private var lastRandomSet		: int		= 0;

private var pickupCount			: int[]		= new int[2];
private var pos					: Vector3[]	= new Vector3[2];
private var size 				: float[]	= new float[2];
private var gapSize				: float;
private var gapSize_h			: float;
private var gapPos				: float;
private var gapPos_l			: float;
private var gapPos_r			: float;

private var gapObj				: GameObject[]	= new GameObject[16];

private var lastGap				: float[]	= new float[2];
private var beforeGap			: float[]	= new float[2];
private var beforeY				: float;
private var lastY				: float;

private var gFuncs				: ground_controller;
private var pFuncs				: pickup_funcs;
private var eVars				: endless_vars;

function Awake()
{
	gFuncs						= GetComponent(ground_controller);
	pFuncs						= GetComponent(pickup_funcs);
	eVars						= GetComponent(endless_vars);
	endless_vars.lastEndlessY 	= 0.0;
	
	pos[0].z					= -3.7;
	pos[1].z					= -3.7;
	
	for(var i : int; i < 16; i ++)
	{
		gapObj[i]			= Instantiate(prefabGap, Vector3(1000.0, 1000.0, 1000.0), prefabGap.transform.rotation);
		gapObj[i].SetActive(false);
	}
}

private var changer				: GameObject;
private var rand 				: int;
private var nextElevatorY		: float;
private var diff				: float;		

function createEndlesPlatform(count : int, nextY : float)
{
	for(var i : int = 0; i < count; i ++)
	{
		if(endless_vars.firstNewScnry)
		{
			changer		 				= Instantiate(eVars.changerPrefab, Vector3(-218.0, nextY + 31.0, -11.0), eVars.changerPrefab.transform.rotation);
			endless_vars.firstNewScnry	= false;
		}
		
		if(nextY > -30000)	gapSize = Random.Range(105.0 + (nextY * 0.0025), 200.0 + (nextY * 0.005));
		else				gapSize = Random.Range(30.0, 50.0);
		gapSize_h					= gapSize * 0.5;
		
		switch(endless_vars.endlessRandomSet[lastSetComponentId, lastRandomSet])
		{
			case global_consts.GROUND_LEFT:
				gapPos = Random.Range(-220.0 + gapSize_h, -gapSize_h);
				break;
			case global_consts.GROUND_RIGHT:
				gapPos = Random.Range(gapSize_h, 220.0 - gapSize_h);
				break;
			case global_consts.GROUND_CENTER:
				gapPos = Random.Range(-110.0 + gapSize_h, 110.0 - gapSize_h);
				break;
		}
		
		findGapObject(gapPos, gapSize, nextY);
		
		pos[0].x 	= 0.0;
		pos[1].x 	= 0.0;
		pos[0].y	= nextY;
		pos[1].y	= nextY;
		gapPos_l	= gapPos - gapSize_h;
		gapPos_r	= gapPos + gapSize_h;
		
		if(gapPos - gapSize > -210)
		{ 
			size[0]		= Mathf.Abs(-220 - gapPos_l);
			pos[0].x 	= gapPos_l - (size[0] * 0.5);
			pos[0].y 	= nextY;
			gFuncs.createGround(pos[0], size[0], false, false);
		}
		if(gapPos + gapSize < 210)
		{ 
			size[1]		= 220 - gapPos_r;
			pos[1].x 	= gapPos_r + (size[1] * 0.5);
			pos[1].y 	= nextY;
			gFuncs.createGround(pos[1], size[1], false, false);
		}
		
		createRandomTrap(nextY, pos, size);
		createRandomPickup(nextY, pos, size);
		
		rand			= Random.Range(50.0, 90.0);
		beforeY			= lastY + rand;
		lastY			= rand;
		beforeGap[0]	= lastGap[0];
		beforeGap[1]	= lastGap[1];
		lastGap[0]		= gapPos_l;
		lastGap[1]		= gapPos_r;				
		nextY 			-= rand;
		
		if(global_vars.isElevatorCreated)
		{
			nextElevatorY 	= pFuncs.getNextElevatorDoorsY();
			diff 			= nextY - nextElevatorY;
			
			if(diff <= 90.0 && diff > 0.0)
			{
				nextY -= diff;
				pFuncs.removeFirstElevatorDoorsY();
			}
			else if(diff <= 0.0)
			{
				pFuncs.removeFirstElevatorDoorsY();
			}
		}
		
		if(lastSetComponentId != 9)	lastSetComponentId ++;
		else
		{
			lastRandomSet = Random.Range(0, global_consts.ENDLESS_RANDOM_SETS);
			lastSetComponentId = 0;
		}
	}
	endless_vars.lastEndlessY = nextY;
}

function foundPickupXPos(pos : Vector3[], size : float[]) : float
{
	size[0] = (size[0] - 40.0)  * 0.5;
	size[1] = (size[1] - 40.0)  * 0.5;
	
	if(Random.Range(0, 0.00000002) == 0)
	{
		if(pos[0].x != 0.0)			return Random.Range(pos[0].x - size[0], pos[0].x + size[0]);
		else if(pos[1].x != 0.0)	return Random.Range(pos[1].x - size[1], pos[1].x + size[1]);
	}
	else
	{
		if(pos[1].x != 0.0)			return Random.Range(pos[1].x - size[1], pos[1].x + size[1]);
		else if(pos[0].x != 0.0)	return Random.Range(pos[0].x - size[0], pos[0].x + size[0]);
	}
	
	return Mathf.Infinity;
}

function createRandomPickup(nextY : float, pos : Vector3[], size : float[])
{
	rand = Random.Range(0, 100);

	if(rand >= 0 && rand <= 9)
	{
		var pickupPos	: Vector3	= Vector3(foundPickupXPos(pos, size), nextY + 15.0, -11.0);
		if(pickupPos.x != Mathf.Infinity)
		{
			GetComponent(pickup_funcs).createPickup(pickupPos, global_consts.PICKUP_EXPLOSIVE);
		}
		
		Random.seed = Random.Range(0, 9999999);
	}
	else if(rand >= 10 && rand <= 19)
	{
		pickupPos	= Vector3(0.0, nextY + 15.0, -11.0);
		pickupPos.x = foundPickupXPos(pos, size);
		if(pickupPos.x != Mathf.Infinity)
		{
			GetComponent(pickup_funcs).createPickup(pickupPos, global_consts.PICKUP_TELEPORT);
		}
	}
	else if(rand >= 20 && rand <= 22)
	{
		pickupPos	= Vector3(foundPickupXPos(pos, size), nextY + 15.0, -11.0);
		if(pickupPos.x != Mathf.Infinity)
		{
			GetComponent(pickup_funcs).createPickup(pickupPos, global_consts.PICKUP_ELEVATOR);
		}
	}
	if(rand >= 23 && rand <= 25)
	{
		pickupPos	= Vector3(foundPickupXPos(pos, size), nextY + 15.0, -11.0);
		if(pickupPos.x != Mathf.Infinity)
		{
			GetComponent(pickup_funcs).createPickup(pickupPos, global_consts.PICKUP_DOUBLE_POINTS);
		}
	}
	if(rand >= 26 && rand <= 28)
	{
		pickupPos	= Vector3(0.0, nextY + 15.0, -11.0);
		pickupPos.x = foundPickupXPos(pos, size);
		if(pickupPos.x != Mathf.Infinity)
		{
			GetComponent(pickup_funcs).createPickup(pickupPos, global_consts.PICKUP_GOD);
		}
	}
}

function createRandomTrap(nextY : float, pos : Vector3[], size : float[])
{
	if(!global_vars.playerSettings.armed)	return;
	if(Random.Range(0, 9) != 0)				return;
	
	var trapPos	: Vector3 	= Vector3(foundPickupXPos(pos, size), nextY + 15.0, -11.0);
	
	if(trapPos.x != Mathf.Infinity)
	{
		var trap	: GameObject	= GetComponent(e_functions).createTrap(trapPos);
		
		if(trap == null) return;
		
		var eVars	: enemy_vars	= trap.GetComponent(enemy_vars);
		
		if(eVars.trapType == global_consts.TRAP_LASER)
		{
			eVars.gapSize[0].x 	= lastGap[0] + 10.0;
			eVars.gapSize[0].y	= lastGap[1] - 10.0;
			eVars.gapSize[1].x	= beforeGap[0] + 10.0;
			eVars.gapSize[1].y	= beforeGap[1] - 10.0;
			eVars.gapY			= (lastY - 5) * 0.1;
			eVars.gapY2			= (beforeY - 5) * 0.1;
		}
	}
}

function findGapObject(x : float, size : float, y : float)
{
	for(var i : int; i < 16; i ++) if(gapObj[i].activeInHierarchy == false)
	{
		gapObj[i].transform.position 		= Vector3(x, y, -7.0);
		gapObj[i].transform.localScale.x	= gapSize;
		gapObj[i].SetActive(false);
		break;
	}
}