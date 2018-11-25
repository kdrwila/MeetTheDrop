#pragma strict

public var prefabSprite				: GameObject;

public var spriteCloud				: Sprite[]		= new Sprite[9];
public var spriteScenery			: Sprite[]		= new Sprite[18];

private var clouds					: GameObject[]	= new GameObject[16];
private var cloudSpeed				: float[]		= new float[16];
private var cloudSide				: int[]			= new int[16];
private var farZ					: float[]		= new float[16];
private var nextCloudUpdate			: float;

private var cloudUniqueId			: int;
private var uniqueSceneryId			: int;
private var lastSceneryChanged		: float;

private var frameSkip				: int;
private var frameSkip2				: int;

private var scenerySetS				: Vector4[,]	= new Vector4[2, 2];
private var scenerySetB				: Vector4[,]	= new Vector4[3, 3];

function Awake() 
{
	prefabSprite.tag					= "scenery";
	
	for(var i : int = 0; i < 16; i ++)
	{
		cloudSpeed[i]					= 0.0;
		cloudSide[i]					= 0;
		
		clouds[i] 						= Instantiate(prefabSprite, Vector3(9999.0, 9999.0, 9999.0), prefabSprite.transform.rotation);
		clouds[i].GetComponent(SpriteRenderer).sprite
										= spriteCloud[Random.Range(0, 3) + (3 * global_vars.scenerySet)];
		clouds[i].transform.localScale	= Vector3(64.0, 64.0, 0.0);
		clouds[i].SetActive(false);
		clouds[i].name					= "cloud_" + i;
		
		clouds[i].AddComponent(cloud_destroy_script);
		clouds[i].GetComponent(cloud_destroy_script).id
										= i;
	}
	
	scenerySetS[0, 0]		= Vector4(0.0, -0.12, -0.2, 0.6);
	scenerySetS[0, 1]		= Vector4(0.0, 0.12, -0.2, 0.6);
	
	scenerySetS[1, 0]		= Vector4(0.0, -0.16, -0.2, 0.6);
	scenerySetS[1, 1]		= Vector4(2.0, 0.05, -0.2, 0.6);
	
	scenerySetB[0, 0]		= Vector4(0.0, -0.15, -0.2, 0.6);
	scenerySetB[0, 1]		= Vector4(1.0, 0.05, -0.2, 1.0);
	scenerySetB[0, 2]		= Vector4(-1.0, 0.0, 0.0, 0.0);
	
	scenerySetB[1, 0]		= Vector4(1.0, -0.08, -0.2, 1.0);
	scenerySetB[1, 1]		= Vector4(2.0, 0.12, -0.2, 0.6);
	scenerySetB[1, 2]		= Vector4(-1.0, 0.0, 0.0, 0.0);
	
	scenerySetB[2, 0]		= Vector4(0.0, 0.17, -0.2, 0.6);
	scenerySetB[2, 1]		= Vector4(0.0, -0.16, -0.2, 0.6);
	scenerySetB[2, 2]		= Vector4(2.0, 0.0, -0.2, 0.6);
	
	nextCloudUpdate = 0.0;
}

function FixedUpdate () 
{
	if(global_vars.gameEnd == true)	return;
	
	frameSkip ++;
	frameSkip2 ++;
	if(frameSkip != 2) 				return;
	
	for(var i : int = 0; i < 16; i ++) if(clouds[i].activeInHierarchy == true)
	{
		if(clouds[i].transform.position.x > 340.0 + (farZ[i] * 4) || clouds[i].transform.position.x < - 340.0 - (farZ[i] * 4))
		{
			destroyCloud(i);
			continue;
		}
		
		clouds[i].transform.Translate(-20 * cloudSpeed[i] * Time.fixedDeltaTime * frameSkip, 0.0, 0.0);
	}
	
	frameSkip = 0;
	
	if(frameSkip2 != 6) 				return;
	
	if(this.transform.position.y % 3000 > -100)
	{
		if(lastSceneryChanged - 100 > this.transform.position.y)
		{
			var newSet	: int;
			do
			{
				newSet = Random.Range(0, 3);
			}
			while(newSet == global_vars.scenerySet);
			
			global_vars.lastScenerySet	= global_vars.scenerySet;
			global_vars.scenerySet		= newSet;
			global_vars.passedChanger	= false;
			lastSceneryChanged			= this.transform.position.y;
			endless_vars.firstNewScnry	= true;
		}
	}
	
	if(nextCloudUpdate < Time.timeSinceLevelLoad) createCloud();
	
	frameSkip2 = 0;
}

function createCloud()
{
	for(var i = 0; i < 16; i ++) if(clouds[i].activeInHierarchy == false)
	{
		
		cloudSide[i]							= Random.Range(0, 2);
		cloudSpeed[i] 							= Random.Range(0.5, 2.0);
		farZ[i]								= Random.Range(40.0, 150.0);
		
		if(cloudSide[i] == global_consts.CLOUD_SIDE_RIGHT)
		{
			clouds[i].transform.position 		= Vector3(40.0 + (farZ[i]), this.transform.position.y - 160 - farZ[i], farZ[i]);
			clouds[i].transform.eulerAngles.y	= 0.0;
		}
		else
		{
			clouds[i].transform.position		= Vector3(-80.0 - (farZ[i]), this.transform.position.y - 160 - farZ[i], farZ[i]);
			clouds[i].transform.eulerAngles.y	= 180.0;
		}
		
		clouds[i].SetActive(true);
		nextCloudUpdate 						= Time.timeSinceLevelLoad + Random.Range(0.25, 1.5);
		
		clouds[i].GetComponent(SpriteRenderer).sprite
												= spriteCloud[Random.Range(0, 3) + (3 * global_vars.scenerySet)];
		break;
	}
}

function createGroundRandomDecoration(ground : GameObject, pos : Vector3, size : float, amount : int, recreate : boolean)
{

	var rSize	: float	= ground.transform.localScale.x / 2.5;
	var rand	: int;
	var sAdd	: GameObject;
	
	if(rSize <= 200.0)
	{
		rand = Random.Range(0, 2);
		for(var i : int = 0; i < 2; i ++)
		{
			sAdd							= Instantiate(prefabSprite, transform.position, prefabSprite.transform.rotation);
			sAdd.transform.parent			= ground.transform;
			sAdd.transform.localPosition.x	= scenerySetS[rand, i].y;
			sAdd.transform.localPosition.y	= scenerySetS[rand, i].z;
			sAdd.transform.localPosition.z	= scenerySetS[rand, i].w;
			sAdd.GetComponent(SpriteRenderer).sprite
											= spriteScenery[Random.Range(1, 3) + (6 * global_vars.scenerySet)];
		}
	}
	else
	{
		rand = Random.Range(0, 3);
		for(i = 0; i < 3; i ++) if(scenerySetB[rand, i].x != -1.0)
		{
			sAdd							= Instantiate(prefabSprite, transform.position, prefabSprite.transform.rotation);
			sAdd.transform.parent			= ground.transform;
			sAdd.transform.localPosition.x	= scenerySetB[rand, i].y;
			sAdd.transform.localPosition.y	= scenerySetB[rand, i].z;
			sAdd.transform.localPosition.z	= scenerySetB[rand, i].w;						
			if(scenerySetB[rand, i].w == 1.0)
			{
				sAdd.GetComponent(SpriteRenderer).sprite
											= spriteScenery[0 + (6 * global_vars.scenerySet)];
			}
			else
			{
				sAdd.GetComponent(SpriteRenderer).sprite
											= spriteScenery[Random.Range(1, 3) + (6 * global_vars.scenerySet)];
			}
		}
	}
}

function updateCloudsTextures()
{
	for(var i : int = 0; i < 16; i ++)
	{
		clouds[i].GetComponent(SpriteRenderer).sprite = spriteCloud[Random.Range(0, 3) + (3 * global_vars.scenerySet)];
	}
}

function destroyCloud(id : int)
{
	clouds[id].transform.position	= Vector3(9999.0, 9999.0, 9999.0);
	clouds[id].SetActive(false);
}