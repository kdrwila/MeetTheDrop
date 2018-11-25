#pragma strict

/* Private vars */
private var nextX				: float;
private var moveSpeed			: float;

private var deathPos			: Vector2;

private var rotRest				: Vector3;
private var posRest				: Vector3;

private var angelMove			: boolean;
private var direction			: boolean;
private var onGround			: boolean;

private var wings				: GameObject;

private var sFuncs				: script_funcs;

private var playerFadingStage	: int = global_consts.PLAYER_STATE_NOT_FADING;
/* Public vars */
public var planePrefab			: GameObject;
public var sparksPrefab			: GameObject;
public var starExplosionPrefab	: GameObject;

public var playerAddMaterial	: Material;

public var gameOverSound		: AudioSource;
public var teleportSound		: AudioSource;
public var fallingSound			: AudioSource;

public var wingsTexture			: Texture2D;
public var deathTexutres		: Texture2D[]	= new Texture2D[2];
/* Variables end */

function Start () 
{
	sFuncs 			= script_funcs();
	//Initializing sounds
	gameOverSound	= Instantiate(gameOverSound);
	teleportSound	= Instantiate(teleportSound);
	fallingSound	= Instantiate(fallingSound);
}

function FixedUpdate () 
{
	playerSound();
	if(angelMove)
	{
		movePlayerLikeAngel();
		
		sFuncs.playAnimation(wings, 4, 4, 0, 0, 4, 12);
	}
	if(rotRest != 0)
	{
		loopTheLoop();
	}
	if(posRest != Vector3.zero)
	{
		movePlayer();
		
		if(posRest == Vector3.zero) /* If reached its destination */
		{
			if(GetComponent(player_move).getPlayerState() == global_consts.PLAYER_STATE_USING_ELEVATOR)
			{
				Camera.main.GetComponent(camera_controller).cameraStop = false;
				
				var eTransform : Transform	= GetComponent(player_move).lastPickup.GetComponent(pickup_vars).elevatorObject.transform;
				eTransform.parent 			= this.transform;
				
				var sparks : GameObject	= Instantiate(sparksPrefab, Vector3(eTransform.position.x - 15.0, eTransform.position.y + 29.0, eTransform.position.z - 8.3), sparksPrefab.transform.rotation);
				sparks.transform.parent = eTransform;
				sparks					= Instantiate(sparksPrefab, Vector3(eTransform.position.x + 45.5, eTransform.position.y + 29.0, eTransform.position.z - 8.3), sparksPrefab.transform.rotation);
				sparks.transform.parent = eTransform;
			}
			else if(GetComponent(player_move).getPlayerState() == global_consts.PLAYER_STATE_USING_TELEPORT)
			{
				/* Removing freeze, enabling collider and fading player in */
				this.rigidbody.constraints 	= RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezePositionZ;
				this.collider.isTrigger		= false;
				global_vars.playerSettings.penetrating
											= false;
				this.GetComponent(player_behaviour).initPlayerFading(false);
				
				/* Searching for teleport effect and destroing it, we don't need it no more */
				for (var child : Transform in this.transform) if(child.name == "teleport_effect")
				{
				    Destroy(child.gameObject);
				}
				
				GetComponent(player_move).changePlayerState(global_consts.PLAYER_STATE_MOVING);
				
				// Try to figure out if player can stuck by teleporting into ground
				var glist : Collider[]		= Physics.OverlapSphere(this.transform.position, 30.0);
	
				for(var g_id : Collider in glist) if((this.transform.position.y < g_id.transform.position.y + 20.0 && this.transform.position.y > g_id.transform.position.y - 20.0) 
														&& g_id.tag == "ground")
				{
					// If it is possible then we must prevent it by changing height of the player
					if(this.transform.position.y <= g_id.transform.position.y)
					{
						this.transform.position.y = g_id.transform.position.y - 20.0;
					}
					else
					{
						this.transform.position.y = g_id.transform.position.y + 20.0;
					}
				}
				
				// Plays teleport sound effect
				teleportSound.Play(); 
				
				/* Creating stars particles and destroing after 2 seconds */
				var stars	: GameObject	= Instantiate(starExplosionPrefab, global_vars.player.transform.position, starExplosionPrefab.transform.rotation);
				Destroy(stars, 2.0);
			}
		}
	}
	if(global_vars.gameEnd == true)
	{
		if(this.transform.position.y + 200.0 < Camera.main.transform.position.y)
		{
			this.rigidbody.constraints = RigidbodyConstraints.FreezeAll;
		}
	}
	playerFade();
}

function OnCollisionExit(collisionInfo : Collision)
{
	for(var c : ContactPoint in collisionInfo.contacts)
	{
		if(c.otherCollider.tag == "ground")
		{
			onGround = false;
			break;
		}
	}
}

function OnCollisionEnter(collisionInfo : Collision)
{
	for(var c : ContactPoint in collisionInfo.contacts)
	{
		if(c.otherCollider.tag == "ground")
		{
			onGround = true;
			global_vars.playerSettings.combo = 0;
			break;
		}
	}
}

function playerDeath(result : int)
{	
	Camera.main.GetComponent(camera_controller).cameraStop 	= true;
	switch(result)
	{
		case global_consts.PLAYER_DEATH_ANGEL:
			this.rigidbody.useGravity 			= false;
			Destroy(this.collider);
			this.renderer.material.shader		= Shader.Find("Transparent/Diffuse");
			this.renderer.material.mainTexture	= deathTexutres[Random.Range(0, deathTexutres.length)];
			this.renderer.material.color.a 		= 0.45;
			this.rigidbody.constraints 			= RigidbodyConstraints.FreezeAll;
			
			direction 	= false;
			nextX		= Random.Range(5.0, 10.0);
			angelMove	= true;
			deathPos.x	= this.transform.position.x;
			deathPos.y	= this.transform.position.y;
			
			wings = Instantiate(planePrefab, this.transform.position, planePrefab.transform.rotation);
			wings.renderer.material				= playerAddMaterial;
			wings.renderer.material.mainTexture	= wingsTexture;
			wings.transform.parent				= this.transform;
			wings.transform.localScale			= Vector3(0.1, 0.01, 0.05);
			Destroy(wings.collider);
			
			
			break;
		case global_consts.PLAYER_DEATH_BOUNCE:
		
			Destroy(this.collider);
			this.renderer.material.shader		= Shader.Find("Transparent/Diffuse");
			this.renderer.material.mainTexture	= deathTexutres[Random.Range(0, deathTexutres.length)];
			this.renderer.material.color.a 		= 0.52;
			
			this.rigidbody.AddForce(Vector3.up * 25000.0);
		
			break;
	}
	
	//Plays game over sound
	gameOverSound.Play();
	global_vars.gameEnd = true;
	
	var score : int 	= global_vars.playerSettings.mainScore + global_vars.playerSettings.addScore;
	var found : boolean	= false;
	
	for(var i : int = 0; i < 100; i ++)
	{
		if(score > global_vars.highScore[i])
		{
			global_vars.playerPlace	= i;
			found					= true;
			break;
		}
	}
	
	if(!found) return;
	
	for(i = 99; i > global_vars.playerPlace; i --)
	{
		global_vars.highScore[i] 		= global_vars.highScore[i - 1];
		global_vars.highScoreName[i]	= global_vars.highScoreName[i - 1];
	}
		
	global_vars.highScore[global_vars.playerPlace]		= score;
	global_vars.highScoreName[global_vars.playerPlace]	= player_settings.playerName;
	global_vars.lastPlace								= global_vars.playerPlace;
	
	//Debug.Log("UID: " + global_vars.uID);
	
	var form = new WWWForm();
	form.AddField("uid", global_vars.uID);
	form.AddField("nick", player_settings.playerName);
	form.AddField("score", score);

	var www : WWW = new WWW("http://karus.server-pps.com/drop_stats.php?mode=write", form.data);
	yield www;
}

function movePlayerLikeAngel()
{
	this.transform.Translate(0.0, 20.0 * Time.fixedDeltaTime, 0.0, Space.World);
	
	if(!direction)
	{
		var newX : float = deathPos.x + nextX;
		if(this.transform.position.x < newX)
		{
			var diff : float = Mathf.Abs(this.transform.position.x - newX);
			if(diff < nextX)
			{
				if(diff < 1.0)	this.transform.Translate(1.0 * Time.fixedDeltaTime, 0.0, 0.0, Space.World);
				else			this.transform.Translate(diff * Time.fixedDeltaTime, 0.0, 0.0, Space.World);
			}
			else
			{
				diff = nextX - Mathf.Abs(this.transform.position.x - deathPos.x);
				if(diff < 1.0)	this.transform.Translate(1.0 * Time.fixedDeltaTime, 0.0, 0.0, Space.World);
				else			this.transform.Translate(diff * Time.fixedDeltaTime, 0.0, 0.0, Space.World);
			}
		}
		else
		{
			direction 	= true;
			nextX		= Random.Range(5.0, 10.0);
		}
	}
	else
	{
		newX = deathPos.x - nextX;
		if(this.transform.position.x > newX)
		{
			diff = Mathf.Abs(this.transform.position.x - newX);
			if(diff < nextX)
			{
				if(diff < 1.0)	this.transform.Translate(-1.0 * Time.fixedDeltaTime, 0.0, 0.0, Space.World);
				else			this.transform.Translate(-diff * Time.fixedDeltaTime, 0.0, 0.0, Space.World);
			}
			else
			{
				diff = nextX - Mathf.Abs(this.transform.position.x - deathPos.x);
				if(diff < 1.0)	this.transform.Translate(-1.0 * Time.fixedDeltaTime, 0.0, 0.0, Space.World);
				else			this.transform.Translate(-diff * Time.fixedDeltaTime, 0.0, 0.0, Space.World);
			}
		}
		else
		{
			direction 	= false;
			nextX		= Random.Range(5.0, 10.0);
		}
	}
}

function initLoop(angles : Vector3)
{
	rotRest = angles;
}

function loopTheLoop()
{
	var toRotate 	: Vector3	= rotRest;
	var nextRot		: float		= 350.0 * Time.deltaTime;
	
	if(toRotate.x > nextRot)
	{
		toRotate.x 	= nextRot;
		rotRest.x	-= nextRot;
	}
	else rotRest.x = 0.0;
	if(toRotate.y > nextRot)
	{
		toRotate.y 	= nextRot;
		rotRest.y	-= nextRot;
	}
	else rotRest.y = 0.0;
	if(toRotate.z > nextRot)
	{
		toRotate.z 	= nextRot;
		rotRest.z	-= nextRot;
	}
	else rotRest.z = 0.0;
	
	this.transform.Rotate(toRotate, Space.World);
}

function initMove(dist : Vector3, speed : float)
{
	posRest 	= dist;
	moveSpeed	= speed;
}

function movePlayer()
{
	var toMove 		: Vector3	= posRest;
	var nextPos		: float		= moveSpeed * Time.deltaTime;
	
	if(Mathf.Abs(toMove.x) > nextPos)
	{
		if(toMove.x >= 0)
		{
			toMove.x 	= nextPos;
			posRest.x	-= nextPos;
		}
		else
		{
			toMove.x 	= -nextPos;
			posRest.x	+= nextPos;
		}
	}
	else posRest.x = 0.0;
	if(Mathf.Abs(toMove.y) > nextPos)
	{
		if(toMove.y >= 0)
		{
			toMove.y 	= nextPos;
			posRest.y	-= nextPos;
		}
		else
		{
			toMove.y 	= -nextPos;
			posRest.y	+= nextPos;
		}
	}
	else posRest.y = 0.0;
	if(Mathf.Abs(toMove.z) > nextPos)
	{
		if(toMove.z >= 0)
		{
			toMove.z 	= nextPos;
			posRest.z	-= nextPos;
		}
		else
		{
			toMove.z 	= -nextPos;
			posRest.z	+= nextPos;
		}
	}
	else posRest.z = 0.0;
	
	this.transform.Translate(toMove, Space.World);
}

/* Initializing what type of fading will be performed next */
function initPlayerFading(out_in : boolean)
{
	if(out_in)
	{
		/* Fading out or ... */
		playerFadingStage = global_consts.PLAYER_STATE_FADE_OUT; 
		this.renderer.material.shader		= Shader.Find("Transparent/Diffuse");
	}
	else
	{
		/* ... fading in     */
		playerFadingStage = global_consts.PLAYER_STATE_FADE_IN; 
	} 
}

/* Function to controll player fading */
function playerFade()
{
	/* If fading out then make more transparent and if to many change state to not fading */
	if(playerFadingStage == global_consts.PLAYER_STATE_FADE_OUT)
	{	
		this.renderer.material.color.a -= 3 * Time.fixedDeltaTime;
		if(global_vars.player.renderer.material.color.a <= 0.45)
		{
			this.renderer.material.color.a = 0.45; /* Setting correct value to make sure it is there */
			playerFadingStage = global_consts.PLAYER_STATE_NOT_FADING;
		}
	}/* If fading in then make less transparent and if to many change state to not fading */
	else if(playerFadingStage == global_consts.PLAYER_STATE_FADE_IN)
	{
		this.renderer.material.color.a += 3 * Time.fixedDeltaTime;
		if(global_vars.player.renderer.material.color.a >= 1.0)
		{
			this.renderer.material.color.a = 1.0; /* Setting correct value to make sure it is there */
			playerFadingStage = global_consts.PLAYER_STATE_NOT_FADING;
			this.renderer.material.shader		= Shader.Find("Mobile/Diffuse");
		}
	}
}

/* Function to play player rolling speed depending on how fast it's rolling */
function playerSound()
{
	//If velocity is not equal 0.0 then
	if((this.rigidbody.velocity.x >= 1.0 || this.rigidbody.velocity.x <= -1.0) && onGround == true)
	{
		//check for audio is playing, if no play it.
		if(!this.audio.isPlaying)
		{
			this.audio.Play();
		}
		this.audio.pitch	= 1 * ((GetComponent(player_move).lastVelocity.x * 0.005 > 0) ? (GetComponent(player_move).lastVelocity.x * 0.005) : -(GetComponent(player_move).lastVelocity.x * 0.005));
		return;
	}
	else
	{
		//if audio is still playing stop it
		if(this.audio.isPlaying)
		{
			this.audio.Stop();
		}
		return;
	}
	
	//If velocity is not equal 0.0 then
	if((this.rigidbody.velocity.y >= 1.0 || this.rigidbody.velocity.y <= -1.0) && onGround == false)
	{
		//check for audio is playing, if no play it.
		if(!fallingSound.isPlaying)
		{
			fallingSound.Play();
		}
		fallingSound.pitch	= 0.4 * ((this.rigidbody.velocity.y * 0.005 > 0) ? (this.rigidbody.velocity.y * 0.005) : -(this.rigidbody.velocity.y * 0.005));
		return;
	}
	else
	{
		//if audio is still playing stop it
		if(fallingSound.isPlaying)
		{
			fallingSound.Stop();
		}
		return;
	}
}