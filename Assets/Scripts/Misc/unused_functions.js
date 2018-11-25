#pragma strict

/*
function createGroundSquare(prefab : GameObject, pos : Vector3, type : int, corner : boolean, rest : float)
{
	var tempObject = Instantiate(prefab, pos, prefab.transform.rotation);
	
	switch(type)
	{
		case global_consts.GROUND_WHITE:
			tempObject.renderer.material.color = Color.white;
			break;
		case global_consts.GROUND_RED:
			tempObject.renderer.material.color = Color.red;
			break;
		case global_consts.GROUND_YELLOW:
			tempObject.renderer.material.color = Color.yellow;
			break;
		case global_consts.GROUND_GREEN:
			tempObject.renderer.material.color = Color.green;
			break;
	}
	if(corner == true)
	{
		tempObject.transform.localScale.x = rest / 2;
	}
	
	tempObject.GetComponent(ground_vars).isOnCorner = corner;
	tempObject.GetComponent(ground_vars).groundType = type;
	tempObject.name = "ground_" + global_vars.groundUniqueId;
	tempObject.rigidbody.Sleep();
	global_vars.groundUniqueId ++;
	
	Destroy(tempObject, global_consts.GROUND_STAY_TIME);
}

function createExplosion(pos : Vector3, radius : float, force : float)
{
	if(!global_vars.playerSettings.explosivesCount)									return;
	if(lastExplosion + global_consts.EXPLOSION_TIMEOUT > Time.realtimeSinceStartup)	return;
	
	lastExplosion = Time.realtimeSinceStartup;
	global_vars.playerSettings.explosivesCount --;
	
	var glist		: Collider[]	= Physics.OverlapSphere(pos, radius);
	var maxOnLeft	: GameObject;
	var maxOnRight	: GameObject;
	var dGround		: GameObject[]	= new GameObject[2];
	
	for(var gid : Collider in glist)
	{
		if(gid.tag != "ground") continue;
		
		if(maxOnLeft == null)	
		{	
			maxOnLeft = gid.gameObject;
		}
		else if(maxOnLeft.transform.position.x > gid.gameObject.transform.position.x)
		{
			maxOnLeft = gid.gameObject;
		}
		if(maxOnRight == null)
		{
			maxOnRight = gid.gameObject;
		}
		else if(maxOnRight.transform.position.x < gid.gameObject.transform.position.x)
		{
			maxOnRight = gid.gameObject;
		}
	}
	
	var explosion : GameObject = Instantiate(explosionPrefab, pos, explosionPrefab.transform.rotation);
	Destroy(explosion, 1.0);
	
	if(maxOnLeft != null) if(maxOnLeft.GetComponent(ground_vars).isOnCorner == false)
	{
		dGround[0] = Instantiate(dGroundPrefab, maxOnLeft.transform.position, dGroundPrefab.transform.rotation);
		dGround[0].transform.position.x -= 0.2;
		dGround[0].transform.Rotate(180.0, 180.0, 0.0);
		var smoke : GameObject = Instantiate(smokePrefab, maxOnLeft.transform.position, smokePrefab.transform.rotation);
		smoke.transform.position.z += 5;
		Destroy(dGround[0], global_consts.GROUND_STAY_TIME);
		Destroy(smoke, 6.5);
	}
	if(maxOnRight != null) if(maxOnRight.GetComponent(ground_vars).isOnCorner == false)
	{
		dGround[1] = Instantiate(dGroundPrefab, maxOnRight.transform.position, dGroundPrefab.transform.rotation);
		dGround[1].transform.position.x += 0.2;
		smoke = Instantiate(smokePrefab, maxOnRight.transform.position, smokePrefab.transform.rotation);
		smoke.transform.position.z += 5;
		Destroy(dGround[1], global_consts.GROUND_STAY_TIME);
		Destroy(smoke, 6.5);
	}
		
	for(var gid : Collider in glist)
	{
		if(gid.tag != "ground") continue;
		var gBits 	: GameObject = Instantiate(groundBitsPrefab, gid.gameObject.transform.position, groundBitsPrefab.transform.rotation);
		
		gBits.rigidbody.mass = Random.Range(0.1, 1.0);
		switch(gid.gameObject.GetComponent(ground_vars).groundType)
		{
			case global_consts.GROUND_RED:
				gBits.renderer.material.color = Color.red;
				break;
			case global_consts.GROUND_YELLOW:
				gBits.renderer.material.color = Color.yellow;
				break;
			case global_consts.GROUND_GREEN:
				gBits.renderer.material.color = Color.green;
				break;
		}
		gBits.rigidbody.velocity = Vector3(Random.Range(-100, 100), Random.Range(-100, 100), 0.0);
		Destroy(gBits, 4);
		
		Destroy(gid.gameObject);
	}
}

function createGround(pos : Vector3, size : float)
{
	var slices 			: int			= size / 10;
	var rest 			: float			= size % 10;
	var side			: boolean;
	var tempObject		: GameObject;
		
	if(slices % 2 == 0)
	{
		createGroundSquare(groundPrefab, Vector3(pos.x + 5, pos.y, pos.z), global_consts.GROUND_RED, false, rest);
		createGroundSquare(groundPrefab, Vector3(pos.x - 5, pos.y, pos.z), global_consts.GROUND_WHITE, false, rest);
		
		for(var i = 2; i < slices; i ++)
		{
			if(side)
			{
				createGroundSquare(groundPrefab, Vector3(pos.x + 5 + (10 * (i / 2)), pos.y, pos.z), global_consts.GROUND_RED, false, rest);
				side = false;
			}
			else
			{
				createGroundSquare(groundPrefab, Vector3(pos.x - 5 - (10 * (i / 2)), pos.y, pos.z), global_consts.GROUND_WHITE, false, rest);
				side = true;
			}
		}
		
		if(rest == 0.0) return;
		
		createGroundSquare(groundPrefab, Vector3(pos.x + (10 * (slices / 2)) + (rest / 4), pos.y, pos.z), global_consts.GROUND_YELLOW, true, rest);
		createGroundSquare(groundPrefab, Vector3(pos.x - (10 * (slices / 2)) - (rest / 4), pos.y, pos.z), global_consts.GROUND_YELLOW, true, rest);
	}
	else
	{
		createGroundSquare(groundPrefab, pos, global_consts.GROUND_GREEN, false, rest);
		
		for(i = 2; i < slices + 1; i ++)
		{
			if(side)
			{
				createGroundSquare(groundPrefab, Vector3(pos.x + (10 * (i / 2)), pos.y, pos.z), global_consts.GROUND_RED, false, rest);
				side = false;
			}
			else
			{
				createGroundSquare(groundPrefab, Vector3(pos.x - (10 * (i / 2)), pos.y, pos.z), global_consts.GROUND_WHITE, false, rest);
				side = true;
			}
		}
		
		if(rest == 0.0) return;
		
		createGroundSquare(groundPrefab, Vector3(pos.x - (10 * (slices / 2)) - 5 - (rest / 4), pos.y, pos.z), global_consts.GROUND_YELLOW, true, rest);
		createGroundSquare(groundPrefab, Vector3(pos.x + (10 * (slices / 2)) + 5 + (rest / 4), pos.y, pos.z), global_consts.GROUND_YELLOW, true, rest);
	}
}

function updateMoveButtonString()
{
	switch(player_move.movementType)
	{
		case global_consts.MOVE_ANALOG_0:
			moveButtonString = "<Analog> Accelerometer Arrows";
			break;
		case global_consts.MOVE_ACC_0:
			moveButtonString = "Analog <Accelerometer> Arrows";
			break;
		case global_consts.MOVE_ARROWS_0:
			moveButtonString = "Analog Accelerometer <Arrows>";
			break;
	}
}
*/