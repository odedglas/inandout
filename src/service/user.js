import firebaseService from './firebase';
import themeService from './theme';
import util from '@util/';

export default {

  fetchUser: id => firebaseService.fetch(`/users/${id}`).then(res =>  {

    return res.user ? {
      user: {
        id: res.id,
        ...res.user,
        projects: Object.keys(res.projects)
      },
    } : undefined
  }),
  createUser: (id, displayName, email, avatarImage) => {

    const initials = displayName ? util.getInitials(displayName) : email.substring(0,1);

    const user = {
      displayName,
      email,
      initials: initials.toUpperCase(),
      avatarColor: themeService.getAvatarRandomColor(),
      projects: {}
    };

    if(avatarImage) {
      user.avatarImage = avatarImage;
    }

    return firebaseService.createUser(id, user).then(() => {
      user.id = id;
      return user;
    });
  },
  fetchUsers: () => {

    return firebaseService.fetchArray('/users').then(result => {

        return result.map(holder => {
          return {
            id: holder.id,
            ...holder.user
          }
        })
    });
  },
}
