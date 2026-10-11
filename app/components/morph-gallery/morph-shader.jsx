
import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_fromAspect;
uniform float u_toAspect;
uniform float u_scale;
uniform float u_direction;
uniform float u_edge;
uniform float u_drift;

varying vec2 v_uv;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
   -0.577350269189626,
    0.024390243902439
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y)
    ? vec2(1.0, 0.0)
    : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ),
    0.0
  );

  m *= m;
  m *= m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159
    - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

float fbm(vec2 v) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(v);
    v *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

vec2 mirror(vec2 uv) {
  return 1.0 - abs(1.0 - mod(uv, 2.0));
}

vec2 coverUV(vec2 uv, float imgAspect) {
  float canvasAspect = u_resolution.x / u_resolution.y;

  vec2 scale = (canvasAspect > imgAspect)
    ? vec2(1.0, imgAspect / canvasAspect)
    : vec2(canvasAspect / imgAspect, 1.0);

  return mirror((uv - 0.5) * scale + 0.5);
}

void main() {
  float adjusted =
    u_progress * (1.0 + 2.0 * u_edge) - u_edge;

  float noise = fbm(
    v_uv * u_scale
    + vec2(0.0, u_progress * u_direction)
  ) * 0.5 + 0.5;

  noise = smoothstep(
    0.0,
    2.0,
    length(
      texture2D(u_to, coverUV(v_uv, u_toAspect)).rgb
    ) + noise
  );

  float mixFactor = 1.0 - smoothstep(
    adjusted - u_edge,
    adjusted + u_edge,
    noise
  );

  vec2 fromUV = coverUV(
    v_uv + vec2(
      0.0,
      noise * u_progress * u_drift * u_direction
    ),
    u_fromAspect
  );

  vec2 toUV = coverUV(
    v_uv + vec2(
      0.0,
      noise * (1.0 - u_progress) * -0.5
        * u_drift * u_direction
    ),
    u_toAspect
  );

  gl_FragColor = mix(
    texture2D(u_from, fromUV),
    texture2D(u_to, toUV),
    mixFactor
  );
}
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to create shader');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || 'Shader compilation failed');
  }

  return shader;
}

function createProgram(gl) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERT);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();

  if (!program) throw new Error('Unable to create WebGL program');

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message || 'WebGL program linking failed');
  }

  return program;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(
      new Error(`Unable to load gallery image: ${src}`)
    );
    image.src = src;
  });
}

function createTexture(gl, image) {
  const texture = gl.createTexture();
  if (!texture) throw new Error('Unable to create WebGL texture');

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return texture;
}

export default function MorphShader({
  fromImage,
  toImage,
  transitionKey,
  className,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const firstFrameRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      console.error('WebGL is unavailable; showing the gallery fallback.');
      return;
    }

    let program;
    let buffer;
    let resizeObserver;
    let animationFrame = 0;
    let disposed = false;
   

    const uniforms = {};

    try {
      program = createProgram(gl);
      gl.useProgram(program);

      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );

      const position = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      [
        'from',
        'to',
        'progress',
        'resolution',
        'fromAspect',
        'toAspect',
        'scale',
        'direction',
        'edge',
        'drift',
      ].forEach((name) => {
        uniforms[name] = gl.getUniformLocation(program, `u_${name}`);
      });

      gl.clearColor(0, 0, 0, 0);

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.round(canvas.clientWidth * dpr);
        const height = Math.round(canvas.clientHeight * dpr);

        if (!width || !height) return;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      resize();

      stateRef.current = {
        gl,
        program,
        uniforms,
        canvas,
        progress: 1,
        startedAt: 0,
        duration: 1250,
        fromAspect: 1,
        toAspect: 1,
        direction: 1,
      };

      const render = (now) => {
        if (disposed) return;

        resize();

        const state = stateRef.current;
        if (state && state.textures?.length === 2) {
          if (state.progress < 1) {
            const elapsed = now - state.startedAt;
            const t = Math.min(elapsed / state.duration, 1);

            // Original gallery's quintic ease-in-out.
            state.progress = t < 0.5
              ? 16 * t ** 5
              : 1 - ((-2 * t + 2) ** 5) / 2;
          }

          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.useProgram(program);

          gl.activeTexture(gl.TEXTURE0);
         gl.bindTexture(gl.TEXTURE_2D, state.textures[0]);
          gl.uniform1i(uniforms.from, 0);

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, state.textures[1]);
          gl.uniform1i(uniforms.to, 1);

          gl.uniform1f(uniforms.progress, state.progress);
          gl.uniform2f(
            uniforms.resolution,
            canvas.width,
            canvas.height
          );
          gl.uniform1f(uniforms.fromAspect, state.fromAspect);
          gl.uniform1f(uniforms.toAspect, state.toAspect);
          gl.uniform1f(uniforms.scale, 3.5);
          gl.uniform1f(uniforms.direction, state.direction);
          gl.uniform1f(uniforms.edge, 0.15);
          gl.uniform1f(uniforms.drift, 0.5);

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        animationFrame = requestAnimationFrame(render);
      };

      animationFrame = requestAnimationFrame(render);
    } catch (error) {
      console.error('Morph Gallery WebGL initialization failed:', error);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();

      stateRef.current?.textures?.forEach((texture) => {
  gl.deleteTexture(texture);
});

      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);

      stateRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const state = stateRef.current;

    if (!state) return undefined;

    async function updateTextures() {
      try {
        const [from, to] = await Promise.all([
          loadImage(fromImage),
          loadImage(toImage),
        ]);

        if (cancelled) return;

        const { gl } = state;
        const fromTexture = createTexture(gl, from);
        const toTexture = createTexture(gl, to);

        if (cancelled) {
          gl.deleteTexture(fromTexture);
          gl.deleteTexture(toTexture);
          return;
        }

        const oldTextures = stateRef.current?.textures || [];
        oldTextures.forEach((texture) => gl.deleteTexture(texture));

        stateRef.current.textures = [fromTexture, toTexture];

        state.fromAspect = from.naturalWidth / from.naturalHeight;
        state.toAspect = to.naturalWidth / to.naturalHeight;

        // Keep the first render static; animate only when changing slides.
        state.progress = firstFrameRef.current ? 1 : 0;
        state.startedAt = performance.now();
        state.direction = 1;
        firstFrameRef.current = false;

        // The render loop reads these two textures.
        const canvas = state.canvas;
        canvas.dataset.morphReady = 'true';

        // Expose the textures to the render loop without React re-renders.
        stateRef.current.textures = [fromTexture, toTexture];
        currentTextureSync();
      } catch (error) {
        console.error('Morph Gallery image loading failed:', error);
      }
    }

    function currentTextureSync() {
      // Textures are stored on the renderer state and consumed by the loop.
      const textures = stateRef.current?.textures;
      if (textures) {
        stateRef.current.progress = firstFrameRef.current ? 1 : 0;
      }
    }

    updateTextures();

    return () => {
      cancelled = true;
    };
  }, [fromImage, toImage, transitionKey]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
