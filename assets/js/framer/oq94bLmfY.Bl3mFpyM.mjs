import{t as e}from"./rolldown-runtime.TjgygFMs.mjs";import{A as t,C as n,D as r,N as i,c as a,g as o,k as s,l as ee,o as c,v as l}from"./react.WWMnSf-G.mjs";import{E as u,a as d,r as f,t as p}from"./motion.a6peEKn1.mjs";import{$ as m,A as h,At as g,B as _,K as v,L as y,Mt as te,N as b,Nt as x,Ot as ne,P as S,R as C,at as w,dt as re,ft as T,i as E,j as D,kt as O,o as k,xt as ie}from"./framer.CR6ExB2q.mjs";var A,ae=e((()=>{m(),A=C({title:`Wave Gradient`,fragment:`
#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

vec2 hash(vec2 p) {
    float s = u_seed;
    vec2 k1 = vec2(2127.1 + s * 13.37, 81.17 + s * 7.31);
    vec2 k2 = vec2(1269.5 + s * 11.13, 283.37 + s * 5.79);
    p = vec2(dot(p, k1), dot(p, k2));
    return fract(sin(p) * (43758.5453 + s * 1.618));
}

float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(
        mix(dot(-1.0 + 2.0 * hash(i), f),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
    );
    return 0.5 + 0.5 * n;
}

vec3 getColor(int idx) {
    if (u_colors_length < 1) return vec3(0.0);
    int safeIdx = clamp(idx, 0, u_colors_length - 1);
    return u_colors[safeIdx].rgb;
}

float seedF(float base) {
    return base * (1.0 + 0.5 * sin(u_seed * 3.17 + base));
}

vec2 warpUV(vec2 uv) {
    float t = u_time * u_waveSpeed;

    float angleOffset = sin(u_seed * 2.73) * 30.0;
    mat2 dirRot = Rot(radians(u_waveAngle + angleOffset));
    vec2 ruv = dirRot * uv;

    float fxMod = seedF(u_waveFreqX);
    float fyMod = seedF(u_waveFreqY);

    float phaseX = fract(sin(u_seed * 7.19) * 437.58) * 6.2832;
    float phaseY = fract(cos(u_seed * 3.41) * 291.37) * 6.2832;

    // Core wave with seed-dependent harmonics
    float harmonic = sin(u_seed * 1.23) * 0.5;
    float a = fyMod * ruv.y - sin(ruv.x * fxMod + ruv.y - t + phaseX);
    a += harmonic * sin(ruv.x * fxMod * 2.0 + ruv.y * 0.5 + t * 0.7 + phaseY);

    // Smoothstep mask (unchanged)
    a = smoothstep(
        cos(a) * u_maskSoftness,
        sin(a) * u_maskSoftness + 3.,
        cos(a - fyMod * ruv.y) - sin(a - fxMod * ruv.x)
    );

    a *= u_waveAmplitude;

    uv = cos(a) * uv + sin(a) * vec2(-uv.y, uv.x);
    return uv;
}

void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 uv = fragCoord / u_resolution.xy;
    float ratio = u_resolution.x / u_resolution.y;
    float t = u_time * u_waveSpeed;

    vec2 tuv = uv - 0.5;

    vec2 seedShift = vec2(sin(u_seed * 4.37), cos(u_seed * 5.91)) * 100.0;
    float degree = noise(vec2(t * 0.1, tuv.x * tuv.y) + seedShift);
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * 720.0 + 180.0));
    tuv.y *= ratio;

    // Seed-rotate uv2 before warping
    vec2 uv2 = (fragCoord * 2.0 - u_resolution.xy) / (u_resolution.x + u_resolution.y) * 2.0;
    float preRotAngle = fract(sin(u_seed * 5.63) * 173.29) * 6.2832;
    uv2 *= Rot(preRotAngle);
    vec2 warped = warpUV(uv2) * 0.5 + 0.5;

    vec2 blendUV = mix(tuv, warped - 0.5, u_blendAmount);

    float layerRot1 = -5.0 + sin(u_seed * 1.83) * 20.0;
    float layerRot2 = 10.0 + cos(u_seed * 2.47) * 20.0;

    vec3 c0 = getColor(0);
    vec3 c1 = getColor(1);
    vec3 c2 = getColor(2);
    vec3 c3 = getColor(3);

    vec3 layer1 = mix(c0, c2, S(-0.3, 0.3, (blendUV * Rot(radians(layerRot1))).x));
    vec3 layer2 = mix(c3, c1, S(-0.3, 0.3, (blendUV * Rot(radians(layerRot2))).x));
    vec3 col = mix(layer1, layer2, S(0.3, -0.3, blendUV.y));

    col = mix(col, col * col + 0.5 * sqrt(col), 0.3);

    fragColor = vec4(col, 1.0);
}
`,propertyControls:{colors:{type:k.Array,title:`Colors`,control:{type:k.Color},maxCount:4,defaultValue:[`#FF3624`,`#9EABFF`,`#FFAE00`,`#E29EFF`]},seed:{type:k.Number,title:`Seed`,defaultValue:32,min:0,max:100,step:1},waveSpeed:{type:k.Number,title:`Speed`,defaultValue:1.5,min:0,max:3,step:.01},waveFreqX:{type:k.Number,title:`Freq X`,defaultValue:.9,min:.1,max:6,step:.1},waveFreqY:{type:k.Number,title:`Freq Y`,defaultValue:6,min:.1,max:6,step:.1},waveAngle:{type:k.Number,title:`Angle`,defaultValue:105,min:-180,max:180,step:1},waveAmplitude:{type:k.Number,title:`Amplitude`,defaultValue:2.1,min:.5,max:3,step:.01},maskSoftness:{type:k.Number,title:`Softness`,defaultValue:.74,min:.01,max:2,step:.01},blendAmount:{type:k.Number,title:`Blend`,defaultValue:.54,min:0,max:1,step:.01}}})})),j,M=e((()=>{m(),j=C({title:`Liquid Gradient`,resolutionScale:`consistent`,fragment:`
// === CONSTANTS ===
const float GOLDEN_ANGLE = 2.3999632;
const float TAU = 6.28318530;

// === PCG hash - https://www.jcgt.org/published/0009/03/02/
uvec3 hash3(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return v;
}

// Seed
vec3 seedRandom(float seedVal) {
    uvec3 s = uvec3(
        floatBitsToUint(seedVal),
        floatBitsToUint(seedVal * 1.5 + 7.31),
        floatBitsToUint(seedVal * 2.7 + 13.37)
    );
    s = hash3(s);
    return vec3(s) / float(0xFFFFFFFFu);
}

// === COLOR SPACE UTILITIES ===
vec3 toLinear(vec3 c) {
    return pow(c, vec3(2.2));
}

vec3 toSrgb(vec3 c) {
    return pow(clamp(c, 0.0, 1.0), vec3(0.4545));
}

vec3 linearToOklab(vec3 c) {
    float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
    float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
    float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
    
    l = pow(max(l, 0.0), 1.0/3.0);
    m = pow(max(m, 0.0), 1.0/3.0);
    s = pow(max(s, 0.0), 1.0/3.0);
    
    return vec3(
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    );
}

vec3 oklabToLinear(vec3 c) {
    float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
    float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
    float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
    
    l = l * l * l;
    m = m * m * m;
    s = s * s * s;
    
    return vec3(
        +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    );
}

vec3 oklabToLch(vec3 lab) {
    return vec3(lab.x, length(lab.yz), atan(lab.z, lab.y));
}

vec3 lchToOklab(vec3 lch) {
    return vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z));
}

vec3 mixLch(vec3 lab0, vec3 lab1, float t) {
    vec3 lch0 = oklabToLch(lab0);
    vec3 lch1 = oklabToLch(lab1);
    
    if (lch0.y < 0.05) lch0.z = lch1.z;
    if (lch1.y < 0.05) lch1.z = lch0.z;
    
    float dh = lch1.z - lch0.z;
    if (dh > 3.14159265) dh -= 6.28318530;
    if (dh < -3.14159265) dh += 6.28318530;
    
    return lchToOklab(vec3(
        mix(lch0.x, lch1.x, t),
        mix(lch0.y, lch1.y, t),
        lch0.z + dh * t
    ));
}

// === PALETTE SAMPLING ===
vec3 getColor(int idx) {
    if (u_colors_length < 1) return vec3(0.0);
    int safeIdx = clamp(idx, 0, u_colors_length - 1);
    return u_colors[safeIdx].rgb;
}

vec3 paletteN(float t, int count) {
    if (count < 1) return vec3(0.0);
    if (count < 2) return toLinear(getColor(0));
    
    float segmentSize = 1.0 / float(count - 1);
    t = clamp(t, 0.0, 1.0);
    int idx = min(int(floor(t / segmentSize)), count - 2);
    float localT = clamp((t - float(idx) * segmentSize) / segmentSize, 0.0, 1.0);
    
    vec3 lab0 = linearToOklab(toLinear(getColor(idx)));
    vec3 lab1 = linearToOklab(toLinear(getColor(idx + 1)));
    
    return oklabToLinear(mixLch(lab0, lab1, localT));
}

// === DITHER ===
float IGN(vec2 uv) {
    return fract(52.9829189 * fract(dot(uv, vec2(0.06711056, 0.00583715))));
}

float quickNoise(vec2 I) {
    return fract(sin(dot(I, vec2(12.9898, 78.233))) * 43758.5453);
}

// Dither Mode: 0=Off, 1=IGN, 2=quickNoise
float getDither(vec2 I, float mode) {
    if (mode < 0.5) return 0.5;          // 0: Off
    if (mode < 1.5) return IGN(I);       // 1: Smooth
    return quickNoise(I);                // 2: Grain
}

// === POST-PROCESS ===
vec3 softGamutMap(vec3 linearRgb) {
    float maxC = max(linearRgb.r, max(linearRgb.g, linearRgb.b));
    float minC = min(linearRgb.r, min(linearRgb.g, linearRgb.b));
    
    if (minC >= 0.0 && maxC <= 1.0) return linearRgb;
    
    vec3 lab = linearToOklab(max(linearRgb, 0.0));
    float L = clamp(lab.x, 0.0, 1.0);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);
    
    float maxChroma = 0.4 * (1.0 - pow(abs(2.0 * L - 1.0), 2.0));
    
    if (C > maxChroma * 0.7) {
        float knee = maxChroma * 0.7;
        C = knee + (maxChroma - knee) * tanh((C - knee) / (maxChroma - knee + 0.001));
    }
    
    return clamp(oklabToLinear(vec3(L, C * cos(h), C * sin(h))), 0.0, 1.0);
}

vec3 applyContrastSaturation(vec3 linearRgb, float contrast, float saturation) {
    vec3 lab = linearToOklab(linearRgb);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);
    
    lab.x = clamp((lab.x - 0.5) * contrast + 0.5, 0.0, 1.0);
    C *= saturation;
    lab.y = C * cos(h);
    lab.z = C * sin(h);
    
    return oklabToLinear(lab);
}

// === MAIN ===
void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 r = u_resolution;
    vec2 p = (fragCoord * 2.0 - r) / r.y;
    
    int colorCount = u_colors_length;
    
    // Early out: no colors -> black
    if (colorCount < 1) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    float t = u_time * 0.3;
    
    // Map time onto a circle so animation seamlessly wraps.
    float looping = step(0.5, u_loop);
    float phase = TAU * u_time / max(u_loop, 0.01);
    float radius = u_loop * u_speed * 0.3 / TAU;
    float tA = sin(phase) * radius;
    float tB = (1.0 - cos(phase)) * radius;
    
    // Seed-based offsets
    vec3 seedOffset = seedRandom(u_seed);
    vec3 seedOffset2 = seedRandom(u_seed + 100.0);
    
    // Golden angle rotation
    float seedAngle = u_seed * GOLDEN_ANGLE;
    vec2 seedPhase = (seedOffset2.xy - 0.5) * TAU;
    
    // Seed-based rotation
    float cs = cos(seedAngle);
    float sn = sin(seedAngle);
    p = mat2(cs, -sn, sn, cs) * p;
    
    // Get dither value
    float dither = getDither(floor(fragCoord / u_pixelRatio), u_ditherMode);
    
    // === TURBULENCE ===
    float totalVal = 0.0;
    float totalWeight = 0.0;
    int turbIter = int(u_turbIter);
    
    float freq = 1.0 / max(u_turbFreq, 0.01);
    
    for (float i = 0.0; i < 4.0; i++) {
        float eph = i / 4.0;
       
        vec2 q = p * u_scale;
        float sq = eph * eph;
        
        if (u_jellify > 0.5) {
            q.yx *= mix(1.0, 0.5, 1.0 - exp(-sq));
        }
        
        float a = seedPhase.x;
        float d = seedPhase.y;
        
        for (int j = 2; j < 13; j++) {
            if (j >= turbIter) break;
            float fj = float(j);
            // When looping, use circular time. Otherwise original t.
            float t1 = mix(t * u_speed, tA, looping);
            float t2 = mix(t * u_speed, tB, looping);
            q += u_turbAmp * sin(q.yx / freq * fj + t1 + vec2(a, d) + seedOffset.xy * fj) / fj;
            a += cos(fj + d * 1.2 + q.x * 2.0 - t1 + seedOffset2.z + t2 * 0.3 * looping);
            d += sin(fj * q.y + a + seedOffset.z + t1 + seedOffset2.y + t2 * 0.3 * looping);
        }
        
        float v = 0.5 + 0.5 * sin(length(q.yx + vec2(a, d) * 0.2) * u_waveFreq + i * i + seedOffset.x);
        float weight = smoothstep(0.0, 0.5, eph) * smoothstep(1.0, 0.5, eph);
        totalVal += v * weight;
        totalWeight += weight;
    }
    
    float val = totalVal / totalWeight;
    val = clamp((val - 0.3) / 0.4, 0.0, 1.0);
    val = pow(val, exp(-u_distBias));
    val = clamp(val + (dither - 0.5) * u_dither, 0.0, 1.0);
    
    vec3 col = paletteN(val, colorCount);
    col *= u_exposure;
    col = applyContrastSaturation(col, u_contrast, u_saturation);
    col = softGamutMap(col);
    col = toSrgb(col);
    
    fragColor = vec4(col, 1.0);
}
`,propertyControls:{colors:{type:k.Array,title:`Colors`,control:{type:k.Color},maxCount:8,defaultValue:[`#00001A`,`#2962FF`,`#40BCFF`,`#FFB8B5`,`#FFC14F`]},seed:{type:k.Number,title:`Seed`,defaultValue:648,min:0,max:1e3,step:1},speed:{type:k.Number,title:`Speed`,defaultValue:.3,min:0,max:2,step:.01},loop:{type:k.Number,title:`Loop`,defaultValue:0,min:0,max:60,step:.5,hiddenWhenUnset:!0,displayStepper:!0},scale:{type:k.Number,title:`Scale`,defaultValue:.42,min:.1,max:2,step:.01},turbAmp:{type:k.Number,title:`Amplitude`,defaultValue:.6,min:0,max:1,step:.01},turbFreq:{type:k.Number,title:`Frequency`,defaultValue:.1,min:.1,max:2,step:.01},turbIter:{type:k.Number,title:`Definition`,defaultValue:7,min:3,max:10,step:1,displayStepper:!0},waveFreq:{type:k.Number,title:`Bands`,defaultValue:3.8,min:.1,max:5,step:.1},distBias:{type:k.Number,title:`Bias`,defaultValue:0,min:-1,max:1,step:.1,hiddenWhenUnset:!0},jellify:{type:k.Boolean,title:`Jellify`,defaultValue:!1,hiddenWhenUnset:!0},ditherMode:{type:k.Enum,title:`Noise`,options:[0,1,2],optionTitles:[`Off`,`Smooth`,`Grain`],defaultValue:0},dither:{type:k.Number,title:`Amount`,defaultValue:.05,min:0,max:.2,step:.01,hidden:e=>e.ditherMode===0},exposure:{type:k.Number,title:`Exposure`,defaultValue:1.1,min:.5,max:2,step:.1,section:`Filters`,displayStepper:!0,hiddenWhenUnset:!0},contrast:{type:k.Number,title:`Contrast`,defaultValue:1.1,min:.5,max:2,step:.1,section:`Filters`,displayStepper:!0,hiddenWhenUnset:!0},saturation:{type:k.Number,title:`Saturation`,defaultValue:1,min:0,max:2,step:.1,section:`Filters`,displayStepper:!0,hiddenWhenUnset:!0}}})})),N,P,F,I,L,R,z,B,V=e((()=>{c(),m(),n(),N=`var(--framer-icon-mask)`,P=o(function(e,t){return a(`svg`,{...e,ref:t,children:e.children})}),F=u.create(P),I=o((e,t)=>{let{animated:n,layoutId:r,children:i,...o}=e;return n?a(F,{...o,layoutId:r,ref:t,children:i}):a(`svg`,{...o,ref:t,children:i})}),L=`<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 18 9 C 18 13.971 13.971 18 9 18 C 4.029 18 0 13.971 0 9 C 0 4.029 4.029 0 9 0 C 11.52 0 13.93 1 15.74 2.74 L 18 5" fill="transparent" height="18px" id="nygFRaqPe" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--js9iwy, 2)" stroke="var(--1m973uw, rgb(0,0,0))" transform="translate(3 3)" width="18px"/><path d="M 5 0 L 5 5 L 0 5" fill="transparent" height="5px" id="ajdO3vrvw" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--js9iwy, 2)" stroke="var(--1m973uw, rgb(0,0,0))" transform="translate(16 3)" width="5px"/></svg>`,R=({color:e,height:t,id:n,width:r,width1:i,...a})=>({...a,JEeZYcamG:i??a.JEeZYcamG??2,P_DcoRcrY:e??a.P_DcoRcrY??`rgb(0, 0, 0)`}),z=g(o(function(e,t){let{style:n,className:r,layoutId:i,variant:o,P_DcoRcrY:s,JEeZYcamG:ee,...c}=R(e),l=ne(`228321436`,L);return a(I,{...c,className:y(`framer-W1uGa`,r),layoutId:i,ref:t,role:`presentation`,style:{"--1m973uw":s,"--js9iwy":ee,...n},viewBox:`0 0 24 24`,children:a(`use`,{href:l})})}),[`.framer-W1uGa { -webkit-mask: ${N}; aspect-ratio: 1; display: block; mask: ${N}; width: 24px; }`],`framer-W1uGa`),z.displayName=`Rotate Cw`,B=z,S(z,{P_DcoRcrY:{defaultValue:`rgb(0, 0, 0)`,hidden:!1,title:`Color`,type:k.Color},JEeZYcamG:{defaultValue:2,displayStepper:!0,hidden:!1,max:16,min:1,title:`Width`,type:k.Number}})}));function H(e,...t){let n={};return t?.forEach(t=>t&&Object.assign(n,e[t])),n}var U,W,G,K,q,J,oe,Y,se,ce,le,X,Z,ue=e((()=>{c(),m(),p(),n(),V(),U=v(B),W=[`r8wjOWl_z`,`MspDnmGdS`],G=`framer-bfH17`,K={MspDnmGdS:`framer-v-1xtvi8z`,r8wjOWl_z:`framer-v-1va6ynr`},w(),q={bounce:.2,delay:0,duration:.4,type:`spring`},J=(e,t)=>`translate(-50%, -50%) ${t}`,oe=({value:e,children:n})=>{let r=s(d),i=e??r.transition,o=t(()=>({...r,transition:i}),[JSON.stringify(i)]);return a(d.Provider,{value:o,children:n})},Y={"Variant 1":`r8wjOWl_z`,"Variant 2":`MspDnmGdS`},se=u.create(i),ce=({click:e,height:t,id:n,width:r,...i})=>({...i,PcddPMZ0H:e??i.PcddPMZ0H,variant:Y[i.variant]??i.variant??`r8wjOWl_z`}),le=(e,t)=>e.layoutDependency?t.join(`-`)+e.layoutDependency:t.join(`-`),X=g(o(function(e,t){let n=r(null),i=t??n,o=l(),{activeLocale:s,setLocale:ee}=ie();T();let{style:c,className:d,layoutId:p,variant:m,PcddPMZ0H:h,...g}=ce(e),{baseVariant:_,classNames:v,clearLoadingGesture:te,gestureHandlers:b,gestureVariant:x,isLoading:ne,setGestureState:S,setVariant:C,variants:w}=O({cycleOrder:W,defaultVariant:`r8wjOWl_z`,ref:i,variant:m,variantClassNames:K}),E=le(e,w),{activeVariantCallback:D,delay:k}=re(_),A=D(async(...e)=>{if(S({isPressed:!1}),h&&await h(...e)===!1)return!1}),ae=D(async(...e)=>{S({isHovered:!0}),C(`MspDnmGdS`)}),j=D(async(...e)=>{S({isHovered:!1}),C(`r8wjOWl_z`)}),M=y(G);return a(f,{id:p??o,children:a(se,{animate:w,initial:!1,children:a(oe,{value:q,children:a(u.div,{...g,...b,className:y(M,`framer-1va6ynr`,d,v),"data-border":!0,"data-framer-name":`Variant 1`,"data-highlight":!0,layoutDependency:E,layoutId:`r8wjOWl_z`,onMouseEnter:ae,onTap:A,ref:i,style:{"--border-bottom-width":`0.88px`,"--border-color":`rgb(71, 71, 71)`,"--border-left-width":`0.88px`,"--border-right-width":`0.88px`,"--border-style":`solid`,"--border-top-width":`0.88px`,"--corner-shape-fallback":.566,backgroundColor:`rgba(0, 0, 0, 0.4)`,borderBottomLeftRadius:`calc(9.68px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,borderBottomRightRadius:`calc(9.68px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,borderTopLeftRadius:`calc(9.68px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,borderTopRightRadius:`calc(9.68px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,boxShadow:`0px 0.3621759214656777px 1.231398132983304px 0px rgba(0, 0, 0, 0.03), 0px 3px 10.2px 0px rgba(0, 0, 0, 0.25)`,cornerShape:`superellipse(2)`,...c},variants:{MspDnmGdS:{"--border-color":`rgb(255, 255, 255)`}},...H({MspDnmGdS:{"data-framer-name":`Variant 2`,onMouseLeave:j}},_,x),children:a(B,{animated:!0,className:`framer-gyh10n`,layoutDependency:E,layoutId:`hwQizbuQE`,style:{"--1m973uw":`rgb(255, 255, 255)`,"--js9iwy":2.5},transformTemplate:J})})})})})}),[`@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,`.framer-bfH17.framer-1j85sor, .framer-bfH17 .framer-1j85sor { display: block; }`,`.framer-bfH17.framer-1va6ynr { cursor: pointer; height: 39px; overflow: visible; position: relative; width: 39px; }`,`.framer-bfH17 .framer-gyh10n { aspect-ratio: 1 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 22px); left: 51%; position: absolute; top: 51%; width: 21px; }`,`.framer-bfH17.framer-v-1xtvi8z.framer-1va6ynr { height: 40px; width: 40px; }`,`.framer-bfH17.framer-v-1xtvi8z .framer-gyh10n { height: var(--framer-aspect-ratio-supported, 21px); }`,`.framer-bfH17[data-border="true"]::after, .framer-bfH17 [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; corner-shape: inherit; pointer-events: none; }`],`framer-bfH17`),Z=X,X.displayName=`Smart preview button`,X.defaultProps={height:39,width:39},S(X,{variant:{options:[`r8wjOWl_z`,`MspDnmGdS`],optionTitles:[`Variant 1`,`Variant 2`],title:`Variant`,type:k.Enum},PcddPMZ0H:{title:`Click`,type:k.EventHandler}}),b(X,[{explicitInter:!0,fonts:[]},...U],{supportsExplicitInterCodegen:!0})}));function Q(e,...t){let n={};return t?.forEach(t=>t&&Object.assign(n,e[t])),n}var de,fe,pe,me,he,ge,_e,ve,ye,be,xe,Se,Ce,we,Te,$,Ee,De=e((()=>{c(),m(),p(),n(),ae(),M(),ue(),de=x(te(D)),fe=v(Z),pe=[`f8MXDque6`,`eFsVGpeGr`,`DpM__LcSX`,`RMTq8fJIa`],me=`framer-JSpbO`,he={DpM__LcSX:`framer-v-1lr2pzs`,eFsVGpeGr:`framer-v-xbdml5`,f8MXDque6:`framer-v-n1usa4`,RMTq8fJIa:`framer-v-tah8bv`},ge={bounce:.2,delay:0,duration:.4,type:`spring`},_e={opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,transition:{delay:0,duration:1,ease:[.7,.01,.21,.92],type:`tween`},x:0,y:0},ve={opacity:.001,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:0},ye=(e,t)=>`translateY(-50%) ${t}`,be=(...e)=>{for(let t of e)if(t&&typeof t==`string`)return t},xe=({value:e,children:n})=>{let r=s(d),i=e??r.transition,o=t(()=>({...r,transition:i}),[JSON.stringify(i)]);return a(d.Provider,{value:o,children:n})},Se={"Variant 1":`f8MXDque6`,"Variant 2":`eFsVGpeGr`,"Variant 3":`DpM__LcSX`,"Variant 4":`RMTq8fJIa`},Ce=u.create(i),we=({button:e,height:t,id:n,rotation:r,width:i,...a})=>({...a,pviToLap1:e??a.pviToLap1??!0,variant:Se[a.variant]??a.variant??`f8MXDque6`,VCnWGcJkb:r??a.VCnWGcJkb}),Te=(e,t)=>e.layoutDependency?t.join(`-`)+e.layoutDependency:t.join(`-`),$=g(o(function(e,t){let n=r(null),i=t??n,o=l(),{activeLocale:s,setLocale:c}=ie(),d=T(),{style:p,className:m,layoutId:g,variant:_,pviToLap1:v,VCnWGcJkb:te,...b}=we(e),{baseVariant:x,classNames:ne,clearLoadingGesture:S,gestureHandlers:C,gestureVariant:w,isLoading:k,setGestureState:ae,setVariant:M,variants:N}=O({cycleOrder:pe,defaultVariant:`f8MXDque6`,ref:i,variant:_,variantClassNames:he}),P=Te(e,N),{activeVariantCallback:F,delay:I}=re(x),L=F(async(...e)=>{M(`eFsVGpeGr`)}),R=F(async(...e)=>{M(`DpM__LcSX`)}),z=F(async(...e)=>{M(`RMTq8fJIa`)}),B=F(async(...e)=>{M(`f8MXDque6`)}),V=y(me),H=()=>x===`RMTq8fJIa`,U=()=>![`DpM__LcSX`,`RMTq8fJIa`].includes(x),W=()=>x===`DpM__LcSX`;return a(f,{id:g??o,children:a(Ce,{animate:N,initial:!1,children:a(xe,{value:ge,children:ee(u.div,{...b,...C,className:y(V,`framer-n1usa4`,m,ne),"data-framer-name":`Variant 1`,layoutDependency:P,layoutId:`f8MXDque6`,ref:i,style:{backgroundColor:`var(--token-0e92647d-7873-4964-8059-2ea511ebf473, rgb(0, 0, 0))`,...p},variants:{DpM__LcSX:{backgroundColor:`rgba(0, 0, 0, 0)`}},...Q({DpM__LcSX:{"data-framer-name":`Variant 3`},eFsVGpeGr:{"data-framer-name":`Variant 2`},RMTq8fJIa:{"data-framer-name":`Variant 4`}},x,w),children:[H()&&a(D,{className:`framer-1mty32a-container`,layoutDependency:P,layoutId:`YlKjvB6iE-container`,rendersWithMotion:!0,style:{mask:`linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%) add`,WebkitMask:`linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%) add`},children:a(h,{__fromCanvasComponent:!0,animated:A.animated,fallbackImage:`https://framerusercontent.com/images/WrOK6Ii8O4zDqmqtr1VEWV9d6zA.png?scale-down-to=1200&width=2400&height=1658`,feedbackLoop:A.feedbackLoop,fragmentShader:A.fragment,height:`100%`,heightmapSource:A.heightmapSource,mode:`progressive`,mouse:A.mouse&&{enabled:A.mouse===`enabledByDefault`},resolutionScale:A.resolutionScale,skipInitialFallback:!0,uniforms:{u_blendAmount:{type:`number`,value:.54},u_colors:{type:`array`,value:[`rgb(255, 54, 36)`,`rgb(158, 171, 255)`,`rgb(60, 0, 255)`,`rgb(226, 158, 255)`]},u_maskSoftness:{type:`number`,value:.74},u_seed:{type:`number`,value:32},u_waveAmplitude:{type:`number`,value:2.1},u_waveAngle:{type:`number`,value:105},u_waveFreqX:{type:`number`,value:.9},u_waveFreqY:{type:`number`,value:6},u_waveSpeed:{type:`number`,value:1.5}},vertexShader:A.vertex,width:`100%`})}),U()&&a(de,{__perspectiveFX:!1,__smartComponentFX:!0,__targetOpacity:1,animate:_e,className:`framer-lh02uz-container`,"data-framer-appear-id":`lh02uz`,initial:ve,layoutDependency:P,layoutId:`vAcPUxuqz-container`,optimized:!0,rendersWithMotion:!0,style:{mask:`linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%) add`,WebkitMask:`linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%) add`},children:a(h,{__fromCanvasComponent:!0,animated:j.animated,fallbackImage:`https://framerusercontent.com/images/9DmJjSVLg5BBuqnAiTGPoup7g.png?scale-down-to=1200&width=2400&height=1658`,feedbackLoop:j.feedbackLoop,fragmentShader:j.fragment,height:`100%`,heightmapSource:j.heightmapSource,mode:`progressive`,mouse:j.mouse&&{enabled:j.mouse===`enabledByDefault`},resolutionScale:j.resolutionScale,skipInitialFallback:!0,uniforms:{u_colors:{type:`array`,value:[`rgb(0, 0, 26)`,`rgb(0, 67, 250)`,`rgb(0, 221, 255)`,`rgb(0, 94, 255)`,`rgb(0, 255, 255)`]},u_contrast:{type:`number`,value:1.1},u_distBias:{type:`number`,value:0},u_dither:{type:`number`,value:.1},u_ditherMode:{type:`enum`,value:1},u_exposure:{type:`number`,value:1.1},u_jellify:{type:`boolean`,value:!1},u_loop:{type:`number`,value:0},u_saturation:{type:`number`,value:1},u_scale:{type:`number`,value:.1},u_seed:{type:`number`,value:689},u_speed:{type:`number`,value:.14},u_turbAmp:{type:`number`,value:.6},u_turbFreq:{type:`number`,value:.1},u_turbIter:{type:`number`,value:7},u_waveFreq:{type:`number`,value:3.8}},vertexShader:j.vertex,width:`100%`,...Q({eFsVGpeGr:{fallbackImage:`https://framerusercontent.com/images/BdiH7akWUbexZ6eYK613ePp26s.png?scale-down-to=1200&width=2400&height=1658`,uniforms:{u_colors:{type:`array`,value:[`rgb(0, 0, 26)`,`rgb(98, 255, 0)`,`rgb(13, 255, 0)`,`rgb(255, 98, 0)`,`rgb(255, 0, 0)`]},u_contrast:{type:`number`,value:1.1},u_distBias:{type:`number`,value:0},u_dither:{type:`number`,value:.1},u_ditherMode:{type:`enum`,value:1},u_exposure:{type:`number`,value:1.1},u_jellify:{type:`boolean`,value:!1},u_loop:{type:`number`,value:0},u_saturation:{type:`number`,value:1},u_scale:{type:`number`,value:.28},u_seed:{type:`number`,value:689},u_speed:{type:`number`,value:.79},u_turbAmp:{type:`number`,value:0},u_turbFreq:{type:`number`,value:2},u_turbIter:{type:`number`,value:7},u_waveFreq:{type:`number`,value:4.5}}}},x,w)})}),v!==!1&&a(E,{height:39,y:(d?.y||0)+((d?.height||829)*.6887816646562125-19.5),children:a(D,{className:`framer-16hshk6-container`,layoutDependency:P,layoutId:`gxiASK2O2-container`,nodeId:`gxiASK2O2`,rendersWithMotion:!0,scopeId:`oq94bLmfY`,style:{rotate:te},transformTemplate:ye,children:a(Z,{height:`100%`,id:`gxiASK2O2`,layoutId:`gxiASK2O2`,PcddPMZ0H:L,variant:be(`r8wjOWl_z`),width:`100%`,...Q({DpM__LcSX:{PcddPMZ0H:z},eFsVGpeGr:{PcddPMZ0H:R},RMTq8fJIa:{PcddPMZ0H:B}},x,w)})})}),W()&&a(D,{className:`framer-1ajknv0-container`,layoutDependency:P,layoutId:`LFteuI7R_-container`,rendersWithMotion:!0,style:{mask:`linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%) add`,WebkitMask:`linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%) add`},children:a(h,{__fromCanvasComponent:!0,animated:j.animated,fallbackImage:`https://framerusercontent.com/images/SjmpQUm0bMaEFxzBK6aKPzwvXy4.png?scale-down-to=1200&width=2400&height=1658`,feedbackLoop:j.feedbackLoop,fragmentShader:j.fragment,height:`100%`,heightmapSource:j.heightmapSource,mode:`progressive`,mouse:j.mouse&&{enabled:j.mouse===`enabledByDefault`},resolutionScale:j.resolutionScale,skipInitialFallback:!0,uniforms:{u_colors:{type:`array`,value:[`rgb(255, 98, 0)`,`rgb(255, 72, 0)`,`rgb(255, 0, 0)`,`rgb(0, 0, 0)`,`rgb(0, 0, 0)`,`rgb(255, 0, 0)`]},u_contrast:{type:`number`,value:1.1},u_distBias:{type:`number`,value:.8},u_dither:{type:`number`,value:.05},u_ditherMode:{type:`enum`,value:2},u_exposure:{type:`number`,value:1.1},u_jellify:{type:`boolean`,value:!1},u_loop:{type:`number`,value:0},u_saturation:{type:`number`,value:1},u_scale:{type:`number`,value:.1},u_seed:{type:`number`,value:380},u_speed:{type:`number`,value:.73},u_turbAmp:{type:`number`,value:.07},u_turbFreq:{type:`number`,value:.31},u_turbIter:{type:`number`,value:7},u_waveFreq:{type:`number`,value:5}},vertexShader:j.vertex,width:`100%`})})]})})})})}),[`@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,`.framer-JSpbO.framer-yvbqo2, .framer-JSpbO .framer-yvbqo2 { display: block; }`,`.framer-JSpbO.framer-n1usa4 { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 829px; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 1200px; }`,`.framer-JSpbO .framer-1mty32a-container { flex: 1 0 0px; height: 100%; pointer-events: none; position: relative; width: 1px; }`,`.framer-JSpbO .framer-lh02uz-container { flex: 1 0 0px; height: 100%; pointer-events: none; position: relative; width: 1px; z-index: 1; }`,`.framer-JSpbO .framer-16hshk6-container { flex: none; height: auto; position: absolute; right: 32px; top: 69%; width: auto; z-index: 10; }`,`.framer-JSpbO .framer-1ajknv0-container { bottom: 0px; flex: none; left: 0px; position: absolute; right: 0px; top: 0px; z-index: 1; }`],`framer-JSpbO`),Ee=$,$.displayName=`Shaders`,$.defaultProps={height:829,width:1200},S($,{variant:{options:[`f8MXDque6`,`eFsVGpeGr`,`DpM__LcSX`,`RMTq8fJIa`],optionTitles:[`Variant 1`,`Variant 2`,`Variant 3`,`Variant 4`],title:`Variant`,type:k.Enum},pviToLap1:{defaultValue:!0,title:`Button`,type:k.Boolean},onpviToLap1Change:{changes:`pviToLap1`,type:k.ChangeHandler},VCnWGcJkb:{defaultValue:0,title:`Rotation`,type:k.Number,unit:`°`},onVCnWGcJkbChange:{changes:`VCnWGcJkb`,type:k.ChangeHandler}}),b($,[{explicitInter:!0,fonts:[]},...fe],{supportsExplicitInterCodegen:!0}),$.loader={load:(e,t)=>(t.locale,Promise.allSettled([_(Z,{},t)]))}}));export{Ee as n,De as t};
//# sourceMappingURL=oq94bLmfY.Bl3mFpyM.mjs.map