#pragma strict

public var trapPrefabs	: GameObject[]	= new GameObject[2];
public var trapPrefabsA	: GameObject[]	= new GameObject[1];

private var laserObject	: GameObject	= null;
private var laserBeam	: GameObject;
private var laserTrip	: int;
private var laserAngle	: float;
private var maxLaserId	: int;
private var maxLaserL	: float;

private var laserLen	: float[]		= new float[181];
private var laserH		: float[]		= new float[181];

// updateLasers() vars
private var eVars		: enemy_vars;
private var llen		: float;
private var pos			: float;


function Start()
{
	maxLaserL = trapPrefabsA[0].transform.localScale.z;
		
	for(var i : int = 0; i < 181; i ++)
	{
		laserLen[i]	= 10 / Mathf.Cos((i - 90) * Mathf.Deg2Rad);
		laserH[i]	= 10 * Mathf.Tan((i - 90) * Mathf.Deg2Rad);
	}
}

function FixedUpdate()
{
	updateLasers();
}

function createTrap(pos : Vector3) : GameObject
{
	var type : int 			= Random.Range(0, trapPrefabs.Length);
	var trap : GameObject 	= Instantiate(trapPrefabs[type], pos, trapPrefabs[type].transform.rotation);
	
	switch(type)
	{
		case global_consts.TRAP_SPIKES:
			trap.transform.position.y -= 0.5;
			trap.transform.position.z += 5.0;

			break;
		case global_consts.TRAP_LASER:
			if(laserObject != null) 
			{
				Destroy(trap);
				return null;
			}
			
			trap.transform.position.y	-= 8.0;
			trap.transform.position.z	= -4.0;

			laserObject		= trap;
			laserBeam		= Instantiate(trapPrefabsA[0], trap.transform.position, trapPrefabsA[0].transform.rotation);
			laserBeam.transform.localScale.z		
							= 0.0;
			laserAngle		= Random.Range(-180.0, 0.0);
			eVars			= trap.GetComponent(enemy_vars);

			break;
	}
	
	// darkrer materials for night scenery
	if(global_vars.scenerySet == 2)
	{
		trap.renderer.material.color			= Color(0.35, 0.35, 0.35);
	}
	
	trap.GetComponent(enemy_vars).trapType = type;
	
	return trap;
}

/* updates lasers beams */
function updateLasers()
{
	if(laserObject == null) return;
	
	if(laserBeam.collider == null)
	{
		destroyLaser();
		return;
	}
		
	if(laserTrip == 0)
	{
		laserAngle += 30 * Time.fixedDeltaTime;
		if(laserAngle >= -5)
		{
			laserAngle	= -6;
			laserTrip	= 1;
		}
	}
	else
	{
		laserAngle -= 30 * Time.fixedDeltaTime;
		if(laserAngle <= -175)
		{
			laserAngle	= -174;
			laserTrip	= 0;
		}
	}
	
	laserBeam.transform.eulerAngles = Vector3(laserAngle, 90.0, 0.0);
	pos = laserObject.transform.position.x - (eVars.gapY * laserH[-laserAngle]);

	if(pos >= eVars.gapSize[0].x && pos <= eVars.gapSize[0].y)
	{
		pos = laserObject.transform.position.x - (eVars.gapY2 * laserH[-laserAngle]);
		
		if(pos >= eVars.gapSize[1].x && pos <= eVars.gapSize[1].y)
		{
			laserBeam.transform.localScale.z		= maxLaserL - 8.0;
			return;
		}
		llen = eVars.gapY2 * laserLen[-laserAngle];

		if(llen < maxLaserL)	laserBeam.transform.localScale.z		= llen;
		else					laserBeam.transform.localScale.z		= maxLaserL;
		return;
	}
	llen = eVars.gapY * laserLen[-laserAngle];

	if(llen < maxLaserL)	laserBeam.transform.localScale.z		= llen;
	else					laserBeam.transform.localScale.z		= maxLaserL;
}

function destroyLaser()
{
	Destroy(laserObject);
	Destroy(laserBeam);
	laserObject = null;
}