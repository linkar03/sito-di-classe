/* eslint-disable no-unused-vars */

// Click Handler
document.addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    for (let i = circlesDB.length - 1; i >= 0; i--) {
        const c = circlesDB[i];
        const dx = x - c.xCenter;
        const dy = y - c.yCenter;
        if ( Math.abs(dx/1.25)  <= c.radius 
		&& Math.abs(dy/1.25)  <= c.radius 
		) {
            deleteCircle(c.id,"click");
            break;
        }
    }
});

// Scroll Handler
window.addEventListener('wheel', (e) => {
	console.log("Evento Scroll");
	logic_scroll();
});

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
});

