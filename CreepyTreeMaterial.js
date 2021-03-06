CreepyTreeMaterial = function ( parameters ) {

  parameters.shading = THREE.SmoothShading;

  THREE.ShaderMaterial.call( this, parameters );

  this.shading = THREE.FlatShading;

  this.wireframe = false;
  this.wireframeLinewidth = 1;

  this.setValues( parameters );


  var shaders = THREE.ShaderLib[ 'normal' ];
  this.uniforms = THREE.UniformsUtils.clone( shaders.uniforms );
  this.uniforms.growth = { type: 'f', value: parameters.growth };
  this.uniforms.radius = { type: 'f', value: parameters.radius };
  this.uniforms.growPeriod = { type: 'f', value: parameters.growPeriod };
  this.vertexShader = [

    "#define PI 3.14159265359",

    "varying vec3 vNormal;",
    "varying float vDepth;",
    "varying float screenZ;",
    "uniform float growPeriod;",
    "uniform float radius;",
    "uniform float growth;",

    "void main() {",
      "float growDone = growth - growPeriod;",

      "vDepth = uv2.x;",
//      "float vAge = max(0.0, (growth - vDepth));",
      "float growthProgress = float(vDepth < growDone) * 1.0",
                           ,"+ float(vDepth >= growDone && vDepth < growth) * (growth - vDepth) / growPeriod;",
      "float thicknessFactor = float(vDepth < growDone) * 1.0"
                           ,"+ float(vDepth >= growDone) * (0.5 - cos( PI * growthProgress ) / 2.0);",
      "float thickness = radius * thicknessFactor;",
      "vec3 extrudedPosition = position + thickness * normal;",
      //"vec3 extrudedPosition = position + 10.0 * growth * normal;",
      "vec4 mvPosition = modelViewMatrix * vec4( extrudedPosition, 1.0 );",

      // outputs
      "gl_Position = projectionMatrix * mvPosition;",
      "screenZ = gl_Position.z / gl_Position.w;",

    "}"

  ].join("\n");
  
  this.fragmentShader = [

    "uniform float opacity;",
    "uniform float growth;",
    
    "varying vec3 vNormal;",
    "varying float vDepth;",
    "varying float screenZ;",

    "void main() {",
      
      // discard if haven't grown here yet
      "if(vDepth > growth) discard;",

      // visualize screenZ
      //"float color = screenZ * 0.002;",
      "float color = screenZ * 0.2;",
      "gl_FragColor = vec4( color, color, color, float(vDepth < growth) );",

      // visualize vDepth
      //"gl_FragColor = vec4( vDepth, vDepth, vDepth, float(vDepth < growth) );",

    "}"

  ].join("\n");

};

CreepyTreeMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

CreepyTreeMaterial.prototype.clone = function () {

  var material = new THREE.MeshNormalMaterial();

  THREE.Material.prototype.clone.call( this, material );

  material.shading = this.shading;

  material.wireframe = this.wireframe;
  material.wireframeLinewidth = this.wireframeLinewidth;

  return material;

};
