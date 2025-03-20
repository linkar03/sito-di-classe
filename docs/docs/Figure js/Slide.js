/* eslint-disable no-unused-vars */

class Parallelepiped {
			constructor(config) {
				this.element = document.createElement('div');
				this.element.className = 'parallelepiped';
				Object.assign(this, config);

				// Dimensioni in percentuale
				this.width = config.width || 160; // % della viewport
				this.height = config.height || 100; // % della viewport
				this.depth = config.depth || 50; // % della viewport

				// Calcola dimensioni reali
				this.calcDimensions();
				
				// Posizione iniziale
				this.x = Math.random() * (window.innerWidth - this.realWidth);
				this.y = Math.random() * (window.innerHeight - this.realHeight);

				this.init();
				
				this.element.querySelector('.face').setAttribute('data-face', this.customFace.face);
			}

			calcDimensions() {
				this.realWidth = (window.innerWidth * this.width) / 100;
				this.realHeight = (window.innerHeight * this.height) / 100;
				this.realDepth = (Math.min(window.innerWidth, window.innerHeight) * this.depth) / 100;
			}
			
			updateContent(newHtml) {
				this.customFace.html = newHtml;
				this.element.querySelector(`[data-face="${this.customFace.face}"]`).innerHTML = newHtml;
			}
			
			init() {
				// Crea le 6 facce
				const faces = [
					{ name: 'front', transform: `translateZ(${this.realDepth/2}px)` },
				];

				faces.forEach(face => {
					const faceDiv = document.createElement('div');
					faceDiv.className = `face ${face.name}-face`;
					faceDiv.style.transform = face.transform;
					
					if(this.customFace && face.name === this.customFace.face) {
						faceDiv.innerHTML = this.customFace.html;
						faceDiv.classList.add('custom-face');
					} else {
						faceDiv.style.backgroundColor = this.color;
					}
					
					this.element.appendChild(faceDiv);
				});

				// Stili principali
				this.element.style.width = `${this.realWidth}px`;
				this.element.style.height = `${this.realHeight}px`;
				this.element.style.transformStyle = 'preserve-3d';
			}
		}