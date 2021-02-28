export default class Modal {
  constructor(modal) {
    if (!modal) {
      throw new Error('Пустой элемент!');
    }
    this.modal = modal;
  }

  open() {
    this.modal.classList.remove('hidden');
  }

  close() {
    if (this.form) {
      this.form.reset();
    }
    this.modal.classList.add('hidden');
  }

  registerEvents() {
    const closeBtn = this.modal.getElementsByClassName('close-btn')[0];
    closeBtn.addEventListener('click', () => this.close());

    document.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('.modal_wrapper') && !e.target.closest('.modal_content')) {
        this.close();
      }
    });
  }
}
