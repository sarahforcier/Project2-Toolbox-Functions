
export function func1(mesh, settings) {
    var abs_y = settings.pos;
    var height = settings.max - settings.min;
    var rel_y = (settings.pos - settings.min) / height;
    
    mesh.position.set(0, abs_y, 0);
    //mesh.scale.set(2, 1, 2);
}

export function sawtooth(mesh, settings) {
    var height = settings.max - settings.min;
    var abs_y = settings.pos;
    var x = height - abs_y;
    var rel_y = (settings.pos - settings.min) / height;
    
    mesh.position.set(0, abs_y, 0);
    var freq = 9 / height;
    var amp = Math.pow(x/10, 1.1);
    var bias = Math.pow(x, Math.log(0.4588) / Math.log(0.5));
    var s = (x * freq - Math.floor(x * freq)) * x*x/50;
    mesh.scale.set(s,settings.size,s);
}

export function triangle(mesh, settings) {
    var abs_y = settings.pos;
    var height = settings.max - settings.min;
    var rel_y = (settings.pos - settings.min) / height;
    var x = height - abs_y;
    
    mesh.position.set(0, abs_y, 0);
    var freq = 10 / height; 
    var amp = x;
    var s = Math.abs(((x + freq) * freq) % 2 - (0.5 * 2));
    s = s *s* x;
    mesh.scale.set(s,settings.size,s);
}

export function sine(mesh, settings) {
    var abs_y = settings.pos;
    var height = settings.max - settings.min;
    var rel_y = (settings.pos - settings.min) / height;
    var x = height - abs_y;
    
    mesh.position.set(0, abs_y, 0);
    var s1 = Math.abs(x * Math.sin(x/3)/2);
    var s2 = Math.abs(x * Math.sin(3*x)/10);
    mesh.scale.set(s1 + s2,settings.size,s1 + s2);
}

export function spread(mesh, curve, params) {
    var roo = curve.getPointAt(mesh.path/params.tessel);
    mesh.position.set(roo.x, roo.y, roo.z - 0.05 * mesh.layer);
    mesh.rotation.set(0,0,-3 * mesh.path * Math.PI/180);
}

export function shading(mesh, curve, params) {

}

export function size(mesh, curve, params) {
    mesh.scale.set((mesh.layer+1)/3, (mesh.layer+1)/3, (mesh.layer+1)/3);
}