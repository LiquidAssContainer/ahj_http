export default class Fetch {
  static url = 'https://ahj-http-server.herokuapp.com/server';

  static async createRequest(params = '', options) {
    const response = await fetch(this.url + params, options);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(response.status);
  }

  static getAllTickets() {
    return this.createRequest('?method=allTickets', {
      method: 'GET',
    });
  }

  static getTicketById(id) {
    return this.createRequest(`?method=ticketById&id=${id}`, {
      method: 'GET',
    });
  }

  static createTicket(ticket) {
    return this.createRequest('?method=createTicket', {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  }

  static editTicket(id, data) {
    return this.createRequest(`?method=editTicket&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static removeTicket(id) {
    return this.createRequest(`?method=removeTicket&id=${id}`, {
      method: 'POST',
    });
  }
}
