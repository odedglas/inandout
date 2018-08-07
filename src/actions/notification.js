import notificationService from '@service/notification';
import projectService from '@service/project';
import {NOTIFICATION_ACTIONS} from "@const/";
import navigationUtil from '@util/navigation';
import {selectProject} from "./project";

export function createNotificationSyncListener(user) {
  return dispatch => {

    notificationService.createNotificationsSyncListener(
      user,
      (notifications) => dispatch({type:'SET_NOTIFICATIONS', notifications})
    );
  }
}

export function handleNotificationAction(notification, action, user, router, closeDrawer) {

  return (dispatch, getState) => {

    const actionKey = action.key;
    const params = notification.params;

    let handler;
    switch (actionKey) {

      case NOTIFICATION_ACTIONS.INVITE_JOIN: {
        handler = () => notificationService.acceptProjectInvite(
          user.id,
          notification.id,
          user.email,
          params.projectId,
          (project) => {

            closeDrawer();

            //Adding project
            const defaultCategories = getState().categories.defaults;
            const filledProject = projectService.fillProject(project, {}, defaultCategories);

            dispatch({type: 'ADD_PROJECT', project: filledProject});
            dispatch(selectProject(filledProject));
            router.push(navigationUtil.projectLink({identifier: params.projectIdentifier}))
          }
        );
        break;
      }

      case NOTIFICATION_ACTIONS.INVITE_REJECT: {
        handler = () => notificationService.rejectProjectInvite(
          notification.id,
          user.email
        );
        break;
      }

      default: {
        return;
      }
    }

    //Actual operation
    dispatch({type: 'APP_LOADING', loading: true});
    handler && handler().then(res => {

      //Note, No redux reduce needed here due to real time listener
      dispatch({type: 'APP_LOADING', loading: false});
    })
  }
}