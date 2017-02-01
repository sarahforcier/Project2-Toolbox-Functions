function bias(b, t) {
    return Math.pow(t, Math.log(b) / Math.log(0.5));
}

function gain(g, t) {
    if (t < 0.5) return bias(1-g, 2*t)/2;
    else return 1 - bias(1-g, 2-2*t)/2;
}

function parabola(x, k) {
    return Math.pow(4*x*(1-x),k);
}

function cubicPulse(c, w, x) {
    var x = Math.abs(x-c);
    if (x>w) return 0;
    x /=w;
    return 1 - x*x*(3-2*x);
}

function pcurve(x, a, b) {
    var k = Math.pow(a+b, a+b) / Math.pow(a,a) / Math.pow(b,b);
    return k * Math.pow(x, a) * Math.pow(1-x, b);
}

export function spread(mesh, curve, params) {
    var i = mesh.path/params.tessel/2;
    var rot = -(150* bias(params.orientation, mesh.path/params.tessel) - 30);
    var dist = parabola(i, 1.5); 
    var roo = curve.getPointAt(dist);
    var Xoutward = (-45 + 8*mesh.layer) * Math.PI/180;
    var Yoverlap = -15 * Math.PI/180;
    // var Zrightleft = -3 * mesh.path * Math.PI/180; // 20 -> -120
    var Zrightleft = rot * Math.PI / 180;
    mesh.position.set(roo.x, roo.y, roo.z-mesh.layer*0.001);
    mesh.rotation.set(Xoutward, Yoverlap, Zrightleft);
}

export function size(mesh, curve, params) {
    var oi = mesh.path/ params.tessel;
    var l = gain(0.3,(mesh.layer + 1)/params.layers);
    var x = 1+Math.sin(3 * Math.PI /2 * oi)* Math.sin(3 * Math.PI /2 * oi)/2;
    var y = 1 + Math.cos(Math.PI * oi) * Math.cos(Math.PI * oi);
    var sc = params.scale * cubicPulse(0, 2, 1-oi);
    var sx = params.scale * Math.min(2*(1-bias(0.6, oi))+1,1.5);
    mesh.scale.set(sx, x*y*sc*l, x*y*sc*l);
}