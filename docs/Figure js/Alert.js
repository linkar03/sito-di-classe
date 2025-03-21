/* eslint-disable no-unused-vars */


class Alert {
  constructor(message, options = {}) {
    this.message = message;
    this.duration = options.duration || 2000; // Default 2 secondi
    this.element = null;
  }

  show() {
    // Crea l'elemento alert
    this.element = document.createElement('div');
    this.element.innerHTML = this.message;
    
    // Stili base
    Object.assign(this.element.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      backgroundColor: '#ff4444',
      color: 'white',
      padding: '15px',
      textAlign: 'center',
      zIndex: '9999',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    });

    // Aggiungi alla pagina
    document.body.appendChild(this.element);

    // Rimuovi dopo il timeout
    setTimeout(() => this.hide(), this.duration);
  }

  hide() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  }
}