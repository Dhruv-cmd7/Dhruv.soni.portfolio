// bg-shader.js

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  // Simple 2D noise generator
  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    fp = fp*fp*(3.0-2.0*fp);
    float val = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), fp.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), fp.x),
      fp.y
    );
    return val * 2.0 - 1.0;
  }

  // FBM (Fractional Brownian Motion)
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Normalized coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Account for aspect ratio
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uvScaled = vec2(uv.x * aspect, uv.y);
    
    float t = u_time * 0.12;
    
    // Wavy coordinates using noise
    vec2 flow = vec2(
      fbm(uvScaled * 1.3 + vec2(t, t * 0.4)),
      fbm(uvScaled * 1.3 - vec2(t * 0.4, t))
    );
    
    // Dynamic noise coordinates
    vec2 noiseUV = uvScaled * 1.1 + flow * 0.5;
    float n = fbm(noiseUV);
    
    // Map noise value to gradient colors
    // Background indigo: #00020a
    vec3 c_bg = vec3(0.0, 0.01, 0.05);
    // Dark deep blue: #002255
    vec3 c_blue = vec3(0.0, 0.13, 0.33);
    // Deep vibrant teal: #008899
    vec3 c_teal = vec3(0.0, 0.53, 0.6);
    
    // Blend colors
    float factor1 = smoothstep(-0.5, 0.5, n);
    float factor2 = smoothstep(-0.3, 0.7, fbm(noiseUV * 1.8 + vec2(t * 0.3, -t * 0.2)));
    
    vec3 col = mix(c_bg, c_blue, factor1);
    col = mix(col, c_teal, factor2 * 0.4);
    
    // Add subtle fine noise grain
    float grainVal = fract(sin(dot(uv * u_time, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grainVal - 0.5) * 0.035;
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

function initBgShader() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.warn('WebGL not supported');
    return;
  }

  // Create shaders
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vertexShaderSource);
  gl.compileShader(vs);

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fragmentShaderSource);
  gl.compileShader(fs);

  // Link program
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Shader linking failed:', gl.getShaderInfoLog(program));
    return;
  }

  // Set up geometry (full-screen quad)
  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);

  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const timeLocation = gl.getUniformLocation(program, 'u_time');

  function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const startTime = Date.now();

  function render() {
    resizeCanvas();
    
    const elapsedSeconds = (Date.now() - startTime) / 1000.0;
    
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, elapsedSeconds);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  render();
}

window.addEventListener('DOMContentLoaded', initBgShader);
