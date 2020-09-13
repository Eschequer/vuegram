import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBR71A24w1rmBzuLN9SJU7L6nlUgNkalgw",
  authDomain: "my-project-1543526494526.firebaseapp.com",
  databaseURL: "https://my-project-1543526494526.firebaseio.com",
  projectId: "my-project-1543526494526",
  storageBucket: "my-project-1543526494526.appspot.com",
  messagingSenderId: "247840238988",
  appId: "1:247840238988:web:b58228d547f3bf5881baa9"
};

firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();
const auth = firebase.auth();

// collection references
const usersCollection = db.collection("users");
const postsCollection = db.collection("posts");
const commentsCollection = db.collection("comments");
const likesCollection = db.collection("likes");

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
};
