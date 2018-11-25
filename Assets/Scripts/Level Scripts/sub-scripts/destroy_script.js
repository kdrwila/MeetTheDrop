#pragma strict

public var destroyDist	: float		= 185.0;
public var destroyColl	: float		= 15.0;
public var collide		: boolean;

private var updateID	: int;

function FixedUpdate () 
{
	if(global_vars.player == null) return;
	
	updateID ++;
	
	if(updateID == 64)
	{
		if(global_vars.player.transform.position.y + destroyDist < this.transform.position.y)
		{
			Destroy(this.gameObject);
		}
		
		updateID = 0;
		
		if(!collide) return;
		
		else if(global_vars.player.transform.position.y + destroyColl < this.transform.position.y)
		{
			Destroy(this.collider);
		}
	}
}