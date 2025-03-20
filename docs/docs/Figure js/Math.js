/* eslint-disable no-unused-vars */

function generaPuntiCircolari(xStart, yStart, xCentro, yCentro, passo) {
    const punti = [];
    const radius = Math.hypot(xCentro - xStart, yCentro - yStart);
    let angolo = Math.atan2(yStart - yCentro, xStart - xCentro);
    
    for (let i = 0; i < Math.PI * 2 / passo; i++) {
        const x = xCentro + radius * Math.cos(angolo);
        const y = yCentro + radius * Math.sin(angolo);
        punti.push({ x, y });
        angolo += passo;
    }
    return punti;
}