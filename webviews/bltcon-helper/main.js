// Constants:
const WIDTH = 64;
const HEIGHT = 64;
const FILL_COLOR = [0, 180, 0, 255];
const BG_COLOR = [255, 255, 255, 255];

const PRESETS = {
    clear: [0x100, 0],
    fill: [0x9f0, 0x12],
    copy: [0x9f0, 0],
    mask: [0xdc0, 0],
    bob: [0xfea, 0],
};

// DOM Elements:
const elements = {
    // bltcon0 flags:
    NANBNC: document.getElementById('MINTERM0'),
    NANBC: document.getElementById('MINTERM1'),
    NABNC: document.getElementById('MINTERM2'),
    NABC: document.getElementById('MINTERM3'),
    ANBNC: document.getElementById('MINTERM4'),
    ANBC: document.getElementById('MINTERM5'),
    ABNC: document.getElementById('MINTERM6'),
    ABC: document.getElementById('MINTERM7'),
    DEST: document.getElementById('useDestD'),
    SRCC: document.getElementById('useSourceC'),
    SRCB: document.getElementById('useSourceB'),
    SRCA: document.getElementById('useSourceA'),
    // bltcon1 flags:
    BLITREVERSE: document.getElementById('DESC'),
    FILL_OR: document.getElementById('IFE'),
    FILL_XOR: document.getElementById('EFE'),
    // source shifts:
    aShift: document.getElementById('ASHIFT'),
    bShift: document.getElementById('BSHIFT'),
    // registers:
    bltcon0: document.getElementById('BLTCON0'),
    bltcon1: document.getElementById('BLTCON1'),
    bltcon0Exp: document.getElementById('BLTCON0Exp'),
    bltcon1Exp: document.getElementById('BLTCON1Exp'),
    // canvases:
    canvasA: document.getElementById('ACvs'),
    canvasB: document.getElementById('BCvs'),
    canvasC: document.getElementById('CCvs'),
    canvasD: document.getElementById('DCvs'),
};

const state = {
    bltcon0: {
        NANBNC: false,
        NANBC: false,
        NABNC: false,
        NABC: false,
        ANBNC: false,
        ANBC: false,
        ABNC: false,
        ABC: false,
        DEST: false,
        SRCC: false,
        SRCB: false,
        SRCA: false,
    },
    bltcon1: {
        LINEMODE: false, // unused
        BLITREVERSE: false,
        FILL_CARRYIN: false, // unused
        FILL_OR: false,
        FILL_XOR: false,
    },
    aShift: 0,
    bShift: 0,
};

function init() {
    loadPreset('bob');
    initEventHandlers();
}

function initEventHandlers() {
    // Flag checkboxes:
    for (let key in state.bltcon0) {
        elements[key].addEventListener('change', (e) => {
            state.bltcon0[key] = e.target.checked;
            renderAllChannels();
            setRegistersFromState();
        });
    }
    for (let key in state.bltcon1) {
        if (elements[key]) {
            elements[key].addEventListener('change', (e) => {
                state.bltcon1[key] = e.target.checked;
                setRegistersFromState();
            });
        }
    }

    // Shift inputs:
    elements.aShift.addEventListener('change', (e) => {
        state.aShift = normalizeShift(e.target.value);
        e.target.value = state.aShift;
        renderD();
        setRegistersFromState();
    });
    elements.bShift.addEventListener('change', (e) => {
        state.bShift = normalizeShift(e.target.value);
        e.target.value = state.bShift;
        renderD();
        setRegistersFromState();
    });

    // Register inputs:
    const onRegisterChange = () => {
        const bltcon0 = parseHex(elements.bltcon0.value);
        const bltcon1 = parseHex(elements.bltcon1.value);
        setStateFromRegisters(bltcon0, bltcon1);
    };
    elements.bltcon0.addEventListener('change', onRegisterChange);
    elements.bltcon1.addEventListener('change', onRegisterChange);

    // Preset buttons:
    for (const button of document.getElementsByClassName('preset')) {
        button.addEventListener('click', (e) => loadPreset(e.target.value));
    }

    // Rows: make whole row clickable
    for (const row of document.querySelectorAll('tbody tr')) {
        const input = row.querySelector('input');
        const event = new CustomEvent('change', { target: input });
        row.addEventListener('click', (e) => {
            if (e.target !== input) {
                input.checked = !input.checked;
                input.dispatchEvent(event);
            }
        });
    }
}

// Parse hex string with optional '$' prefix to number
function parseHex(v) {
    if (v[0] == '$') v = v.substring(1);
    return parseInt(v, 16);
}

// Clamp shift to 0-15
function normalizeShift(value) {
    let v = parseInt(value, 10);
    if (!v || v < 0) v = 0;
    if (v > 15) v = 15;
    return v;
}

// Pixel data - patterns for each channel when enabled:

// A Data - triangle
let aData = [];
for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
        let maxDistToCenter = y / 2;
        let curX = Math.abs(x - WIDTH / 2);
        aData.push(curX < maxDistToCenter);
    }
}

// B Data - circle
let bData = [];
let radius = 25;
for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
        let xd = x - WIDTH / 2;
        let yd = y - HEIGHT / 2;
        let d = Math.sqrt(xd * xd + yd * yd);
        bData.push(d < radius);
    }
}

// C Data - lines
let cData = [];
for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
        cData.push((y & 7) === 0);
    }
}

// Render channel canvases:

function renderAllChannels() {
    renderA();
    renderB();
    renderC();
    renderD();
}

function renderA() {
    const context = elements.canvasA.getContext('2d');
    state.bltcon0.SRCA ? fillPixels(context, aData) : fillNoise(context);
}

function renderB() {
    const context = elements.canvasB.getContext('2d');
    state.bltcon0.SRCB ? fillPixels(context, bData) : fillNoise(context);
}

function renderC() {
    const context = elements.canvasC.getContext('2d');
    state.bltcon0.SRCC ? fillPixels(context, cData) : fillNoise(context);
}

function renderD() {
    const context = elements.canvasD.getContext('2d');
    state.bltcon0.DEST
        ? fillPixels(context, calculateDestData())
        : fillNoise(context);
}

// Calculate pixel data for destination channel base on minterms etc.
function calculateDestData() {
    const dData = [];
    let ofs = 0;
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let aOfs = Math.max(0, ofs - state.aShift);
            let bOfs = Math.max(0, ofs - state.bShift);
            let A = state.bltcon0.SRCA ? aData[aOfs] : Math.random() > 0.5;
            let B = state.bltcon0.SRCB ? bData[bOfs] : Math.random() > 0.5;
            let C = state.bltcon0.SRCC ? cData[ofs] : Math.random() > 0.5;

            let lit = false;
            lit ||= state.bltcon0.NANBNC && !A && !B && !C;
            lit ||= state.bltcon0.NANBC && !A && !B && C;
            lit ||= state.bltcon0.NABNC && !A && B && !C;
            lit ||= state.bltcon0.NABC && !A && B && C;
            lit ||= state.bltcon0.ANBNC && A && !B && !C;
            lit ||= state.bltcon0.ANBC && A && !B && C;
            lit ||= state.bltcon0.ABNC && A && B && !C;
            lit ||= state.bltcon0.ABC && A && B && C;

            dData[ofs++] = lit;
        }
    }
    return dData;
}

// Noise for disabled channel
function fillNoise(context) {
    let imageData = context.createImageData(WIDTH, HEIGHT);
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, WIDTH, HEIGHT);
    let ofs = 0;
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            imageData.data[ofs++] = 200 + Math.floor(55 * Math.random());
            imageData.data[ofs++] = 200 + Math.floor(55 * Math.random());
            imageData.data[ofs++] = 200 + Math.floor(55 * Math.random());
            imageData.data[ofs++] = 255;
        }
    }
    context.putImageData(imageData, 0, 0);
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.fillText('DMA OFF', WIDTH / 2, HEIGHT / 2 + 3);
}

// Fill context with pixel data (array of booleans per pixel)
function fillPixels(context, data) {
    let imageData = context.createImageData(WIDTH, HEIGHT);
    let ofs = 0;
    for (let lit of data) {
        const col = lit ? FILL_COLOR : BG_COLOR;
        imageData.data[ofs++] = col[0];
        imageData.data[ofs++] = col[1];
        imageData.data[ofs++] = col[2];
        imageData.data[ofs++] = col[3];
    }
    context.putImageData(imageData, 0, 0);
}

function setRegistersFromState() {
    let bltcon0 = state.aShift << 12;
    let i = 1;
    for (let key in state.bltcon0) {
        if (state.bltcon0[key]) bltcon0 |= i;
        i = i << 1;
    }
    let bltcon1 = state.bShift << 12;
    i = 1;
    for (let key in state.bltcon1) {
        if (state.bltcon1[key]) bltcon1 |= i;
        i = i << 1;
    }

    updateRegisterInputs(bltcon0, bltcon1);
    updateExpressionText();
}

function setStateFromRegisters(bltcon0, bltcon1) {
    let i = 1;
    for (let key in state.bltcon0) {
        state.bltcon0[key] = bltcon0 & i;
        i = i << 1;
        elements[key].checked = state.bltcon0[key];
    }
    i = 1;
    for (let key in state.bltcon1) {
        state.bltcon1[key] = bltcon1 & i;
        i = i << 1;
        if (elements[key]) {
            elements[key].checked = state.bltcon1[key];
        }
    }

    state.aShift = bltcon0 >> 12;
    state.bShift = bltcon1 >> 12;
    elements.aShift.value = state.aShift;
    elements.bShift.value = state.bShift;

    renderAllChannels();
    updateExpressionText();
}

function updateRegisterInputs(bltcon0, bltcon1) {
    elements.bltcon0.value = '$' + bltcon0.toString(16);
    elements.bltcon1.value = '$' + bltcon1.toString(16);
}

function updateExpressionText() {
    elements.bltcon0Exp.innerHTML = buildExp(state.bltcon0, state.aShift);
    elements.bltcon1Exp.innerHTML = buildExp(state.bltcon1, state.bShift);
}

function buildExp(flags, shift) {
    const components = Object.keys(flags).filter((k) => flags[k]);
    if (shift) {
        components.push('(' + shift + '<<12)');
    }
    return components.join('!');
}

function loadPreset(name) {
    const [ bltcon0, bltcon1 ] = PRESETS[name];
    updateRegisterInputs(bltcon0, bltcon1);
    setStateFromRegisters(bltcon0, bltcon1);
}

window.addEventListener('load', init);
