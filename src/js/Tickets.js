import Fetch from './api/Fetch';
import TicketModal from './ui/modals/TicketModal';
import RemoveTicketModal from './ui/modals/RemoveTicketModal';
import RenderTickets from './ui/RenderTickets';
import createErrorPopup from './ui/createErrorPopup';

export default class Tickets {
  constructor() {
    this.initModals();
    this.getTickets();
    this.registerEvents();
  }

  async getTickets() {
    try {
      const response = await Fetch.getAllTickets();
      if (response.success) {
        this.tickets = response.data;
        this.renderTickets();
      }
    } catch (e) {
      // без обработки
      console.log(e);
    }
  }

  renderTickets() {
    RenderTickets.renderAll(this.tickets);
  }

  initModals() {
    this.modals = new Map([
      ['ticket-modal', new TicketModal(document.getElementById('ticket_modal'))],
      ['remove-modal', new RemoveTicketModal(document.getElementById('remove-ticket_modal'))],
    ]);
  }

  async toggleDescription(ticket) {
    const descriptionElem = ticket.getElementsByClassName('ticket_description')[0];
    if (ticket.hasAttribute('data-description-is-loaded')) {
      descriptionElem.classList.toggle('hidden');
      return;
    }

    const id = ticket.dataset.ticketId;
    const response = await Fetch.getTicketById(id);

    if (response.success) {
      const descriptionText = response.data.description;
      descriptionElem.classList.remove('hidden');
      descriptionElem.textContent = descriptionText;
      ticket.dataset.descriptionIsLoaded = ''; // а как лучше?
    } else {
      createErrorPopup(response.message);
    }
  }

  onClick(e) {
    if (e.button !== 0) return;

    const { target } = e;
    const ticket = target.closest('.ticket');

    if (!ticket) return;

    const id = ticket.dataset.ticketId;

    if (target.classList.contains('ticket_edit-btn')) {
      const modal = this.modals.get('ticket-modal');
      modal.openForEditing(id, ticket);
      return;
    }
    if (target.classList.contains('ticket_remove-btn')) {
      this.modals.get('remove-modal').openForRemoving(id, ticket);
      return;
    }
    if (target.closest('.checkbox-label')) {
      // some code
      return;
    }
    if (!target.closest('.ticket_description')) {
      this.toggleDescription(ticket);
    }
  }

  registerEvents() {
    const addTicket = document.getElementById('add-ticket');
    addTicket.addEventListener('click', () => {
      const modal = this.modals.get('ticket-modal');
      modal.openForAddition();
    });

    document.addEventListener('mousedown', (e) => this.onClick(e));
  }
}
