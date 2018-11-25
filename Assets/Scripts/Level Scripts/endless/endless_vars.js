#pragma strict

public static var endlessRandomSet	: int[,] = new int[10, 4];
public static var firstNewScnry		: boolean;
public static var lastEndlessY		: float;

public var changerPrefab			: GameObject;

function Awake() 
{
	endlessRandomSet[0, 0] = global_consts.GROUND_LEFT;
	endlessRandomSet[1, 0] = global_consts.GROUND_RIGHT;
	endlessRandomSet[2, 0] = global_consts.GROUND_RIGHT;
	endlessRandomSet[3, 0] = global_consts.GROUND_LEFT;
	endlessRandomSet[4, 0] = global_consts.GROUND_CENTER;
	endlessRandomSet[5, 0] = global_consts.GROUND_RIGHT;
	endlessRandomSet[6, 0] = global_consts.GROUND_CENTER;
	endlessRandomSet[7, 0] = global_consts.GROUND_CENTER;
	endlessRandomSet[8, 0] = global_consts.GROUND_LEFT;
	endlessRandomSet[9, 0] = global_consts.GROUND_RIGHT;
	
	endlessRandomSet[0, 1] = global_consts.GROUND_RIGHT;
	endlessRandomSet[1, 1] = global_consts.GROUND_CENTER;
	endlessRandomSet[2, 1] = global_consts.GROUND_RIGHT;
	endlessRandomSet[3, 1] = global_consts.GROUND_CENTER;
	endlessRandomSet[4, 1] = global_consts.GROUND_LEFT;
	endlessRandomSet[5, 1] = global_consts.GROUND_LEFT;
	endlessRandomSet[6, 1] = global_consts.GROUND_RIGHT;
	endlessRandomSet[7, 1] = global_consts.GROUND_LEFT;
	endlessRandomSet[8, 1] = global_consts.GROUND_CENTER;
	endlessRandomSet[9, 1] = global_consts.GROUND_CENTER;
	
	endlessRandomSet[0, 2] = global_consts.GROUND_CENTER;
	endlessRandomSet[1, 2] = global_consts.GROUND_RIGHT;
	endlessRandomSet[2, 2] = global_consts.GROUND_LEFT;
	endlessRandomSet[3, 2] = global_consts.GROUND_LEFT;
	endlessRandomSet[4, 2] = global_consts.GROUND_RIGHT;
	endlessRandomSet[5, 2] = global_consts.GROUND_RIGHT;
	endlessRandomSet[6, 2] = global_consts.GROUND_LEFT;
	endlessRandomSet[7, 2] = global_consts.GROUND_CENTER;
	endlessRandomSet[8, 2] = global_consts.GROUND_CENTER;
	endlessRandomSet[9, 2] = global_consts.GROUND_LEFT;
	
	endlessRandomSet[0, 3] = global_consts.GROUND_LEFT;
	endlessRandomSet[1, 3] = global_consts.GROUND_RIGHT;
	endlessRandomSet[2, 3] = global_consts.GROUND_CENTER;
	endlessRandomSet[3, 3] = global_consts.GROUND_LEFT;
	endlessRandomSet[4, 3] = global_consts.GROUND_LEFT;
	endlessRandomSet[5, 3] = global_consts.GROUND_CENTER;
	endlessRandomSet[6, 3] = global_consts.GROUND_RIGHT;
	endlessRandomSet[7, 3] = global_consts.GROUND_CENTER;
	endlessRandomSet[8, 3] = global_consts.GROUND_RIGHT;
	endlessRandomSet[9, 3] = global_consts.GROUND_LEFT;
}

function Update () {

}