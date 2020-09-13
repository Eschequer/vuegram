<template>
  <div class="c-container">
    <a @click="$emit('close')">close</a>
    <p>add a comment</p>
    <form @submit.prevent>
      <textarea v-model.trim="comment"></textarea>
      <button @click="addComment()" :disabled="comment == ''" class="button">
        add comment
      </button>
    </form>
  </div>
</template>

<script>
import * as fb from "../../firebase";

export default {
  name: "CommentModal",
  props: ["post"],
  data() {
    return {
      comment: ""
    };
  },
  methods: {
    async addComment() {
      // create comment
      await fb.commentsCollection.add({
        createdOn: new Date(),
        content: this.comment,
        postId: this.post.id,
        userId: fb.auth.currentUser.uid,
        userName: this.$store.state.userProfile.name
      });

      // update comment count on post
      await fb.postsCollection.doc(this.post.id).update({
        comments: parseInt(this.post.comments) + 1
      });

      // close modal
      this.$emit("close");
    }
  }
};
</script>

<style scoped></style>
