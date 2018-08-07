import firebaseService from './firebase';
import projectService from './project';
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
  createConfirmNotification(from, to, text) {

    const now = new Date();
    const notification = {
      from: from.id,
      created: now.getTime(),
      type: NOTIFICATION_TYPE.CONFIRMATION,
      unread: true,
      params: {
        text
      }
    };

    return firebaseService.createNotification(this.getUserNotificationKey(to.email), notification);
  },
  fetchUserNotifications(currentUser) {

    const notificationsKey = this.getUserNotificationKey(currentUser.email);
    return firebaseService.fetchArray(`/notifications/${notificationsKey}`);
  },
  mergeNotifications(notifications, users) {

    const usersMap = util.toIdsMap(users);
    return notifications.map(notification => {

      const from = usersMap[notification.from];

      const {text, actions} = notificationActionTextTransformer(notification, from);

      return {
        ...notification,
        from,
        date: dateUtil.fromNow(notification.created),
        text,
        actions,
      }
    });
  },

  //Actions
  async acceptProjectInvite(acceptingUser, notification,projectId, callback) {

    //Fetching project
    const project = await firebaseService.fetch(`/projects/${projectId}`);

    //Adding user as member
    const members = [...project.members, acceptingUser.id];
    projectService.updateProject(project, {members});
    project.members = members;

    //Adding project to user
    await firebaseService.addUserProject(acceptingUser.id, projectId);

    //Sending owner response
    await this.createConfirmNotification(
      acceptingUser,
      notification.from,
      `${acceptingUser.displayName} has accepted your project share request and now is available to manage on project members`
    );

    //Marking notification as read
    return this.updateNotification(
      notification.id,
      acceptingUser.email,
      {unread: false, completedAction: NOTIFICATION_ACTIONS.INVITE_JOIN}
    ).then(() => callback(project))

  },
  async rejectProjectInvite(rejectingUser, notification) {

    //Sending owner response
    await this.createConfirmNotification(
      rejectingUser,
      notification.from,
      `${rejectingUser.displayName} has rejected your project share request.`
    );

    return this.updateNotification(
      notification.id,
      rejectingUser.email,
      {unread: false, completedAction: NOTIFICATION_ACTIONS.INVITE_REJECT}
    )
  },

};

const notificationPath = (notificationId, email) => `/notifications/${notificationService.getUserNotificationKey(email)}/${notificationId}`

const notificationActionTextTransformer = (notification, from) => {

  const type = notification.type;

  let actions = [];
  let text = '';
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
      text = `${from.displayName} has invite you to share his project: <b> ${notification.params.projectName} </b>`;
      break;
    case NOTIFICATION_TYPE.CONFIRMATION: {
      actions = [{
        text: 'Confirm',
        completedText: 'Message was confirmed.',
        key: NOTIFICATION_ACTIONS.CONFIRM,
        color: 'primary'
      }];
      text = notification.params.text;
      break;
    }
    default :
      break;
  }

  return {text, actions}
};

export default notificationService;