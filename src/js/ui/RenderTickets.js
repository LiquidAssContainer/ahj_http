export default class RenderTickets {
  static renderAll(tickets) {
    let ticketsInnerHTML = '';
    for (const ticket of tickets) {
      ticketsInnerHTML += this.renderTicket(ticket);
    }

    const ticketsContainer = document.getElementsByClassName('tickets_container')[0];
    ticketsContainer.innerHTML = ticketsInnerHTML;
  }

  static renderTicket(ticket) {
    const { id, name, status, created } = ticket;
    const date = new Date(created);
    const formattedDate = this.getFormattedDate(date);

    return `
    <div class="ticket" data-ticket-id=${id}>
      <div class="ticket_main-info">
        <label class="checkbox-label">
          <input class="ticket_status-checkbox" type="checkbox"${status ? 'checked' : ''}>
          <div class="fake-checkbox"></div>
        </label>
        <span class="ticket_name">${name}</span>
        <span class="ticket_creation-date">${formattedDate}</span>
        <button class="ticket_btn ticket_edit-btn"></button>
        <button class="ticket_btn ticket_remove-btn"></button>
      </div>
      <div class="ticket_description hidden"></div>
    </div>
    `;
  }

  static getFormattedDate(date) {
    const twoDigits = (number) => (number < 10 ? `0${number}` : number);

    const day = twoDigits(date.getDate());
    const month = twoDigits(date.getMonth() + 1);
    const year = date.getFullYear().toString().substr(2, 2);
    const DMY = `${day}.${month}.${year}`;

    const hours = twoDigits(date.getHours());
    const minutes = twoDigits(date.getMinutes());
    const time = `${hours}:${minutes}`;

    return `${DMY} ${time}`;
  }
}
