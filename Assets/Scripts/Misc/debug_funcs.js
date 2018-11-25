#pragma strict

//public static var gyroDebugLog 	: String;

public var planePrefab : GameObject;

private var summedDT	: float;
private var dts			: float[]	= new float[15];
private var countDT		: float;
private var frameSkip	: int;

function Awake()
{
	//gyroDebugLog = "";
}

function Update () 
{
	frameSkip ++;
	
	if(frameSkip % 18 == 0)
	{
		summedDT += Time.deltaTime;
		
		dts[countDT] = Time.deltaTime;
		countDT ++;
		
		if(countDT == 15)
		{
			countDT = 0;
		}
		
		for(var i : int = 0; i < 15; i ++)
		{
			summedDT += dts[i];
		}
			
		//gyroDebugLog = "FPS: " +  Mathf.Round((1 / (summedDT / 15)));
		
		summedDT = 0;
		frameSkip = 0;
	}
}

function debugSquare(pos : Vector3, size : Vector2, color : Color, time : float)
{
	var dSquare : GameObject = Instantiate(planePrefab, pos, planePrefab.transform.rotation);
	
	dSquare.transform.localScale.x	= size.x;
	dSquare.transform.localScale.z	= size.y;
	dSquare.renderer.material.color	= color;
	
	Destroy(dSquare, time); 
}

function debugSquare(pos : Vector3, size : Vector2)
{
	debugSquare(pos, size, Color.white, 5.0);
}

function debugSquare(pos : Vector3, size : Vector2, color : Color)
{
	debugSquare(pos, size, color, 5.0);
}

function debugSquare(pos : Vector3, size : Vector2, time : float)
{
	debugSquare(pos, size, Color.white, time);
}