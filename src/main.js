
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

import {spread, size} from './distribution'

var val = function() {
    this.speed = 10; this.curvature = 1; 
    this.scale = 1; this.orientation = 0.1; this.color = [1.0,0.0,0.0];
    this.motion = 1;
    this.layers = 3; this.tessel = 20;
    this.direction = Math.PI; this.force = 0.5;
};

var feathers = [];
var featherGeo;
var params = new val();

var new_mat = function(l) {
    var mat = {
      uniforms: {
        color: {value: params.color},
        light: {value: [1.0, 3.0, 2.0]},
        layer: {value: l},
        total: {value: params.layers}
        },
      vertexShader: require('./shaders/feather-vert.glsl'),
      fragmentShader: require('./shaders/feather-frag.glsl')
    };
    return mat;
}

var p0 = new THREE.Vector3(2.5,0,0);
var p1_0 = new THREE.Vector3(1.5,-0.5*params.curvature,-0.5*params.motion);
var p1_1 = new THREE.Vector3(1.5,-0.5*params.curvature, 0.5*params.motion);
var p2_0 = new THREE.Vector3(-1.5,0.5*params.curvature,0.75*params.motion);
var p2_1 = new THREE.Vector3(-1,0.5*params.curvature,-0.75*params.motion);
var p3_0 = new THREE.Vector3(-2.5,0.5*params.curvature,1*params.motion)
var p3_1 = new THREE.Vector3(-1.25,0.5*params.curvature,-1*params.motion);
var p1 = new THREE.Vector3(0,0,0); 
var p2 = new THREE.Vector3(0,0,0); 
var p3 = new THREE.Vector3(0,0,0);

var curve = new THREE.CatmullRomCurve3( [p0, p1_0, p2_0, p3_0 ]);

function createWing(scene, geo) {
    // remove all feathers
    for (var f = 0; f < feathers.length; f ++ ) {
        scene.remove(feathers[f]);
    }
    feathers = [];

    var k;
    var material;

    p1_0 = new THREE.Vector3(1.5,-5*params.curvature,-0.5*params.motion);
    p1_1 = new THREE.Vector3(1.5,-5*params.curvature, 0.5*params.motion);
    p2_0 = new THREE.Vector3(-1.5,0.5*params.curvature,0.75*params.motion);
    p2_1 = new THREE.Vector3(-1.5,0.5*params.curvature,-0.75*params.motion);
    p3_0 = new THREE.Vector3(-2.5,0.5*params.curvature,1*params.motion)
    p3_1 = new THREE.Vector3(-2.5,0.5*params.curvature,-1*params.motion);
    curve = new THREE.CatmullRomCurve3( [p0, p1_0, p2_0, p3_0 ]);
    // debugger
    for (var j = 0; j < params.layers; j++) {
        material = new THREE.ShaderMaterial(new_mat(j));
        for (var i = 0; i < params.tessel; i++) {
            var k = feathers.length;
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

function moveFeathers(scene) {

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
    var urlPrefix = 'images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    scene.background = skymap;

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    var obj = objLoader.load('geo/feather_new.obj', function(obj) {
        // LOOK: This function runs after the obj has finished loading
        featherGeo = obj.children[0].geometry;
        createWing(scene, featherGeo);
    });

    // set camera position
    camera.position.set(-10, 5, 6);
    camera.lookAt(new THREE.Vector3(0,0,0));

    scene.add(directionalLight);

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
     var f1 = gui.addFolder('Wing');
     var f2 = gui.addFolder('Feathers');
     var f3 = gui.addFolder('Wind');

    //color
    f2.addColor(params, 'color').onChange(function(newVal) {
        // params.color = [newVal[0]/255, newVal[1]/255, newVal[2]/255];
        createWing(scene, featherGeo);
    });
    //scale
    f2.add(params, 'scale',0.0, 2.0).onChange(function(newVal) {});
    //orient
    f2.add(params, 'orientation',0.0, 1.0).onChange(function(newVal) {});
    // flapping speed
    f1.add(params, 'speed', 0, 40).onChange(function(newVal) {});
    // flapping motion
    f1.add(params, 'motion', 0, 3).onChange(function(newVal) {
        createWing(scene, featherGeo);});
    //curvature
    f1.add(params, 'curvature', 0.0, 5).onChange(function(newVal) {
        createWing(scene, featherGeo);});
    // distribution
    f1.add(params, 'layers', 0, 5).step(1).onChange(function(newVal) {
        createWing(scene, featherGeo);});
    f1.add(params, 'tessel', 0, 100).step(1).onChange(function(newVal) {
        createWing(scene, featherGeo);});
    // force magnitude
    f3.add(params, 'force', 0,1).onChange(function(newVal) {});
    // force direction
    f3.add(params, 'direction', 0, 2*Math.PI).onChange(function(newVal) {});
}

// called on frame updates
function onUpdate(framework) {
    var date = new Date();
    var t = Math.sin(params.speed * date.getTime()/(4*1000))/2 + 0.5;
    curve = new THREE.CatmullRomCurve3( 
        [p0, p1.lerpVectors(p1_0, p1_1, t), 
        p1.lerpVectors(p2_0, p2_1, t), 
        p2.lerpVectors(p3_0, p3_1,t)]);
    for (var i = 0; i < feathers.length; i++) {
        var feather = framework.scene.getObjectByName("feather" + i.toString());    
        if (feather !== undefined) {
            size(feather, curve, params);
            spread(feather, curve, params);
            var flutter = params.force * Math.cos(params.direction)/2;
            feather.rotateY(flutter*Math.sin(date.getTime()/(25 + Math.random())));
            //feather.rotateZ(Math.sin(date.getTime())/(100 + Math.random()));
            //feather.rotateZ(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180);      
        }
    }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);