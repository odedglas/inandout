import firebaseService from './firebase';
import transactionService from './transaction';
import util from '@util/';

export default {

  createEvent(projectId, title, type, description, date, color, customer, location) {

    const now = new Date();
    const event = cleanEmptyEntries({
      title,
      type,
      description,
      date: date,
      customer,
      color,
      location,
      created: now.getTime(),
    });

    return firebaseService.createEvent(projectId, event)
  },
  editEvent (projectId, eventId, title, description, date , color, customer, location, transaction) {

    const event = cleanEmptyEntries({
      title,
      description,
      date,
      customer,
      color,
      location,
      transaction,
      completed: false
    });

    const updatePath = eventsPath(projectId, eventId);

    return firebaseService.update(updatePath, event).then(() => {

      if(event.transaction) {

        //Controlling transaction date
        const transactionPath = this.getEventTransactionPath(projectId, event);

        firebaseService.update(transactionPath, {
          customer: event.customer,
          date: event.date,
          description: getEventTransactionDescription(event)
        })
      }

      event.id = eventId;
      return event;
    });
  },
  completeEvent (projectId, eventId, completed) {

    const event  = {completed};

    const updatePath = eventsPath(projectId, eventId);
    return firebaseService.update(updatePath, event).then(() => {
      event.id = eventId;
      return event;
    });
  },
  attachEventTransaction (projectId, eventId, transaction) {

    const transactionKey = `${transactionService.transactionsDateKey(transaction.date)}/${transaction.id}`;
    const event  = {transaction: transactionKey, completed: true};

    const updatePath = eventsPath(projectId, eventId);
    return firebaseService.update(updatePath, event).then(() => {
      event.id = eventId;
      return event;
    });
  },
  detachEventTransaction (projectId, eventId) {

    const event  = {transaction: '', completed: false};

    const updatePath = eventsPath(projectId, eventId);
    return firebaseService.update(updatePath, event).then(() => {
      event.id = eventId;
      return event;
    });
  },
  removeEvent (projectId, eventId) {

    const path = eventsPath(projectId, eventId);
    return firebaseService.fetch(path).then(event => {

      firebaseService.remove(path);

      if(event.transaction) {

        //Releasing transaction
        const transactionPath = this.getEventTransactionPath(projectId, event);
        firebaseService.update(transactionPath, {sourceEventId: ''})
      }
    });
  },
  mergeEvents (events, customers) {
    const customersMap = util.toIdsMap(customers);
    return events.map(event => ({
      ...event,
      customer: event.customer ? customersMap[event.customer] : undefined,
    }))
  },
  transformToCalendarEvents (events) {
    return events.map(event => ({
      ...event,
      start: new Date(event.date),
      end: new Date(event.date)
    }))
  },
  transformEventToTransaction (event) {

    const description = getEventTransactionDescription(event);

    return {
      type: 'INCOME',
      date: event.date,
      customer: event.customer,
      description
    }
  },
  getEventTransactionPath (projectId, event) {

    const parts = event.transaction.split("/");
    return `/transactions/${projectId}/${parts[0]}/${parts[1]}`;
  }
}

const eventsPath = (projectId, eventId) => `/projects/${projectId}/events/${eventId}`;

const cleanEmptyEntries = (obj) => {
  const keys = Object.keys(obj);

  keys.forEach(key => {
    !obj[key] && delete obj[key]
  });

  return obj;
};

const getEventTransactionDescription = event => `${event.title} ${event.location ? `, At ${event.location}`: ''}`;