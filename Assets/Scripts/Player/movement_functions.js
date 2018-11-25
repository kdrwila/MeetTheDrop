#pragma strict

public static var analogCreated 	: boolean	= false;
public static var analogPos			: Vector2;
public static var analogCurrentPos	: Vector2;
public static var velocityMultipler	: float		= 4.3;
public static var analogTouchId		: int		= -1;

public var teleportSound			: AudioSource;
public var starExplosionPrefab		: GameObject;
public var sparksPrefab				: GameObject;

private var lastTeleport			: float;
private var MAX_SPEED				: float;

function Awake()
{
	analogCreated		= false;
	analogPos			= Vector2(0.0, 0.0);
	analogCurrentPos	= Vector2(0.0, 0.0);
	velocityMultipler	= 4.3;
	analogTouchId		= -1;
	MAX_SPEED			= 64.0 * velocityMultipler;
	
	// Initializing teleport sound effect
	teleportSound		= Instantiate(teleportSound);
}

function movePlayerWithAccelerometr()
{
	var acc : Vector3 = Input.acceleration;
	//var diff : float = global_vars.defaultAccPos - acc.x;
	
	//debug_funcs.gyroDebugLog = "pos: " +  acc;
	
	if(acc.x >= -0.4 && acc.x <= 0.4)
	{
		var v : float = acc.x * 160 * velocityMultipler;
		
		if(v > 122.55) 			v = 122.55;
		else if(v < -122.55)	v = -122.55;
		
		global_vars.player.rigidbody.velocity.x = v;
		correctSpeed();
	}
	else if(acc.x > 0.4)
	{
		global_vars.player.rigidbody.velocity.x += 28.5 * velocityMultipler;
		correctSpeed();
	}
	else if(acc.x < -0.4)
	{
		global_vars.player.rigidbody.velocity.x += -28.5 * velocityMultipler;
		correctSpeed();
	}
	
	
}

function movePlayerWithAnalog()
{
	var pos 	: Vector2;
	var phase 	: TouchPhase;
	var sFuncs 					= script_funcs();
	for(var i = 0; i < Input.touchCount; i ++)
	{
		pos = Input.GetTouch(i).position;
		phase = Input.GetTouch(i).phase;
		if(pos.x < (400 * global_vars.guiScaleV) && pos.y < (260 * global_vars.guiScaleH) && Input.GetTouch(i).phase == TouchPhase.Began && !analogCreated)
		{
			analogCreated 	= true;
			analogPos 		= pos;
			analogTouchId 	= i;
			continue;
		}
		if((phase == TouchPhase.Moved || phase == TouchPhase.Stationary) && analogCreated && analogTouchId == i)
		{
			if(sFuncs.getDistanceBetweenPoints2D(pos, analogPos) > 64)
			{
				var sine = SineEx();
				sine = sFuncs.getSineBetweenPoints2D(pos, analogPos);
				pos = sFuncs.getNearPosFromAngle2D(analogPos, Mathf.Asin(sine.sine), 64, sine.quarter);
			}
			
			var v = (pos.x - analogPos.x) * velocityMultipler;
			
			if(v > 26.875) 			v = 26.875;
			else if(v < -26.875)	v = -26.875;
			
			global_vars.player.rigidbody.velocity.x += v;
			correctSpeed();
			
			analogCurrentPos = pos;
			continue;
		}
		if((phase == TouchPhase.Ended || phase == TouchPhase.Canceled) && analogCreated && analogTouchId == i)
		{
			analogTouchId = -1;
			analogCreated = false;
		}
	}
}

function teleportPlayer()
{
	if(!global_vars.playerSettings.teleportsCount)					return;
	if(lastTeleport + global_consts.TELEPORT_TIMEOUT > Time.timeSinceLevelLoad)	return;
	
	lastTeleport = Time.timeSinceLevelLoad;
	global_vars.playerSettings.teleportsCount --;
	global_vars.playerSettings.overallWeaponsCount --;
	
	/* Change state to prevent moving and return to original state at the end of teleport */
	global_vars.player.GetComponent(player_move).changePlayerState(global_consts.PLAYER_STATE_USING_TELEPORT); 
	/* Fading player out for nice effect */
	global_vars.player.GetComponent(player_behaviour).initPlayerFading(true); 
	
	/* Creating nice teleport efect */
	var sparks	: GameObject	= Instantiate(sparksPrefab, global_vars.player.transform.position, sparksPrefab.transform.rotation);
	sparks.transform.position.y -= 150.0;
	sparks.transform.parent		= global_vars.player.transform;
	sparks.name					= "teleport_effect";
	
	yield WaitForSeconds(0.19);	/* Wait till fading will end */
	
	/* Freeze player and disable its collider */
	global_vars.player.rigidbody.constraints 	= RigidbodyConstraints.FreezeAll; 
	global_vars.player.collider.isTrigger		= false;
	global_vars.playerSettings.penetrating		= true;
	
	// Play teleport sound effect
	teleportSound.Play();
	
	/* Get random y pos and init movement to that pos also create stars and set destroy for 2 seconds */
	var randomY	: float			= Random.Range(-400, -600);
	var stars	: GameObject	= Instantiate(starExplosionPrefab, global_vars.player.transform.position, starExplosionPrefab.transform.rotation);
	
	global_vars.player.GetComponent(player_behaviour).initMove(Vector3(0.0, randomY, 0.0), 400.0);
	Destroy(stars, 2.0);
}

function correctSpeed()
{
	if(global_vars.player.rigidbody.velocity.x > MAX_SPEED)
	{
		global_vars.player.rigidbody.velocity.x	= MAX_SPEED;
	}
	else if(global_vars.player.rigidbody.velocity.x < -MAX_SPEED)
	{
		global_vars.player.rigidbody.velocity.x	= -MAX_SPEED;
	}
}