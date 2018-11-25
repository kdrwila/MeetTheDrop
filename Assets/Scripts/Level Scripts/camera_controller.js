#pragma strict

public var cameraStop			: boolean = false;

private var foundDiff			: boolean;
private var diff				: float;
private var skyboxDiff			: float;
private var player				: GameObject;
private var posDiff				: float;

function Update () 
{
	if(cameraStop == true)		return;
		
	if(!foundDiff)
	{
		player = GameObject.Find("player");
		if(player != null)
		{
			diff = player.transform.position.y - this.transform.position.y;
			skyboxDiff = this.transform.position.y - global_vars.skybox.transform.position.y;
			foundDiff = true;
		}
		else return;
	}
	
	posDiff = player.transform.position.y - diff;
		
	if(this.transform.position.y > posDiff)
	{
		setCameraYPos(posDiff);
	}
	else if(this.transform.position.y + 160 < posDiff)
	{
		global_vars.player.GetComponent(player_behaviour).playerDeath(Random.Range(0, global_consts.PLAYER_DEATH_COUNT));
	}
	else
	{
		translateCamera(Vector3(0.0, (-20.0 - (Time.timeSinceLevelLoad * 0.1)) * Time.deltaTime, 0.0));
	}
}

function translateCamera(pos : Vector3)
{
	this.transform.Translate(pos);
	updateCameraDependingScenery();
}

function setCameraYPos(y : float)
{
	this.transform.position.y = y;
	updateCameraDependingScenery();
}

function moveCamera(y : float)
{
	this.transform.position.y += y;
	updateCameraDependingScenery();
}

function updateCameraDependingScenery()
{
	global_vars.skybox.transform.position.y = this.transform.position.y - skyboxDiff;
}