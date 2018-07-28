import firebaseService from './firebase';
import themeService from './theme';
import util from '@util/';

export default {

  fetchUser: id => firebaseService.fetch(`/users/${id}`).then(res =>  {

    return {
      user: {
        id: res.id,
        ...res.user,
        projects: getUserProjectsMeta(res.projects)
      },
    }
  }),
  createUser: (id, displayName, email) => {

    const initials = displayName ? util.getInitials(displayName) : email.substring(0,1);

    const user = {
      displayName,
      email,
      initials: initials.toUpperCase(),
      avatarImage:'',
      avatarColor: themeService.getAvatarRandomColor(),
      projects: []
    };

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

const getUserProjectsMeta = projects => {

  //Getting user projects meta
  const userProjects = projects ? Object.keys(projects) : [];
  return userProjects.map(userProject => projects[userProject]);
};