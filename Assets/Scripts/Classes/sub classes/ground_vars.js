#pragma strict

public var isOnCorner 	: boolean 		= false;
public var brick		: boolean		= false;
public var groundType	: int 			= global_consts.GROUND_WHITE;
public var groundParent	: GameObject	= null;
public var corners		: GameObject[]	= new GameObject[2];
public var gap			: float;

public var sWidth		: int;

function Awake()
{
	corners[0] = null;
	corners[1] = null;
}