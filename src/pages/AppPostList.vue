<template>
  <v-app id="inspire">
    <MainMenu></MainMenu>
    <v-main>
      <PostList></PostList>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import PostList from "../components/PostList";
import MainMenu from "../components/MainMenu";
export default {
  components: { PostList, MainMenu },
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
  }),
  created() {
    // this.$vuetify.theme.dark = true
  },
};
</script>