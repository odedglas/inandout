import firebaseService from './firebase';
import util from '@util/';
import themeService from '@service/theme';

export default {

  createCustomer: (projectId, name, contactName, phone, email, address, logo) => {

    const customer = {
      name,
      contactName,
      phone,
      email,
      address,
      star: false,
    };

    if(logo) customer.logo = logo;
    else {

      customer.initials = util.getInitials(name);
      customer.avatarColor = themeService.getAvatarRandomColor(400);
    }

    return firebaseService.createCustomer(projectId, customer)

  },
  editCustomer: (projectId, customerId, name, contactName, phone, email, address, star, logo) => {

    const customer = {
      name,
      contactName,
      phone,
      email,
      address,
      star
    };
    if(logo) customer.logo = logo;

    const updatePath = categoryPath(projectId, customerId);

    return firebaseService.update(updatePath, customer).then(() => {
      customer.id = customer;
      return customer;
    });
  },
  removeCustomer: (projectId, customerId) => {

    const path = categoryPath(projectId, customerId);
    return firebaseService.remove(path);
  }
}

const categoryPath = (projectId, customerId) => `/projects/${projectId}/customers/${customerId}`;
