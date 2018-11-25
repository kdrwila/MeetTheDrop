#pragma strict

class gui_controller extends System.ValueType
{
	function guiRect_C(x : float, y : float, w : float, h : float) : Rect
	{
		var xs : float = w * global_vars.guiScaleV;
		var ys : float = h * global_vars.guiScaleH;
		
		return Rect((Screen.width * x) - (xs * 0.5), (Screen.height * y) - (ys * 0.5), xs, ys);
	}
	
	function guiRect_C(pos : Vector2, scale : Vector2) : Rect
	{
		return guiRect_C(pos.x, pos.y, scale.x, scale.y);
	}
	
	function guiRect_L(x : float, y : float, w : float, h : float) : Rect
	{
		var xs : float = w * global_vars.guiScaleV;
		var ys : float = h * global_vars.guiScaleH;
		
		return Rect(Screen.width * x, (Screen.height * y) - (ys * 0.5), xs, ys);
	}
	
	function guiRect_L(pos : Vector2, scale : Vector2) : Rect
	{
		return guiRect_L(pos.x, pos.y, scale.x, scale.y);
	}
	
	function guiRect_R(x : float, y : float, w : float, h : float) : Rect
	{
		var xs : float = w * global_vars.guiScaleV;
		var ys : float = h * global_vars.guiScaleH;
		
		return Rect((Screen.width * x) - xs, (Screen.height * y) - (ys * 0.5), xs, ys);
	}
	
	function guiRect_R(pos : Vector2, scale : Vector2) : Rect
	{
		return guiRect_R(pos.x, pos.y, scale.x, scale.y);
	}
	
	function updateFontStyle()
	{
		if(global_vars.guiScaleV < 1.0)
		{
			global_vars.mainTextStyle.font	= global_vars.scaledFonts[0];
			global_vars.hsTextStyle.font	= global_vars.scaledFonts[4];
			global_vars.buttonStyle[0].font	= global_vars.scaledFonts[0];
		}											
		else if(global_vars.guiScaleV >= 1.0 && global_vars.guiScaleV < 1.25)
		{
			global_vars.mainTextStyle.font	= global_vars.scaledFonts[1];
			global_vars.hsTextStyle.font	= global_vars.scaledFonts[0];
			global_vars.buttonStyle[0].font	= global_vars.scaledFonts[1];
		}
		else if(global_vars.guiScaleV >= 1.25 && global_vars.guiScaleV < 1.75)
		{
			global_vars.mainTextStyle.font	= global_vars.scaledFonts[2];
			global_vars.hsTextStyle.font	= global_vars.scaledFonts[1];
			global_vars.buttonStyle[0].font	= global_vars.scaledFonts[2];
		}
		else
		{
			global_vars.mainTextStyle.font	= global_vars.scaledFonts[3];
			global_vars.hsTextStyle.font	= global_vars.scaledFonts[2];
			global_vars.buttonStyle[0].font	= global_vars.scaledFonts[3];
		}
	}
}