#pragma strict

public var lastPickup			: GameObject;
public var pref_BonusText		: GameObject;
public var pref_SmokeExpl		: GameObject;
public var pref_shield			: GameObject;
public var pickupSound			: AudioSource;
public var elevatorSound		: AudioSource[]	= new AudioSource[2];
public var lastVelocity			: Vector3;
public var skybox				: Texture[]		= new Texture[3];
public var sceneryTxt			: Texture[]		= new Texture[2];
public var doublePointsTime		: float;

private var playerState			: int;
private var lastScore			: int;
private var playerElevatorStop	: float;
private var sCtrl				: scenery_controller;
private var mFuncs				: movement_functions;

function Awake()
{
	playerState		= global_consts.PLAYER_STATE_MOVING;
	sCtrl			= Camera.main.GetComponent(scenery_controller);
	mFuncs			= GetComponent(movement_functions);
	
	//Crates empty object with sound effect and connecting its audio component to variable
	pickupSound		= Instantiate(pickupSound);
	for(var i : int = 0; i < 2; i ++)
	{
		elevatorSound[i] = Instantiate(elevatorSound[i]);
	}
}

function FixedUpdate()
{
	if(global_vars.gameEnd)	return;
	
	if(transform.position.x > 204.4885)			transform.position.x = 204.4885;
	else if(transform.position.x < -197.1344)	transform.position.x = -197.1344;
	
	var score : int = Mathf.RoundToInt((this.transform.position.y > 0 ? this.transform.position.y : -this.transform.position.y)) + 20;
	
	global_vars.playerSettings.mainScore = score;

	if(doublePointsTime > Time.timeSinceLevelLoad)
	{
		global_vars.playerSettings.addScore	+= score - lastScore;
	}
	
	lastScore = score;
	
	if(playerState != global_consts.PLAYER_STATE_USING_ELEVATOR) return;
	
	if(Camera.main.GetComponent(camera_controller).cameraStop != false) return;
			
	if(this.transform.position.y > playerElevatorStop)
	{
		this.transform.Translate(0.0, -300.0 * Time.fixedDeltaTime, 0.0, Space.World);
	}
	else
	{
		//this.collider.enabled 		= true;
		this.collider.isTrigger			= false;
		this.rigidbody.constraints 		= RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezePositionZ;
		playerState						= global_consts.PLAYER_STATE_MOVING;
		lastPickup.GetComponent(pickup_vars).elevatorObject.transform.parent
										= null;
		global_vars.playerSettings.penetrating
										= false;				
		this.transform.position.z		-= 11.0;
		global_vars.isElevatorCreated	= false;
		Destroy(lastPickup.GetComponent(pickup_vars).elevatorObject, 5.0);
				
		// Remove particles sooner for nicer effect
		var child 					= lastPickup.GetComponent(pickup_vars).elevatorObject.GetComponentsInChildren(Transform);
		for (var ch : Transform in child) if(ch.tag == "particle")
		{
			ch.particleSystem.Stop(true);
		}
	}
}

function Update() 
{
	if(global_vars.gameEnd)	return;
	
	//Setting correct velocity to variable
	lastVelocity = this.rigidbody.velocity;
	if(playerState == global_consts.PLAYER_STATE_MOVING)
	{
		switch(global_vars.movementType)
		{
			case global_consts.MOVE_ANALOG_0:
				mFuncs.movePlayerWithAnalog();
				break;
			case global_consts.MOVE_ACC_0:
				mFuncs.movePlayerWithAccelerometr();
				break;
		}
	}
}

function OnTriggerEnter(collider : Collider) 
{
	if(collider.tag == "scnry_changer")
	{
		global_vars.skybox.renderer.material.mainTexture	= skybox[global_vars.scenerySet];
		global_vars.passedChanger							= true;
		
		
		var id : int = Mathf.FloorToInt(global_vars.scenerySet * 0.5);

		sCtrl.updateCloudsTextures();
															
		return;
	}
	
	if(global_vars.playerSettings.penetrating == true)
	{
		return;
	}
	
	if(collider.tag == "pickup")
	{
		
		switch(collider.GetComponent(pickup_vars).type)
		{
			case global_consts.PICKUP_EXPLOSIVE:
				global_vars.playerSettings.explosivesCount ++;
				global_vars.playerSettings.overallWeaponsCount ++;
				//Plays pickup sound 
				pickupSound.Play();
				
				if(global_vars.playerSettings.overallWeaponsCount >= 2)
				{
					global_vars.playerSettings.armed = true;
				}
				
				Destroy(collider.gameObject);
				break;
			case global_consts.PICKUP_TELEPORT:
				global_vars.playerSettings.teleportsCount ++;
				global_vars.playerSettings.overallWeaponsCount ++;
				//Plays pickup sound
				pickupSound.Play();
				
				if(global_vars.playerSettings.overallWeaponsCount >= 2)
				{
					global_vars.playerSettings.armed = true;
				}
				
				Destroy(collider.gameObject);
				break;
			case global_consts.PICKUP_ELEVATOR:
			
				this.collider.isTrigger 	= true;
				this.rigidbody.constraints 	= RigidbodyConstraints.FreezeAll;
				this.transform.position.x	= collider.transform.position.x;
				this.transform.position.y	= collider.transform.position.y + 3.6;
				playerState					= global_consts.PLAYER_STATE_USING_ELEVATOR;
				global_vars.playerSettings.penetrating
											= true;
				
				playerElevatorStop			= collider.GetComponent(pickup_vars).elevatorMinY + 3.0;
				
				//Play ding and ride sound
				elevatorSound[0].Play();
				elevatorSound[1].Play();
				
				Camera.main.GetComponent(pickup_funcs).openElevatorDoors(collider.gameObject, true);
				Camera.main.GetComponent(camera_controller).cameraStop = true;
				
				break;
			case global_consts.PICKUP_DOUBLE_POINTS:
				pickupSound.Play();
				doublePointsTime = Time.timeSinceLevelLoad + 10.0;
				Destroy(collider.gameObject);
				break;
			case global_consts.PICKUP_GOD:
				pickupSound.Play();
				Destroy(collider.gameObject);
				
				if(global_vars.playerSettings.godMode == true)
				{
					this.GetComponent(god_mode).extendGodTime();
					break;
				}
				
				var comp : god_mode = this.gameObject.AddComponent(god_mode);
				
				comp.pref_shield = pref_shield;
				break;
			case global_consts.PICKUP_GAP:
				global_vars.playerSettings.combo ++;
				
				if(global_vars.playerSettings.combo > 1)
				{
					var text : GameObject 				= Instantiate(pref_BonusText, this.transform.position, pref_BonusText.transform.rotation);
					text.transform.position.y 			+= 25.0;
					text.renderer.material.color 		= Color(1, 0.53, 0);
					text.GetComponent(TextMesh).text 	= "+" + (50 * (global_vars.playerSettings.combo - 1));
					Destroy(text, 1.0);
					
					var smoke : GameObject 				= Instantiate(pref_SmokeExpl, text.transform.position, pref_SmokeExpl.transform.rotation);
					smoke.transform.position.x 			+= 20;
					smoke.transform.position.y 			-= 10;
					smoke.transform.position.z 			+= 5;
					Destroy(smoke, 1.0);
					
					global_vars.playerSettings.addScore += 50 * (global_vars.playerSettings.combo - 1);
				}
				
				collider.transform.position = Vector3(1000.0, 1000.0, 1000.0);
				collider.gameObject.SetActive(false);
				break;
		}
		
		//saves last entered pickup to variable
		lastPickup = collider.gameObject;
		return;
	}
	if(collider.tag == "trap")
	{
		if(global_vars.playerSettings.godMode != false) return;
		
		switch(collider.GetComponent(enemy_vars).trapType)
		{
			case global_consts.TRAP_SPIKES:
				this.GetComponent(player_behaviour).playerDeath(Random.Range(0, global_consts.PLAYER_DEATH_COUNT));
				break;
			case global_consts.TRAP_LASER:
				this.GetComponent(player_behaviour).playerDeath(Random.Range(0, global_consts.PLAYER_DEATH_COUNT));
				break;
		}
	}
}

function changePlayerState(state : int)
{
	playerState	= state;
}

function getPlayerState() : int
{
	return playerState;
}