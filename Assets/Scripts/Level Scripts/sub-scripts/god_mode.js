#pragma strict

public var pref_shield	: GameObject;

private var endTime		: float;
private var shield		: GameObject;

function Start () 
{
	endTime 				= Time.timeSinceLevelLoad + 15.0;
	shield					= Instantiate(pref_shield, this.transform.position, pref_shield.transform.rotation);
	shield.transform.parent	= this.transform;
	shield.name				= "god_mode_shield";
	
	global_vars.playerSettings.godMode = true;
}

function FixedUpdate () 
{
	shield.transform.localEulerAngles.y += 60.0 * Time.fixedDeltaTime;
	
	if(endTime < Time.timeSinceLevelLoad)
	{
		Destroy(this);
	}
}

function OnDestroy ()
{
	Destroy(shield);
	global_vars.playerSettings.godMode = false;
}

function extendGodTime()
{
	endTime = Time.timeSinceLevelLoad + 15.0;
}