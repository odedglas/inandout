import firebaseService from './firebase';
import util from '@util/';
import themeService from '@service/theme';

export default {

  createCustomer: (projectId, name, contactName, phone, email, address, logo, additionalPhoneNumber, additionalContactName) => {

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

    if(additionalPhoneNumber) customer.additionalPhoneNumber = additionalPhoneNumber;
    if(additionalContactName) customer.additionalContactName = additionalContactName;
    if(logo) customer.logo = logo;
    else {

      customer.initials = util.getInitials(name.toUpperCase());
      customer.avatarColor = themeService.getAvatarRandomColor(Math.random() > 0.5 ? 400 : 500);
    }

    return firebaseService.createCustomer(projectId, customer)

  },
  editCustomer: (projectId, customerId, name, contactName, phone, email, address, logo, additionalPhoneNumber, additionalContactName) => {

    const customer = {
      name,
      contactName,
      phone,
      email,
      address,
    };

    if(additionalPhoneNumber) customer.additionalPhoneNumber = additionalPhoneNumber;
    if(additionalContactName) customer.additionalContactName = additionalContactName;
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
