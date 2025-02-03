
varying vec3 vUv;

void main() {
    csm_Roughness = .35;
    csm_Metalness = .5;
    csm_DiffuseColor = vec4(vec3(.02, .35, .35), 1.0);
    // csm_FragColor = vec4(vUv.st, 0., 1.);
}