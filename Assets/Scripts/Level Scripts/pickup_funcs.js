#pragma strict

public var pickupPrefab 		: GameObject[]	= new GameObject[5];
public var addPrefabs			: GameObject[]	= new GameObject[3];

private var explosivesCount		: int;
private var frameSkip			: int;
private var nextElevatorDoorsY	: float[]		= new float[32];
private var doorsToOpen			: GameObject	= null;

function Awake () 
{
	for(var i : int = 0; i < 32; i ++)
	{
		nextElevatorDoorsY[i] = Mathf.Infinity;
	}
}

function FixedUpdate () 
{
	frameSkip ++;
	if(frameSkip != 3) return;
	
	if(doorsToOpen != null)
	{
		openElevatorDoors(doorsToOpen, false);
	}
		
	frameSkip = 0;
}

function createPickup(pos : Vector3, type : int)
{
	var pickup : GameObject = Instantiate(pickupPrefab[type], pos, pickupPrefab[type].transform.rotation);
	
	switch(type)
	{
		case global_consts.PICKUP_EXPLOSIVE:
			pickup.transform.position.y	-= 8.0;
			break;
		case global_consts.PICKUP_TELEPORT:
			break;
		case global_consts.PICKUP_ELEVATOR:
			pickup.transform.position.z += 6.0;
			
			var elevator 		: GameObject	= Instantiate(addPrefabs[1], Vector3(pos.x - 14.0, pos.y - 8.6, pos.z + 16.0), addPrefabs[1].transform.rotation);
			var elevatorDoors	: GameObject	= Instantiate(addPrefabs[2], Vector3(pos.x - 17.3, pos.y - 8.6, pos.z + 16.4), addPrefabs[1].transform.rotation);
			
			elevatorDoors.transform.parent						= elevator.transform;
			pickup.GetComponent(pickup_vars).elevatorDoors		= elevatorDoors;
			pickup.GetComponent(pickup_vars).elevatorObject		= elevator;
			
			for(var i : int = 0; i < Random.Range(50, 100); i ++)
			{
				var frame : GameObject = Instantiate(addPrefabs[0], Vector3(pos.x - 16.4, pos.y - 26.0 - (i * 15.974), pos.z + 23.97), addPrefabs[0].transform.rotation);
				if(i % 2)
				{
					frame.transform.Rotate(180.0, 0.0, 0.0);
					frame.transform.eulerAngles.y	+= 0.4;
					frame.transform.position.y		+= 16.0;
				}
				frame.transform.parent			= pickup.transform;
			}
			
			var y		: float			= pos.y - (i * 15.974);
			
			pickup.GetComponent(pickup_vars).elevatorMinY = y;
			
			queueElevatorDoorsY(y - 25.0);
			Destroy(pickup, global_consts.GROUND_STAY_TIME * 2);
			
			global_vars.isElevatorCreated			= true;
			
			break;
		case global_consts.PICKUP_DOUBLE_POINTS:
		
			// Rising pickup and clouring it
			pickup.transform.position.y 			+= 10.0;
			pickup.renderer.material.color 			= Color(1, 0.33, 0);
			break;
		case global_consts.PICKUP_GOD:
			
			pickup.transform.localScale				= Vector3.one * 21.0;
			break;
	}
	
	pickup.transform.position.z 			-= 2.0;
	
	// darkrer materials for night scenery
	if(global_vars.scenerySet == 2)
	{
		// as the explosives prefab don't have renderer it selft
		// it is need to be changed in his childrens
		if(type == global_consts.PICKUP_EXPLOSIVE || type == global_consts.PICKUP_ELEVATOR)
		{
			var renderers = pickup.GetComponentsInChildren(Renderer);
			for (var rend : Renderer in renderers) 
			{
				rend.material.color = Color(0.35, 0.35, 0.35);
			}
			
			if(type == global_consts.PICKUP_ELEVATOR)
			{
				var elvtor = GameObject.Find("elevator(Clone)");
				elvtor.renderer.material.color = Color(0.35, 0.35, 0.35);
				renderers = elvtor.GetComponentsInChildren(Renderer);
				for (var rend : Renderer in renderers) 
				{
					rend.material.color = Color(0.35, 0.35, 0.35);
				}
			}
		}
		else
		{
			pickup.renderer.material.color			= Color(0.35, 0.35, 0.35);
		}
	}
	
	pickup.GetComponent(pickup_vars).type = type;
}

function getNextElevatorDoorsY() : float
{	
	return nextElevatorDoorsY[0];
}

function removeFirstElevatorDoorsY()
{
	for(var i : int = 0; i < 32; i ++)
	{
		nextElevatorDoorsY[i] = nextElevatorDoorsY[i + 1];
		if(nextElevatorDoorsY[i] == Mathf.Infinity)
		{
			break;
		}
	}
}

function queueElevatorDoorsY(y : float)
{
	for(var i : int = 0; i < 32; i ++)	if(nextElevatorDoorsY[i] == Mathf.Infinity)
	{
		nextElevatorDoorsY[i] = y;
		break;
	}
}

function openElevatorDoors(elevator : GameObject, init : boolean)
{
	var toRemove : float = 1.5 * Time.fixedDeltaTime * frameSkip;
	
	if(init)
	{
		doorsToOpen = elevator;
	}
	
	if(elevator.GetComponent(pickup_vars).elevatorDoors.transform.localScale.x - toRemove > 0.0)
	{
		elevator.GetComponent(pickup_vars).elevatorDoors.transform.localScale.x -= toRemove;
	}
	else
	{
		doorsToOpen = null;
		global_vars.player.GetComponent(player_behaviour).initLoop(Vector3(180.0, 0.0, 0.0));
		global_vars.player.GetComponent(player_behaviour).initMove(Vector3(0.0, 0.0, 11.0), 15.0);
	}
}
	