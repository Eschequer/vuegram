import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";
import * as fb from "../../firebase";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userProfile: {},
    posts: []
  },
  mutations: {
    setPosts(state, val) {
      state.posts = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    }
  },
  actions: {
    async createPost({ state, commit }, post) {
      await fb.postsCollection.add({
        createdOn: new Date(),
        content: post.content,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        comments: 0,
        likes: 0
      });
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get();

      // set user profile in state
      commit("setUserProfile", userProfile.data());

      // change route to dashboard
      if (router.currentRoute.path === "/login") {
        await router.push("/");
      }
    },
    async likePost({ commit }, post) {
      const userId = fb.auth.currentUser.uid;
      const docId = `${userId}_${post.id}`;

      // update post likes count
      await fb.postsCollection.doc(post.id).update({
        likes: post.likesCount + 1
      });

      // check if user has liked post
      const doc = await fb.likesCollection.doc(docId).get();
      if (doc.exists) {
        return;
      }

      // create post
      await fb.likesCollection.doc(docId).set({
        postId: post.id,
        userId: userId
      });
    },
    async login(context, form) {
      // sign user in
      const { user } = await fb.auth
        .signInWithEmailAndPassword(form.email, form.password)
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;

          if (errorCode === "auth/wrong-password") {
            alert("Wrong password!");
          } else {
            alert(errorMessage);
          }
        });

      // fetch user profile and set in state
      await context.dispatch("fetchUserProfile", user);
    },
    async logout({ commit }) {
      await fb.auth.signOut();

      // clear userProfile and redirect to /login
      commit("setUserProfile", {});
      await router.push("/login").catch(error => {
        return { error };
      });
    },
    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );

      // create user object in userCollections
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        title: form.title
      });

      // fetch user profile and set in state
      dispatch("fetchUserProfile", user);
    },
    async updateProfile({ dispatch }, user) {
      const userId = fb.auth.currentUser.uid;

      // update user object
      const userRef = await fb.usersCollection.doc(userId).update({
        name: user.name,
        title: user.title
      });

      dispatch("fetchUserProfile", { uid: userId });

      // update all posts by user
      const postDocs = await fb.postsCollection
        .where("userId", "==", userId)
        .get();
      postDocs.forEach(doc => {
        fb.postsCollection.doc(doc.id).update({
          userName: user.name
        });
      });

      // update all comments by user
      const commentDocs = await fb.commentsCollection
        .where("userId", "==", userId)
        .get();
      commentDocs.forEach(doc => {
        fb.commentsCollection.doc(doc.id).update({
          userName: user.name
        });
      });
    }
  },
  modules: {}
});

// realtime firebase

fb.postsCollection.orderBy("createdOn", "desc").onSnapshot(snapshot => {
  let postsArray = [];

  snapshot.forEach(doc => {
    let post = doc.data();
    post.id = doc.id;

    postsArray.push(post);
  });

  store.commit("setPosts", postsArray);
});

export default store;
