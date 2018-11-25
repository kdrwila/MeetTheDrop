Shader "Custom/Greyscale_Transparent" 
{	
	Properties 
	{
		//_Alpha ("Transparency", Range(0.0, 1.0)) = 1.0
		_Color ("Main Color", Color) = (.389, .1465, .4645, .5)
		_MainTex ("Base (RGB) Transparency (A)", 2D) = ""
	}
	
	SubShader 
	{
		Pass {
			GLSLPROGRAM
			varying lowp vec2 uv;
		
			#ifdef VERTEX
			void main () {
				gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
				uv = gl_MultiTexCoord0.xy;
			}
			#endif
			
			#ifdef FRAGMENT
			uniform lowp sampler2D _MainTex;
			void main () {
				gl_FragColor = vec4(
					vec3(dot(texture2D(_MainTex, uv).rgb, vec3(.222, .707, .071)) ), 1);
			}
			#endif
			ENDGLSL
		}	
	}
	
	SubShader 
	{
		Tags { "Queue" = "Transparent" }
		Pass
		{
			Blend One One
			
			Color [_Color]
			SetTexture[_MainTex] {Combine one - texture * primary alpha}
			//SetTexture[_MainTex] { Combine texture }
			SetTexture[_] {Combine previous Dot3 primary}
		}
		
	}
}

