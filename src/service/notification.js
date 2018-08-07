import firebaseService from './firebase';
import {NOTIFICATION_TYPE, NOTIFICATION_ACTIONS} from "@const/";
import util from '@util/';
import dateUtil from '@util/date';

const notificationService = {
  createNotificationsSyncListener (user, callback) {

    const notificationKey = this.getUserNotificationKey(user.email);

    firebaseService.database.ref(`/notifications/${notificationKey}`).on('value', (snap) => {
      const value = snap.val();
      const keys = value ? Object.keys(value) : [];

      const result = keys.map(key => {

        return {
          id: key,
          ...value[key]
        }
      });
      console.log("Notifications sync listener");
      callback(result);
    })
  },
  getUserNotificationKey(email) {

    return email.replaceAll(".", "_")
  },
  updateNotification(notificationId, email, update) {

    const updatePath = notificationPath(notificationId, email);
    return firebaseService.update(updatePath, update);

  },
  sendInviteNotification(project, from, email) {

    const now = new Date();
    const notification = {
      from: from.id,
      created: now.getTime(),
      type: NOTIFICATION_TYPE.INVITE,
      unread: true,
      params: {
        projectIdentifier: project.identifier,
        projectId: project.id,
        projectName: project.name
      }
    };

    return firebaseService.createNotification(this.getUserNotificationKey(email), notification);

  },
  fetchUserNotifications(currentUser) {

    const notificationsKey = this.getUserNotificationKey(currentUser.email);
    return firebaseService.fetchArray(`/notifications/${notificationsKey}`);
  },
  mergeNotifications(notifications, users) {

    const usersMap = util.toIdsMap(users);
    return notifications.map(notification => {

      const type = notification.type;
      let actions = [];
      switch (type) {
        case NOTIFICATION_TYPE.INVITE :
          actions = [
            {
              text: 'Reject',
              completedText: 'Share invite request was Rejected',
              key: NOTIFICATION_ACTIONS.INVITE_REJECT,
              color: 'secondary',
            },
            {
              text: 'Join',
              completedText: 'Share invite request was accepted',
              key: NOTIFICATION_ACTIONS.INVITE_JOIN,
              color: 'primary',
            }
          ];
          break;
        default :
          break;
      }

      return {
        ...notification,
        from: usersMap[notification.from],
        date: dateUtil.fromNow(notification.created),
        text: ' Something dummy for now dude HEY!',
        actions,
      }
    });
  },

  //Actions
  acceptProjectInvite(userId, notificationId, email, projectId, callback) {

    //Fetching project
    return firebaseService.fetch(`/projects/${projectId}`).then(project => {

      //Adding project to user
      return firebaseService.addUserProject(userId, projectId).then(() => {

        //Marking notification as read
        return this.updateNotification(
          notificationId,
          email,
          {unread: false, completedAction: NOTIFICATION_ACTIONS.INVITE_JOIN}
        ).then(() => callback(project))
      });
    })
  },
  rejectProjectInvite(notificationId, email) {
    return this.updateNotification(
      notificationId,
      email,
      {unread: false, completedAction: NOTIFICATION_ACTIONS.INVITE_REJECT}
    )
  }
};

const notificationPath = (notificationId, email) => `/notifications/${notificationService.getUserNotificationKey(email)}/${notificationId}`


export default notificationService;