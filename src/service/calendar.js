import firebaseService from './firebase';
import util from '@util/';
import themeService from '@service/theme';

export default {

  createEvent: (projectId, title, type, description, date, color, customer, location, repeat) => {

    const now = new Date();
    const event = {
      title,
      type,
      description,
      date: date,
      customer,
      color,
      location,
      repeat,
      created: now.getTime(),
    };

    return firebaseService.createEvent(projectId, event)

  },
  editEvent: (projectId, eventId, title, description, date ,color, customer, location, repeat) => {

    const event = {
      title,
      description,
      customer,
      color,
      location,
      repeat
    };

    const updatePath = eventsPath(projectId, eventId);

    return firebaseService.update(updatePath, event).then(() => {
      event.id = eventId;
      return event;
    });
  },

  removeEvent: (projectId, eventId) => {

    const path = eventsPath(projectId, eventId);
    return firebaseService.remove(path);
  }
}

const eventsPath = (projectId, eventId) => `/projects/${projectId}/events/${eventId}`;
