
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

import {func1, sawtooth, triangle, sine, spread, shading, size} from './distribution'

var val = function() {
    this.speed = 100; this.curvature = 1; 
    this.scale = 1; this.orientation = 0; this.color = [1,0,0];
    this.flap = 0; this.motion = 0;
    this.layers = 3; this.tessel = 30;
    this.direction = 0; this.force = 0;
};

var feathers = [];
var featherGeo;
var params = new val();

var new_mat = function(l) {
    var mat = {
      uniforms: {
        color: {value: params.color},
        light: {value: [1.0, 3.0, 2.0]},
        layer: {value: l}
        },
      vertexShader: require('./shaders/feather-vert.glsl'),
      fragmentShader: require('./shaders/feather-frag.glsl')
    };
    return mat;
}


var p0 = new THREE.Vector3(2.5,0,0);
var curve = new THREE.CatmullRomCurve3( [
    p0, new THREE.Vector3(1.5,-0.5*params.curvature,0 ),
    new THREE.Vector3(-1.5,0.5*params.curvature,0.75 + params.flap ),
    new THREE.Vector3(-2.5,0.5,1 + params.flap)    
    ]);

function createWing(scene, geo) {
    // remove all feathers
    for (var f = 0; f < feathers.length; f ++ ) {
        scene.remove(feathers[f]);
    }
    feathers = [];

    curve = new THREE.CatmullRomCurve3( [
    p0, new THREE.Vector3(1.5,-0.5*params.curvature,0 ),
    new THREE.Vector3(-1.5,0.5*params.curvature,0.75 + params.flap ),
    new THREE.Vector3(-2.5,0.5 ,1 + params.flap)    
    ]);

    var k;
    var material;
    debugger
    for (var j = 0; j < params.layers; j++) {
        material = new THREE.ShaderMaterial(new_mat(j));
        for (var i = 0; i < params.tessel; i++) {
            k = i + params.tessel * j;
            var feather = new THREE.Mesh(geo, material);
            feathers.push(feather);
            feather.name = "feather" + (k).toString();
            feather.path = i;
            feather.layer = j;
            size(feather, curve, params);
            spread(feather, curve, params);
            scene.add(feather);
        }
    }
}

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Set light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.position.set(1, 3, 2);
    directionalLight.position.multiplyScalar(10);

    // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = '/images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    scene.background = skymap;

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    var obj = objLoader.load('/geo/feather_new.obj', function(obj) {
        // LOOK: This function runs after the obj has finished loading
        featherGeo = obj.children[0].geometry;
        createWing(scene, featherGeo);
    });

    // set camera position
    camera.position.set(0, 1, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));

    scene.add(directionalLight);

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
     var f1 = gui.addFolder('Wing');
     var f2 = gui.addFolder('Feathers');
     var f3 = gui.addFolder('Wind');

    //color
    f2.addColor(params, 'color').onChange(function(newVal) {
    params.color = [newVal[0]/255, newVal[1]/255, newVal[2]/255];
    });
    //scale
    f2.add(params, 'scale',0.0, 2.0).onChange(function(newVal) {
        params['scale'] = newVal;});
    //orient
    f2.add(params, 'orientation',0.0, 2.0).onChange(function(newVal) {
        params.orientation = newVal;});
    // flapping speed
    f1.add(params, 'speed', 1, 100).onChange(function(newVal) {
        params['speed'] = newVal;});
    // flapping motion
    f1.add(params, 'motion', 1, 100).onChange(function(newVal) {
        params['motion'] = newVal;});
    //curvature
    f1.add(params, 'curvature', 0.0, 2.0).onChange(function(newVal) {
        params.curvature = newVal;
        createWing(scene, featherGeo);});
    // distribution
    f1.add(params, 'layers', 0, 5).step(1).onChange(function(newVal) {
        params.layers = newVal;
        createWing(scene, featherGeo);});
    f1.add(params, 'tessel', 0, 100).onChange(function(newVal) {
        params.tessel = newVal;
        createWing(scene, featherGeo);});
    // force magnitude
    f3.add(params, 'force', 20, 100).onChange(function(newVal) {
        params['force'] = newVal;});
    // force direction
    f3.add(params, 'direction').onChange(function(newVal) {
        params.direction = newVal;});
}

// called on frame updates
function onUpdate(framework) {
    var date = new Date();

    for (var i = 0; i < feathers.length; i++) {
        var feather = framework.scene.getObjectByName("feather" + i.toString());    
        if (feather !== undefined) {
            size(feather, curve, params);
            spread(feather, curve, params); 
            feather.rotateZ(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180);      
        }
    }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);