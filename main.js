function rand_seed() {
    let s = [];
    for (var i = 0; i < 8; ++i) {
        let n = Math.floor(Math.random() * 16);
        s.push(n);
    }
    return s
}

function draw() {
    for(var j = 0; j < 16; j+=4) {
        let seed = rand_seed();
        for(var i = j; i < j + 4; i++) {
            // flip some bits.
            for(var x = 0; x < 3; ++x) {
                let bit = 2 ** Math.floor(Math.random() * 4);
                let item = Math.floor(Math.random() * 8);
                seed[item] ^= bit;
            }
            var ctx = document.getElementById('canvas' + i).getContext('2d');
            drawItem(ctx, seed);
//            console.log(i, seed)
        }
    }
}


let white = '#fff';
let light = '#ccc';
let dark = '#666';
let black = '#000';
let pi = Math.PI;
function deg(x) { return x / 90 * 2 * Math.PI }
function turn(x) { return 2 * Math.PI / x }
function gray(x) {
    return `rgba(${x}, ${x}, ${x}, 1)`;
}

function shade(x) {
    if(x < 1) { return white }
    if(x < 2) { return light }
    if(x < 3) { return dark }
    return black
}

function drawItem(ctx, seed) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 200, 200);

    ctx.save();
    drawLines(ctx, seed);
    ctx.restore();

    // split into 8 nibbles
    ctx.strokeStyle = 'none';
    for(let i = 0; i < 8; ++i) {
        let a = seed[i] % 4;
        let b = (seed[i] - a) / 4;
        ctx.beginPath();
        ctx.arc(12.5 + i * 25, 12.5, 11, 0, Math.PI * 2);
        ctx.fillStyle = shade(a);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(12.5 + i * 25, 12.5, 7, 0, Math.PI * 2);
        ctx.fillStyle = shade(b);
        ctx.fill();
    }
    console.log(seed.map((x) => x.toString(16)).reduce((x, y) => x + y));
}

function drawLines(ctx, seed) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    ctx.lineWidth = 4;
    ctx.strokeStyle = light;
    ctx.beginPath();
    for (var x = 0; x <= width; x += width / 8) {
        ctx.lineTo(x, ((seed[0] + seed[1] * 2**4 + seed[2] * 2**8 + x) ** 2.1) % height);
    }
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = dark;
    ctx.beginPath();
    for (var x = 0; x <= width; x += width / 8) {
        ctx.lineTo(x, ((seed[3] + seed[4] * 2**4 + seed[5] * 2**8 + x) ** 3.1) % height);
    }
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.strokeStyle = black;
    ctx.beginPath();
    for (var x = 0; x <= width; x += width / 8) {
        ctx.lineTo(x, ((seed[5] + seed[6] * 2**4 + seed[7] * 2**8 + x) ** 4.1) % height);
    }
    ctx.stroke();
}

function drawPetals(ctx, count, bias, sway, width, shade) {
    ctx.save();
    let turns = count;
    ctx.fillStyle = shade;
    for (let i = 0; i < turns; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-width + sway, bias, 0, 1);
        ctx.quadraticCurveTo(width + sway, bias, 0, 0);
        ctx.lineTo(0, 1);
        ctx.lineWidth = 0.02;
        ctx.strokeStyle = black;
        ctx.fill();
        ctx.rotate(Math.PI * 2 / turns);
    }
    ctx.restore();
}

function drawBloom(ctx, seed) {
    var size = Math.min(ctx.canvas.width, ctx.canvas.height);

    ctx.translate(size / 2, size / 2);
    ctx.scale(size / 2, size / 2);

    for (let s = 0; s < 4; s++) {
        ctx.scale(0.85, -0.85);
        drawPetals(ctx,
            Math.floor(seed[s] / 4) + 6,
            (Math.floor(seed[s + 4] % 4) + 1) / 5,
            (seed[s] % 4 - 1) / 8,
            (Math.floor(seed[s + 4] / 4) + 1) / 9,
            //seed[s] % 2 == 1 ? dark : light
            `rgba(${s * 64}, ${s * 64}, ${s * 64}, 1.0)`
        );
    }
}

function drawDial(ctx, seed) {
    var size = Math.min(ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < 4; i++) {
        ctx.lineWidth = size / 20;
        ctx.strokeStyle = dark;
        ctx.beginPath();
        let s = Math.PI * 2 * seed[i] / 16;
        let l = Math.PI * 2 * (seed[i + 4] + 1) / 17;
        ctx.arc(size / 2, size / 2, size / 2 / 6 * (i + 3) - ctx.lineWidth, s, s + l);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = light;
        ctx.beginPath();
        s = Math.PI * 2 * seed[i] / 16;
        l = Math.PI * 2 * (seed[i + 4] + 1) / 17;
        ctx.arc(size / 2, size / 2, size / 2 / 6 * (i + 3) - ctx.lineWidth, s, s + l);
        ctx.stroke();
    }
}