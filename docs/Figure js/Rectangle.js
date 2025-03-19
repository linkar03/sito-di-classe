/* eslint-disable no-unused-vars */

//Classe Rettangolo

class Rectangle {
    constructor(config) {
        this.element = document.createElement('div');
        this.element.className = 'rectangle';
        Object.assign(this, config);
        
        this.size = config.size || 100;
        this.element.style.setProperty('--size', `${this.size}px`);
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;

        this.x = Math.random() * (window.innerWidth - this.size);
        this.y = Math.random() * (window.innerHeight - this.size);
        this.init();
    }

    init() {
        const faces = [
            { class: 'front', type: 'image' },
            { class: 'back', type: 'image' },
            { class: 'right', type: 'text' },
            { class: 'left', type: 'text' },
            { class: 'top', type: 'text' },
            { class: 'bottom', type: 'text' }
        ];

        faces.forEach(({ class: faceClass, type }) => {
            const face = document.createElement('div');
            face.className = `face ${faceClass}`;

            // Controllo per contenuto HTML personalizzato
            if(this.customFace && faceClass === this.customFace.face) {
                face.innerHTML = this.customFace.html;
                face.classList.add('custom-face');
            } 
            else {
                if(type === 'image' && this.image) {
                    face.classList.add('face-image');
                    face.style.backgroundImage = `url('${this.image}')`;
                } else {
                    face.style.backgroundColor = this.color;
                    
                    if(type === 'text') {
                        const textDiv = document.createElement('div');
                        textDiv.className = 'face-text';
                        textDiv.innerHTML = this.name;
                        face.appendChild(textDiv);
                    }
                }
            }

            this.element.appendChild(face);
        });

        this.element.addEventListener('click', (e) => {
            e.preventDefault();
            if(this.link) window.location.href = this.link;
        });
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if(this.x <= 0 || this.x >= window.innerWidth - this.size) this.speedX *= -1;
        if(this.y <= 0 || this.y >= window.innerHeight - this.size) this.speedY *= -1;

        this.element.style.transform = `
            translate(${this.x}px, ${this.y}px)
            rotateX(${this.rotationX}deg)
            rotateY(${this.rotationY}deg)`;

        this.rotationX += this.rotationSpeedX;
        this.rotationY += this.rotationSpeedY;
    }
}