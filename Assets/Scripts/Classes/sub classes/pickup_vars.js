#pragma strict

// Main pickup variables
public var type				: int;
public var rotation			: boolean		= true;

// Elevator variables
public var elevatorMinY		: float;
public var elevatorObject	: GameObject;
public var elevatorDoors	: GameObject;

private var frameSkip		: int;

function FixedUpdate()
{
	frameSkip ++;
	
	if(frameSkip % 2 != 0) return;
	
	if(rotation)
	{
		this.transform.eulerAngles.y += 60.0 * Time.fixedDeltaTime;
	}
	
	frameSkip = 0;
}