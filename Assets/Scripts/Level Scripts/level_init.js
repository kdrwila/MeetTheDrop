#pragma strict

public var playerPrefab 	: GameObject;
public var skyboxPrefab		: GameObject;
public var skyboxTexture	: Texture2D[]	= new Texture2D[3];

function Start ()
{
	Screen.sleepTimeout = SleepTimeout.NeverSleep;
	Time.timeScale 		= 1.0;
	
	if(global_vars.movementType == global_consts.MOVE_ACC_0)
	{
		global_vars.defaultAccPos = Input.acceleration.y;
	}
	
	GetComponent(scenery_controller).createCloud();
		
	createPlayer();
	global_vars.skybox 										= Instantiate(skyboxPrefab, skyboxPrefab.transform.position, skyboxPrefab.transform.rotation);
	global_vars.skybox.renderer.material.mainTexture		= skyboxTexture[global_vars.scenerySet];

	var id : int = Mathf.FloorToInt(global_vars.scenerySet * 0.5);
		
	Camera.main.GetComponent(scenery_controller).updateCloudsTextures();
			
	Camera.main.GetComponent(camera_controller).cameraStop 	= false;
	Physics.gravity 										= Vector3(0.0, -700.0, 0.0);
	Physics.IgnoreLayerCollision(9, 10, true);
	AudioListener.volume									= global_vars.audioMasterVolume;
	
	if(global_vars.audioMuted)	AudioListener.volume		= 0.0;
	else						AudioListener.volume		= global_vars.audioMasterVolume;
	
	GetComponent(endless_funcs).createEndlesPlatform(8, endless_vars.lastEndlessY);
	
	#if UNITY_ANDROID
	
	GameObject.Find("main_camera_0").AddComponent(touch_gui);
	
	#endif

	Destroy(this);
}

function createPlayer()
{
	var player = Instantiate(playerPrefab, Vector3(0.1, -10.1, -8.1), transform.rotation);
		
	player.name = "player";
	
	global_vars.playerSettings				= player.AddComponent(player_settings);
	global_vars.player						= player;
}