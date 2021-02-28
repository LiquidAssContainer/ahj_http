import Fetch from '../../api/Fetch';
import Modal from '../Modal';
import createErrorPopup from '../createErrorPopup';

export default class RemoveTicketModal extends Modal {
  constructor(modal) {
    super(modal);
    this.registerEvents();
  }

  openForRemoving(id, ticket) {
    this.id = id;
    this.ticket = ticket;
    this.open();
  }

  registerEvents() {
    super.registerEvents();

    this.modal.addEventListener('click', async (e) => {
      const { target } = e;
      if (target.classList.contains('confirm-btn')) {
        const response = await Fetch.removeTicket(this.id);
        if (response.success) {
          this.ticket.remove();
          this.close();
        } else {
          createErrorPopup(response.message);
        }
      }
    });
  }
}
