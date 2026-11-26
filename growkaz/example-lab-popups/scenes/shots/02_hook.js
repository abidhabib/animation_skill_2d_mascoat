import { E, registerShot } from '/engine/core.js';
import { hook } from '/engine/popups.js';
registerShot('U5', { draw(g, t) { const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, '#2a6a9a'); gr.addColorStop(1, '#123050'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); hook(g, 0.6, ['Paid to ignore', 'your phone?'], { keys: ['Paid', 'phone'], y: 0.45, size: 160 }); } });
