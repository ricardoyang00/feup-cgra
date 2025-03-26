#ifdef GL_ES
precision highp float;
#endif

varying vec4 normal;

void main() {
	if(normal.y < 0.5){
		// Blue
        gl_FragColor = vec4(138.0 / 255.0, 138.0 / 255.0, 229.0 / 255.0, 1.0);
	}
    else{
		// Yellow
        gl_FragColor = vec4(229.0 / 255.0, 229.0 / 255.0, 0.0, 1.0);
    }
}