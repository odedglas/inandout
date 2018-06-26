import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {config} from '../config/firebase';

if (!firebase.apps.length) {
  console.log('Initalizing firbase, existing apps: ' + firebase.apps.length);
  firebase.initializeApp(config);
}

const auth = firebase.auth(), database = firebase.database();

export default {
  auth,
  database,
  initUser(user) {
    this.user = user;
  },
  createUser(id, user) {
    return database.ref(`users/${id}`).set({
      user
    })
  },
  fetch(path) {

    return database.ref(path).once('value').then((snapshot) => {

      return {
        id: snapshot.key,
        ...snapshot.val()
      };
    });
  },
  fetchByKeys(path, keys) {

    let promises = [];
    keys.forEach(key => {

      promises.push(
        this.fetch(`${path}/${key}`)
      );
    });

    return Promise.all(promises);
  },
  createProject(project) {

    return database.ref(`projects`).push(project)
      .then(res => {

        const projectKey = res.key;

        //Adding to user projects
        database.ref(`users/${project.owner}/projects`).push({
          projectKey
        });

        //Adding to projects identifiers
        database.ref('projectsIdentifier/' + project.identifier).set(
          projectKey
        );

        return {
          ...project,
          id: projectKey
        }
      });
  }
}
