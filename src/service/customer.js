import firebaseService from './firebase';
import util from '@util/';
import themeService from '@service/theme';

export default {

  createCustomer: (projectId, name, contactName, phone, email, address, logo) => {

    const now = new Date();
    const customer = {
      name,
      contactName,
      phone,
      email,
      address,
      created: now.getTime(),
      star: false,
    };

    if(logo) customer.logo = logo;
    else {

      customer.initials = util.getInitials(name);
      customer.avatarColor = themeService.getAvatarRandomColor(Math.random() > 0.5 ? 400 : 500);
    }

    return firebaseService.createCustomer(projectId, customer)

  },
  editCustomer: (projectId, customerId, name, contactName, phone, email, address, logo) => {

    const customer = {
      name,
      contactName,
      phone,
      email,
      address,
    };
    if(logo) customer.logo = logo;

    const updatePath = customersPath(projectId, customerId);

    return firebaseService.update(updatePath, customer).then(() => {
      customer.id = customerId;
      return customer;
    });
  },

  setStarred: (projectId, customerId, star) => {
    const customer = {
      star
    };

    const updatePath = customersPath(projectId, customerId);

    return firebaseService.update(updatePath, customer).then(() => {

      customer.id = customerId;
      return customer;
    });
  },
  removeCustomer: (projectId, customerId) => {

    const path = customersPath(projectId, customerId);
    return firebaseService.remove(path);
  }
}

const customersPath = (projectId, customerId) => `/projects/${projectId}/customers/${customerId}`;
