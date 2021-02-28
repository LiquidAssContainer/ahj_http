import Fetch from '../../api/Fetch';
import Modal from '../Modal';
import RenderTickets from '../RenderTickets';
import createErrorPopup from '../createErrorPopup';

export default class TicketModal extends Modal {
  constructor(modal) {
    super(modal);
    this.form = modal.getElementsByTagName('form')[0];
    this.modalDescription = document.getElementsByClassName('modal_description')[0];
    this.registerEvents();
  }

  openForAddition() {
    this.modalDescription.textContent = 'Добавить тикет';
    this.action = 'add';

    this.open();
  }

  openForEditing(id, ticket) {
    this.modalDescription.textContent = 'Изменить тикет';
    this.id = id;
    this.ticketToEdit = ticket;
    this.action = 'edit';

    this.open();
    this.fillFormToEdit();
  }

  // в такой реализации каждый раз делается лишний запрос, но иначе придётся (вроде) много где код править, чтобы было более-менее красиво
  async fillFormToEdit() {
    const response = await Fetch.getTicketById(this.id);
    if (response.success) {
      const { data } = response;
      const formInputs = [...this.form.elements].filter(({ name }) => name);
      for (const input of formInputs) {
        input.value = data[input.name];
      }
    } else {
      createErrorPopup(response.message);
    }
  }

  async onSubmit() {
    if (!this.validateForm()) {
      createErrorPopup('Ошибочка вышла, форма невалидная');
      return;
    }

    const formElems = [...this.form.elements];
    const namedFormElems = formElems.filter((elem) => elem.name);

    const ticket = { id: null, status: false };
    namedFormElems.forEach((elem) => {
      ticket[elem.name] = elem.value;
    });

    switch (this.action) {
      case 'add':
        const addResponse = await Fetch.createTicket(ticket);
        if (addResponse.success) {
          const newTicket = addResponse.data;
          const ticketsContainer = document.getElementsByClassName('tickets_container')[0];
          const ticketHTML = RenderTickets.renderTicket(newTicket);
          ticketsContainer.insertAdjacentHTML('beforeend', ticketHTML);
        } else {
          createErrorPopup(addResponse.message);
        }
        break;
      case 'edit':
        const editResponse = await Fetch.editTicket(this.id, ticket);
        if (editResponse.success) {
          const editedTicketHTML = RenderTickets.renderTicket(editResponse.data);
          this.ticketToEdit.outerHTML = editedTicketHTML;
        } else {
          createErrorPopup(editResponse.message);
        }
    }

    this.close();
  }

  validateForm() {
    const elements = [...this.form.elements].filter(({ name }) => name);
    for (const elem of elements) {
      if (/^\s*$/.test(elem.value)) {
        return false;
      }
    }
    return true;
  }

  registerEvents() {
    super.registerEvents();

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }
}
