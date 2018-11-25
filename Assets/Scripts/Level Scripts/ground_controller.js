#pragma strict

public var groundPrefab 		: GameObject;
public var groundTextures		: Texture2D[]	= new Texture2D[3];
public var groundBrickTxt		: Texture;
public var explosionPrefab		: GameObject;
public var dGroundPrefab		: GameObject;
public var smokePrefab			: GameObject;
public var groundBitsPrefab		: GameObject;
public var groundCornerPrefab	: GameObject;
public var planePrefab			: GameObject;
public var darkGroundMaterial	: Material;
public var explosionSound		: AudioSource;

private var lastExplosion	: float;
private var frameSkip		: int				= -1;


function Awake()
{
	//Initializing sounds
	explosionSound	= Instantiate(explosionSound);
}

function FixedUpdate () 
{
	frameSkip ++;
	if(frameSkip != 15) return;
	
	if(global_vars.player.transform.position.y - 200 < endless_vars.lastEndlessY)
	{
		GetComponent(endless_funcs).createEndlesPlatform(4, endless_vars.lastEndlessY);
	}
	
	frameSkip = 0;
}

private var halfSize	: float;
private var ground		: GameObject;
private var corners		: GameObject[]	= new GameObject[2];

function createGround(pos : Vector3, size : float, lD : boolean, rD : boolean, sAdd : boolean, recreate : boolean) : GameObject
{
	if((lD && rD) && size < 0.0)					return null;
	if(((lD && !rD) || (!lD && rD)) && size < 10.0)	return null;
	if((!lD && !rD) && size < 20.0)					return null;
	
	halfSize	= size * 0.5;
	ground 		= Instantiate(groundPrefab, pos, groundPrefab.transform.rotation);
	
	corners[0] = null;
	corners[1] = null;
	
	if(!rD)
	{
		corners[0] = Instantiate(groundCornerPrefab, Vector3(pos.x + (halfSize - 5.0), pos.y, pos.z), groundCornerPrefab.transform.rotation);
		corners[0].GetComponent(ground_vars).isOnCorner
													= true;
		corners[0].renderer.material.mainTexture	= groundTextures[global_vars.scenerySet];
						
		size -= 10.0;
	}
	if(!lD)
	{
		corners[1] = Instantiate(groundCornerPrefab, Vector3(pos.x - (halfSize - 5.0), pos.y, pos.z), groundCornerPrefab.transform.rotation);
		corners[1].transform.Rotate(0.0, 180.0, 0.0, Space.World);
		corners[1].GetComponent(ground_vars).isOnCorner 	
													= true;
		corners[1].renderer.material.mainTexture	= groundTextures[global_vars.scenerySet];
		
		size -= 10.0;
	}
	
	if(!rD && lD)		ground.transform.position.x -= 5.0;
	else if(rD && !lD)	ground.transform.position.x	+= 5.0;
	ground.transform.localScale.x					= size * 2.5;
	
	if(Random.Range(0, 15) == 0 && !recreate)
	{
		ground.renderer.material.mainTexture		= groundBrickTxt;
		if(corners[0] != null)	corners[0].renderer.material.mainTexture	
													= groundBrickTxt;
		if(corners[1] != null)	corners[1].renderer.material.mainTexture	
													= groundBrickTxt;
		ground.GetComponent(ground_vars).brick		= true;
		
		// Little darker if scenery is dark
		if(global_vars.scenerySet == 2)
		{
			ground.renderer.material.color			= Color(0.35, 0.35, 0.35);
			
			if(corners[0] != null)
			{
				corners[0].renderer.material.color			= Color(0.35, 0.35, 0.35);
			}
			if(corners[1] != null)
			{
				corners[1].renderer.material.color			= Color(0.35, 0.35, 0.35);
			}
		}
	}
	else
	{
		ground.renderer.material.mainTexture		= groundTextures[global_vars.scenerySet];
	}
	ground.renderer.material.mainTextureScale.x		= size * 0.1;
	
	if(corners[0] != null)
	{
		corners[0].transform.parent					= ground.transform;
		ground.GetComponent(ground_vars).corners[0]	= corners[0];
	}
	if(corners[1] != null)
	{
		corners[1].transform.parent					= ground.transform;
		ground.GetComponent(ground_vars).corners[1]	= corners[1];
	}
	
	if(sAdd)
	{
		GetComponent(scenery_controller).createGroundRandomDecoration(ground, ground.transform.position, size, Random.Range(3, 9), recreate);
	}
	
	
	return ground;
}

function createGround(pos : Vector3, size : float, lD : boolean, rD : boolean) : GameObject
{
	return createGround(pos, size, lD, rD, true, false);
}

private var gVars	: ground_vars;

function createGround(pos : Vector3, size : float, lD : boolean, rD : boolean, sAdd : boolean, recreate : boolean, chckTxt : boolean) : GameObject
{
	ground = createGround(pos, size, lD, rD, sAdd, recreate);
	
	if(chckTxt)
	{
		gVars = ground.GetComponent(ground_vars);
		
		if(global_vars.passedChanger)
		{
			ground.renderer.material.mainTexture = groundTextures[global_vars.scenerySet];
			if(gVars.corners[0] != null) gVars.corners[0].renderer.material.mainTexture	= groundTextures[global_vars.scenerySet];
			if(gVars.corners[1] != null) gVars.corners[1].renderer.material.mainTexture	= groundTextures[global_vars.scenerySet];
		}
		else
		{
			ground.renderer.material.mainTexture = groundTextures[global_vars.lastScenerySet];
			if(gVars.corners[0] != null) gVars.corners[0].renderer.material.mainTexture	= groundTextures[global_vars.lastScenerySet];
			if(gVars.corners[1] != null) gVars.corners[1].renderer.material.mainTexture	= groundTextures[global_vars.lastScenerySet];
		}
	}
	
	return ground;
}

private var glist		: Collider[];
private var halfScale	: float;
private var gpos		: Vector3;
private var corner		: float[]	= new float[2];
private var leftScale	: float;
private var rightScale	: float;
private var dist		: float;
private var size		: float;
private var offset 		: float;
private var groundL		: GameObject;
private var groundR		: GameObject;
private var dGround		: GameObject;
private var smoke		: GameObject;
private var gBits		: GameObject;
private var back		: GameObject;
private var groundMask 	: LayerMask	= 1 << 8;

function createExplosion(pos : Vector3, radius : float, force : float)
{
	if(!global_vars.playerSettings.explosivesCount)									return;
	if(lastExplosion + global_consts.EXPLOSION_TIMEOUT > Time.timeSinceLevelLoad)	return;
	
	lastExplosion = Time.timeSinceLevelLoad;
	global_vars.playerSettings.explosivesCount --;
	global_vars.playerSettings.overallWeaponsCount --;
	
	Destroy(Instantiate(explosionPrefab, pos + (Vector3.forward * 5), explosionPrefab.transform.rotation), 1.0);
	
	//Playing blast and explosion sounds
	explosionSound.Play();
	
	
	
	glist	= Physics.OverlapSphere(pos, radius, groundMask);
	
	for(var g_id : Collider in glist) if(g_id.transform.position.y < pos.y)
	{
		gVars = g_id.GetComponent(ground_vars);
		
		if(gVars.isOnCorner	== true)	continue;
		if(gVars.brick		== true)	continue;
		
		halfScale	= g_id.gameObject.transform.localScale.x * 0.2;
		gpos		= g_id.gameObject.transform.position;
				
		corner[0] 	= gpos.x - halfScale;
		corner[1] 	= gpos.x + halfScale;
		groundL		= null;
		groundR		= null;
		
		if(pos.x > corner[1] + 10.0 || pos.x < corner[0] - 10.0) return;
				
		leftScale = Mathf.Abs(corner[0] - pos.x) - (radius * 0.5);
		rightScale = Mathf.Abs(corner[1] - pos.x) - (radius * 0.5);
		
		if(leftScale > 10.0)
		{
			groundL	= createGround(Vector3(corner[0] + (leftScale * 0.5) - 10.0, gpos.y, gpos.z), leftScale, false, true, false, true, true);
			
			dGround = Instantiate(dGroundPrefab, Vector3(corner[0] + leftScale - 5.2, gpos.y, gpos.z), dGroundPrefab.transform.rotation);
			dGround.transform.Rotate(180.0, 180.0, 0.0);
			dGround.GetComponent(ground_vars).isOnCorner 	= true;
			dGround.GetComponent(ground_vars).groundParent 	= groundL;
			groundL.GetComponent(ground_vars).corners[1] 	= dGround;
			
			if(global_vars.passedChanger)
			{
				dGround.renderer.material.mainTexture	= groundTextures[global_vars.scenerySet];
			}
			else
			{
				dGround.renderer.material.mainTexture	= groundTextures[global_vars.lastScenerySet];
			}
			
			smoke = Instantiate(smokePrefab, Vector3(corner[0] + leftScale + 5.0, gpos.y, gpos.z + 1.0), smokePrefab.transform.rotation);;
			Destroy(smoke, 6.5);
		}
		if(rightScale > 10.0)
		{
			groundR = createGround(Vector3(corner[1] - (rightScale / 2) + 10.0, gpos.y, gpos.z), rightScale, true, false, false, true, true);
						
			dGround = Instantiate(dGroundPrefab, Vector3(corner[1] - rightScale + 5.2, gpos.y, gpos.z), dGroundPrefab.transform.rotation);
			dGround.GetComponent(ground_vars).isOnCorner 	= true;
			dGround.GetComponent(ground_vars).groundParent 	= groundR;
			groundR.GetComponent(ground_vars).corners[1] 	= dGround;
			groundR.GetComponent(ground_vars).gap			= radius;
			
			if(global_vars.passedChanger)
			{
				dGround.renderer.material.mainTexture	= groundTextures[global_vars.scenerySet];
			}
			else
			{
				dGround.renderer.material.mainTexture	= groundTextures[global_vars.lastScenerySet];
			}
			
			smoke = Instantiate(smokePrefab, Vector3(corner[1] - rightScale - 5.0, gpos.y, gpos.z + 1.0), smokePrefab.transform.rotation);
			Destroy(smoke, 6.5);
		}		
		destroyGround(g_id.gameObject, groundL, groundR);
		
		for(var i : float = -1.5; i < 2.0; i += 1.0)
		{
			gBits 	= Instantiate(groundBitsPrefab, Vector3(pos.x - 10.0, pos.y + 5.0, pos.z), groundBitsPrefab.transform.rotation);
			dist	= 6.0 * i;
			
			if(global_vars.passedChanger)
			{
				gBits.renderer.material.mainTexture	= groundTextures[global_vars.scenerySet];
			}
			else
			{
				gBits.renderer.material.mainTexture	= groundTextures[global_vars.lastScenerySet];
			}
			
			gBits.rigidbody.mass 		= Random.Range(0.1, 1.0);
			gBits.rigidbody.drag 		= Random.Range(0.5, 1.5);
			gBits.rigidbody.velocity.x 	= Random.Range(-100.0, 100.0);
			gBits.transform.position.x += dist;
			gBits.transform.position.y -= 30.0 - Mathf.Abs(dist); 
			gBits.transform.position.z = -13.0;
			
			Destroy(gBits, 3);
		}
				
		if(groundL == null)
		{
			offset	= radius * 0.5;
			size	= radius * 0.1;
		}
		else if(groundR == null)
		{
			offset	= -radius * 0.5;
			size	= radius * 0.1;
		}
		
		if(groundL != null && groundR != null)
		{
			offset	= 0.0;
			size	= radius * 0.2;
		}

		back	 					= Instantiate(planePrefab, Vector3(pos.x + offset, gpos.y, -6.0), planePrefab.transform.rotation);
		back.transform.localScale.x	= size;
		back.renderer.material		= darkGroundMaterial;
		if(global_vars.passedChanger)
		{
			back.renderer.material.mainTexture
									= groundTextures[global_vars.scenerySet];
		}
		else
		{
			back.renderer.material.mainTexture
									= groundTextures[global_vars.lastScenerySet];
		}
		back.renderer.material.mainTextureOffset
									= Vector2(0, 0.25);
		back.renderer.material.mainTextureScale
									= Vector2(size, 0.25);
		back.AddComponent(destroy_script);
	}
}

function destroyGround(ground : GameObject)
{
	Destroy(ground);
}

function destroyGround(ground : GameObject, newL : GameObject, newR : GameObject)
{
	if(newL == null && newR == null)
	{
		Destroy(ground);
		return;
	}
	
	var child = ground.GetComponentsInChildren(Transform);
	for (var ch : Transform in child) if(ch.tag == "scenery") 
	{
		if(newL != null)	ch.parent = newL.transform;
		else				ch.parent = newR.transform;
	}
	
	Destroy(ground);
}