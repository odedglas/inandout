import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {config} from '../config/firebase';

import util from '@util/'

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

      const fetchResult = {
        id: snapshot.key
      };

      const value = snapshot.val();
      if(!util.isObject(value)) {

        fetchResult.value = value;
        return fetchResult;
      }

      return {
        id: snapshot.key,
        ...snapshot.val()
      };
    });
  },

  fetchArray(path) {

    return database.ref(path).once('value').then((snapshot) => {

        const value = snapshot.val();
        const keys = Object.keys(value);

        return keys.map(key => {

          return {
            id: key,
            ...value[key]
          }
        })
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
