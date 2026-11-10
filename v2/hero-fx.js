// The moving light over the picture at the top of the home page.
// Plain WebGL, no libraries. It redraws images/hall-night.jpg with slow sweeps of
// floodlight, a gentle flicker in the hall lights, film grain and a little scroll parallax.
// If WebGL isn't available, or the visitor prefers reduced motion, the ordinary
// picture underneath is shown instead (reduced motion gets one still frame).
(function () {
  var canvas = document.querySelector('.hero-fx');
  var img = document.querySelector('.hero-img');
  if (!canvas || !img) return;

  var gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false });
  if (!gl) return;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var vert = 'attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }';
  var frag = [
    'precision mediump float;',
    'varying vec2 v;',
    'uniform sampler2D tex;',
    'uniform vec2 res;',        // canvas size in pixels
    'uniform vec2 imgSize;',    // picture size in pixels
    'uniform float t;',         // seconds
    'uniform float scroll;',    // 0 at the top, 1 when the hero has scrolled away
    'float hash(vec2 q){ return fract(sin(dot(q, vec2(12.9898, 78.233))) * 43758.5453); }',
    'void main(){',
    // cover-fit the picture, centred a little right of middle so the shuttle stays in view
    '  float ca = res.x / res.y, ia = imgSize.x / imgSize.y;',
    '  vec2 uv = vec2(v.x, 1.0 - v.y);',
    '  vec2 s = ca > ia ? vec2(1.0, ia / ca) : vec2(ca / ia, 1.0);',
    '  uv = (uv - 0.5) * s + vec2(ca > ia ? 0.5 : 0.62, 0.5);',
    // slight zoom so the parallax never shows an edge, then drift with scroll
    '  uv = (uv - 0.5) / 1.06 + 0.5;',
    '  uv.y -= scroll * 0.035;',
    '  vec3 col = texture2D(tex, uv).rgb;',
    '  float lum = dot(col, vec3(0.299, 0.587, 0.114));',
    // hall lights breathe gently
    '  col += pow(lum, 4.0) * 0.18 * (0.6 + 0.4 * sin(t * 0.9 + uv.x * 3.0));',
    // two slow diagonal floodlight sweeps, warm white
    '  float d1 = uv.x + uv.y * 0.55 - mod(t * 0.035, 2.2) + 0.4;',
    '  float d2 = uv.x - uv.y * 0.35 - mod(t * 0.022 + 1.1, 2.2) + 0.4;',
    '  float beam = exp(-d1 * d1 * 28.0) * 0.10 + exp(-d2 * d2 * 40.0) * 0.07;',
    '  col += beam * vec3(1.0, 0.93, 0.78) * (0.35 + lum);',
    // vignette and grain
    '  vec2 c = v - 0.5;',
    '  col *= 1.0 - dot(c, c) * 0.55;',
    '  col += (hash(gl_FragCoord.xy + fract(t) * 91.0) - 0.5) * 0.045;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function shader(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
  }
  var vs = shader(gl.VERTEX_SHADER, vert), fs = shader(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var u = {};
  ['res', 'imgSize', 't', 'scroll'].forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });

  var running = false, visible = true, start = performance.now();

  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  }

  function draw(now) {
    size();
    var rect = canvas.getBoundingClientRect();
    var sc = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform2f(u.imgSize, img.naturalWidth, img.naturalHeight);
    gl.uniform1f(u.t, still ? 4.0 : (now - start) / 1000);
    gl.uniform1f(u.scroll, still ? 0 : sc);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function loop(now) {
    if (!running) return;
    draw(now);
    requestAnimationFrame(loop);
  }

  function begin() {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    } catch (e) { return; }
    gl.uniform1i(gl.getUniformLocation(prog, 'tex'), 0);
    draw(performance.now());
    if (gl.getError() !== gl.NO_ERROR) return;
    canvas.classList.add('is-on');
    if (still) {
      window.addEventListener('resize', function () { draw(performance.now()); });
      return;
    }
    running = true;
    requestAnimationFrame(loop);
    // pause when the hero is off screen or the tab is hidden
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !running && !document.hidden) { running = true; requestAnimationFrame(loop); }
        if (!visible) running = false;
      }).observe(canvas);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) running = false;
      else if (visible && !running) { running = true; requestAnimationFrame(loop); }
    });
  }

  if (img.complete && img.naturalWidth) begin();
  else img.addEventListener('load', begin, { once: true });
})();
