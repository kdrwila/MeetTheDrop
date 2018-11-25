#pragma strict

public var id 			: int;

private var updateID	: int;

function FixedUpdate () 
{
	if(global_vars.player == null) return;
	
	updateID ++;
	
	if(updateID == 64)
	{
		if(global_vars.player.transform.position.y + 285.0 < this.transform.position.y)
		{
			Camera.main.GetComponent(scenery_controller).destroyCloud(id);
		}
		
		updateID = 0;
	}
}