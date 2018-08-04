import firebaseService from './firebase';

export default {

  createEvent: (projectId, title, type, description, date, color, customer, location) => {

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
  editEvent: (projectId, eventId, title, description, date , color, customer, location) => {

    const event = cleanEmptyEntries({
      title,
      description,
      date,
      customer,
      color,
      location,
      completed: false
    });

    const updatePath = eventsPath(projectId, eventId);

    return firebaseService.update(updatePath, event).then(() => {
      event.id = eventId;
      return event;
    });
  },
  removeEvent: (projectId, eventId) => {

    const path = eventsPath(projectId, eventId);
    return firebaseService.remove(path);
  },

  transformToCalendarEvents: events => events.map(event => ({
    ...event,
    start: new Date(event.date),
    end: new Date(event.date)
  }))
}

const eventsPath = (projectId, eventId) => `/projects/${projectId}/events/${eventId}`;

const cleanEmptyEntries = (obj) => {
  const keys = Object.keys(obj);

  keys.forEach(key => {
    !obj[key] && delete obj[key]
  });

  return obj;
};