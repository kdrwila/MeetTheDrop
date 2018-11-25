#pragma strict

private var frameSkip			: int		= -1;

public var mainScore 			: int;
public var addScore				: int;
public var combo				: int;
	
public var explosivesCount		: int 		= 0;
public var teleportsCount		: int 		= 0;
public var overallWeaponsCount	: int 		= 0;

public var godMode				: boolean;
public var penetrating			: boolean;
public var armed				: boolean;

public static var playerName	: String 	= "Player";
public static var scoreString	: String;

function FixedUpdate()
{
	frameSkip ++;
	
	if(frameSkip == 38)
	{
		scoreString = "Score: " + (mainScore + addScore);
		
		frameSkip = 0;
	}
}