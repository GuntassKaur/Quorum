// QUORUM NEURAL ENGINE v10.5
// LIVES PROTECTED: 105,000

let SENSOR_DATA = {
    avgSafety: 98.4,
    totalRisk: 12,
    currentMode: 'football',
    emergency: false,
    drone: false,
    zones: [
        { id: 'A1', name: 'North Stand', x: 0.5, y: 0.21, crowd: 42, o2: 20.8, temp: 22.4, risk: 'LOW' },
        { id: 'B2', name: 'East Block', x: 0.83, y: 0.5, crowd: 58, o2: 20.2, temp: 23.1, risk: 'MEDIUM' },
        { id: 'C3', name: 'West Block', x: 0.17, y: 0.5, crowd: 62, o2: 19.8, temp: 23.5, risk: 'MEDIUM' },
        { id: 'D4', name: 'South Stand', x: 0.5, y: 0.70, crowd: 85, o2: 19.4, temp: 26.2, risk: 'HIGH' },
        { id: 'E5', name: 'Gate Plaza', x: 0.5, y: 0.85, crowd: 35, o2: 20.9, temp: 21.0, risk: 'LOW' },
        { id: 'F6', name: 'VIP Center', x: 0.5, y: 0.49, crowd: 24, o2: 20.9, temp: 22.0, risk: 'LOW' }
    ]
};

const RISK_LEVELS = {
    'LOW': { color: '#00b496', threshold: 0 },
    'MEDIUM': { color: '#00dcb4', threshold: 50 },
    'HIGH': { color: '#ff7800', threshold: 75 },
    'CRITICAL': { color: '#ff1e00', threshold: 90 }
};

function updateSensors() {
    if (SENSOR_DATA.emergency) return;
    
    SENSOR_DATA.zones.forEach(zone => {
        const factor = Math.random() > 0.5 ? 1 : -1;
        zone.crowd += (Math.random() * 0.8 * factor);
        zone.crowd = Math.max(10, Math.min(100, zone.crowd));
        
        zone.o2 -= (zone.crowd / 1000) * Math.random();
        zone.o2 = Math.max(18.5, Math.min(21.0, zone.o2));
        
        if (zone.crowd > 90 || zone.o2 < 19.2) zone.risk = 'CRITICAL';
        else if (zone.crowd > 75 || zone.o2 < 19.5) zone.risk = 'HIGH';
        else if (zone.crowd > 50) zone.risk = 'MEDIUM';
        else zone.risk = 'LOW';
    });

    const avg = SENSOR_DATA.zones.reduce((s, z) => s + (100 - (z.risk === 'CRITICAL' ? 40 : z.risk === 'HIGH' ? 20 : z.risk === 'MEDIUM' ? 5 : 0)), 0) / 6;
    SENSOR_DATA.avgSafety = avg;
    SENSOR_DATA.totalRisk = SENSOR_DATA.zones.filter(z => z.risk === 'HIGH' || z.risk === 'CRITICAL').length * 24 + Math.floor(Math.random()*10);

    renderAll();
}

function renderAll() {
    const scoreVal = document.getElementById('safety-score');
    const riskVal = document.getElementById('lives-risk');
    if(scoreVal) scoreVal.innerText = SENSOR_DATA.avgSafety.toFixed(1);
    if(riskVal) riskVal.innerText = SENSOR_DATA.totalRisk;
    
    renderHeatmap();
    renderVitals();
    updateAIDecision();
}

function renderHeatmap() {
    const svg = document.getElementById('heatmap-svg');
    const labels = document.getElementById('labels-container');
    if(!svg || !labels) return;

    svg.innerHTML = `
        <defs>
            <filter id="hblur"><feGaussianBlur stdDeviation="1.5"/></filter>
            <filter id="hblur2"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>`;
    labels.innerHTML = '';
    
    const W = svg.clientWidth || svg.parentNode.offsetWidth;
    const H = svg.clientHeight || svg.parentNode.offsetHeight;

    SENSOR_DATA.zones.forEach((zone, idx) => {
        const riskColor = RISK_LEVELS[zone.risk].color;
        let pathD = "";
        let coreShape = "";

        if (zone.id === 'A1') {
            pathD = `M${W*0.33},${H*0.21} Q${W*0.50},${H*0.10} ${W*0.67},${H*0.21} L${W*0.61},${H*0.33} Q${W*0.50},${H*0.27} ${W*0.39},${H*0.33} Z`;
        } else if (zone.id === 'B2') {
            pathD = `M${W*0.68},${H*0.27} L${W*0.85},${H*0.34} Q${W*0.87},${H*0.50} ${W*0.83},${H*0.63} L${W*0.68},${H*0.56} Q${W*0.70},${H*0.42} ${W*0.68},${H*0.27} Z`;
        } else if (zone.id === 'C3') {
            pathD = `M${W*0.32},${H*0.27} L${W*0.15},${H*0.34} Q${W*0.13},${H*0.50} ${W*0.17},${H*0.63} L${W*0.32},${H*0.56} Q${W*0.30},${H*0.42} ${W*0.32},${H*0.27} Z`;
        } else if (zone.id === 'D4') {
            pathD = `M${W*0.33},${H*0.73} Q${W*0.50},${H*0.83} ${W*0.67},${H*0.73} L${W*0.61},${H*0.61} Q${W*0.50},${H*0.67} ${W*0.39},${H*0.61} Z`;
        } else if (zone.id === 'F6') {
            coreShape = `<ellipse cx="${W*0.50}" cy="${H*0.49}" rx="${W*0.09}" ry="${H*0.075}" `;
        } else if (zone.id === 'E5') {
            coreShape = `<rect x="${W*0.37}" y="${H*0.82}" width="${W*0.26}" height="${H*0.09}" rx="6" `;
        }

        const breathStyle = `style="animation: zone-breathe 2.8s infinite alternate; animation-delay: ${idx * 0.55}s"`;
        
        if (pathD) {
            svg.innerHTML += `<path d="${pathD}" fill="${riskColor}" opacity="0.18" filter="url(#hblur2)" ${breathStyle}/>`;
            svg.innerHTML += `<path d="${pathD}" fill="${riskColor}" opacity="0.48" filter="url(#hblur)" ${breathStyle}/>`;
        } else {
            svg.innerHTML += `${coreShape} fill="${riskColor}" opacity="0.18" filter="url(#hblur2)" ${breathStyle}/>`;
            svg.innerHTML += `${coreShape} fill="${riskColor}" opacity="0.48" filter="url(#hblur)" ${breathStyle}/>`;
        }

        const lbl = document.createElement('div');
        lbl.className = 'zone-label';
        const labelX = (zone.id === 'B2'? 79 : zone.id === 'C3'? 21 : 50);
        const labelY = (zone.id === 'A1'? 14 : zone.id === 'B2' || zone.id === 'C3'? 44 : zone.id === 'D4'? 77 : zone.id === 'F6'? 47 : 85);
        lbl.style.left = labelX + '%';
        lbl.style.top = labelY + '%';
        lbl.style.color = riskColor;
        lbl.style.border = `1px solid ${riskColor}59`;
        lbl.style.borderLeft = `3px solid ${riskColor}`;
        const prefix = (zone.risk ==='CRITICAL' || zone.risk === 'HIGH') ? "⚠ " : "";
        lbl.innerText = `${prefix}${zone.id} ${zone.name} ${Math.round(zone.crowd)}% O2:${zone.o2.toFixed(1)}%`;
        labels.appendChild(lbl);
    });
}

function renderVitals() {
    const hud = document.getElementById('vitals-hud');
    if(!hud) return;
    hud.innerHTML = '';
    SENSOR_DATA.zones.forEach(zone => {
        const riskColor = RISK_LEVELS[zone.risk].color;
        const o2Color = zone.o2 < 19.5 ? '#ff4444' : (zone.o2 < 20.0 ? '#ffcc00' : 'var(--neon)');
        const isCrit = zone.risk === 'CRITICAL' ? 'critical-row' : '';
        const row = document.createElement('div');
        row.className = `vital-row ${isCrit}`;
        row.innerHTML = `<div style="display:flex; gap:10px; align-items:center;"><span class="vital-id">${zone.id}</span><span class="vital-name">${zone.name}</span></div><div class="vital-data"><span style="color:${riskColor}">${Math.round(zone.crowd)}%</span><span style="color:${o2Color}">${zone.o2.toFixed(1)}%</span></div>`;
        hud.appendChild(row);
    });
}

function updateAIDecision() {
    const worst = SENSOR_DATA.zones.reduce((p, c) => RISK_LEVELS[c.risk].threshold > RISK_LEVELS[p.risk].threshold ? c : p, SENSOR_DATA.zones[0]);
    const box = document.getElementById('ai-strategic-box');
    const statusEl = document.getElementById('ai-status');
    const cotEl = document.getElementById('ai-cot-lines');
    if(!box || !statusEl || !cotEl) return;
    
    box.style.borderLeftColor = RISK_LEVELS[worst.risk].color;
    if (SENSOR_DATA.emergency) {
        statusEl.innerText = "TAKING ACTION";
        statusEl.style.color = "#ff4444";
        cotEl.innerHTML = `<span class="ai-line"><span>[OBSERVE]</span> Perimeter breach at ${worst.id}.</span><span class="ai-line"><span>[REASON]</span> Evacuation required to prevent surge.</span><span class="ai-line"><span>[DECIDE]</span> LIFE_CORRIDOR protocol active.</span>`;
    } else if (worst.risk === 'CRITICAL' || worst.risk === 'HIGH') {
        statusEl.innerText = "TAKING ACTION";
        statusEl.style.color = "#ffcc00";
        cotEl.innerHTML = `<span class="ai-line"><span>[OBSERVE]</span> High density detected at sector ${worst.id}.</span><span class="ai-line"><span>[REASON]</span> Proximity thresholds exceeded by 14%.</span><span class="ai-line"><span>[DECIDE]</span> Redirecting flow to southern gates.</span>`;
    } else {
        statusEl.innerText = "NOMINAL";
        statusEl.style.color = "var(--neon)";
        cotEl.innerHTML = `<span class="ai-line"><span>[OBSERVE]</span> System nominal pulse...</span><span class="ai-line"><span>[REASON]</span> Density thresholds within range.</span><span class="ai-line"><span>[DECIDE]</span> No action required.</span>`;
    }
}

function processCommand(cmd) {
    const input = cmd.trim().toUpperCase();
    termOut(`<span style="color:var(--neon)">${input}</span>`);
    if (input === 'STATUS') {
        termOut("SYSTEM REPORT: QUORUM V10.5");
        termOut(`MODE: ${SENSOR_DATA.currentMode.toUpperCase()}`);
        termOut(`SAFETY_INDEX: ${SENSOR_DATA.avgSafety.toFixed(1)}%`);
        termOut("SENSOR MESH: STABLE");
    } else if (input === 'RED' || input === 'F3') {
        triggerEmergencyMode();
    } else if (input === 'RESET' || input === 'ESC') {
        resetNormalMode();
    } else if (input === 'PREDICT' || input === 'F2') {
        termOut("PREDICTIVE ANALYSIS INITIATED...");
        setTimeout(() => termOut("RESULT: High risk cluster at D4 in T-120s"), 1000);
    }
}

function triggerEmergencyMode() {
    if (SENSOR_DATA.emergency) return;
    SENSOR_DATA.emergency = true;
    document.getElementById('emergency-overlay').style.opacity = '1';
    termOut("[CRITICAL] RED_LINE PROTOCOL INITIATED");
    setTimeout(() => {
        document.querySelectorAll('.crit-title, .crit-sub').forEach((el, i) => {
            setTimeout(() => el.style.opacity = '1', i * 500);
        });
        drawLifeCorridor();
    }, 700);
    renderAll();
}

function resetNormalMode() {
    SENSOR_DATA.emergency = false;
    document.getElementById('emergency-overlay').style.opacity = '0';
    document.querySelectorAll('.crit-title, .crit-sub').forEach(el => el.style.opacity = '0');
    document.getElementById('life-corridor-svg').innerHTML = '';
    SENSOR_DATA.zones.forEach(z => { z.crowd = 45; z.o2 = 20.8; z.risk='LOW'; });
    termOut("[SYSTEM] Emergency reset confirmed.");
    renderAll();
}

function termOut(text) {
    const out = document.getElementById('term-out');
    if(!out) return;
    const line = document.createElement('div');
    line.innerHTML = `<span style="color:var(--neon-dim); font-weight:bold;">></span> ${text}`;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
}

function switchMode(mode) {
    SENSOR_DATA.currentMode = mode;
    const viewport = document.getElementById('stadium-viewport');
    if(viewport) {
        viewport.className = '';
        viewport.classList.add(`mode-${mode}`);
    }
    // Update active btn
    document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.toggle('active', b.innerText.toLowerCase() === mode);
    });
    termOut(`MODE SWITCH: Systems optimized for ${mode.toUpperCase()} protocol.`);
    renderAll();
}
