#pragma strict

public var blankTextureL 			: Texture2D;
public var mainTextStyleL			: GUIStyle;
public var hsTextStyleL				: GUIStyle;
public var buttonStyleL				: GUIStyle[]		= new GUIStyle[5];
public var scaledFontsL				: Font[]			= new Font[5];
public var soundClickL				: AudioSource;

public static var scenerySprites	: Sprite[,]			= new Sprite[3, 6];
public static var cloudSprites		: Sprite[,]			= new Sprite[3, 3];

public static var defaultAccPos 	: float;
public static var guiScaleV			: float;
public static var guiScaleH			: float;
public static var lastEscPress		: float;
public static var audioMasterVolume	: float;

public static var reciprocalScreen	: Vector2;

public static var blankTexture		: Texture;

public static var movementType		: int;
public static var playerPlace		: int;
public static var highScore			: int[]				= new int[100];
public static var lastPlace			: int;
public static var scenerySet		: int;
public static var lastScenerySet	: int;

public static var highScoreName		: String[]			= new String[100];
public static var uID				: String;

public static var playerSettings	: player_settings;

public static var skybox			: GameObject;
public static var player			: GameObject;

public static var gameEnd			: boolean;
public static var loadedScores		: boolean;
public static var loadedOptions		: boolean;
public static var m_highScoreTab	: boolean;
public static var m_settingsTab		: boolean;
public static var passedChanger		: boolean;
public static var audioMuted		: boolean;
public static var paused			: boolean;
public static var isElevatorCreated	: boolean;

public static var mainTextStyle		: GUIStyle;
public static var buttonStyle		: GUIStyle[]		= new GUIStyle[5];
public static var hsTextStyle		: GUIStyle;

public static var scaledFonts		: Font[]			= new Font[5];

public static var soundClick		: AudioSource;
	

function Awake()
{
	defaultAccPos		= 0.0;
	guiScaleV 			= Screen.width / 800.0;
	guiScaleH 			= Screen.height / 480.0;
	lastEscPress		= Time.timeSinceLevelLoad;
	blankTexture		= blankTextureL;
	playerSettings		= null;
	skybox				= null;
	player				= null;
	gameEnd				= false;
	passedChanger		= true;
	audioMuted			= false;
	loadedScores		= false;
	paused				= false;
	isElevatorCreated	= false;
	mainTextStyle		= mainTextStyleL;
	hsTextStyle			= hsTextStyleL;
	soundClick			= Instantiate(soundClickL);
	reciprocalScreen.x	= 1.0 / Screen.width;
	reciprocalScreen.y	= 1.0 / Screen.height;
		
	for(var i : int = 0; i < 5; i ++)
	{
		scaledFonts[i]	= scaledFontsL[i];
		buttonStyle[i]	= buttonStyleL[i];
	}			
		
	var gFuncs		= gui_controller();
	gFuncs.updateFontStyle();
}