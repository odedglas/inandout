import firebaseService from './firebase';
import themeService from './theme';

export default {

  fetchUser: id => firebaseService.fetch(`/users/${id}`).then(res => res.user),
  createUser: (id, displayName, email) => {

    const initials = displayName ? getInitials(displayName) : email.substring(0,1);

    const user = {
      displayName,
      email,
      initials: initials.toUpperCase(),
      avatarImage:'',
      avatarColor: themeService.getAvatarRandomColor()
    };

    return firebaseService.createUser(id, user).then(() => {
      user.id = id;
      return user;
    });
  },
}

const getInitials = str =>str.split(" ").map((n)=>n[0]).slice(0,2).join("");