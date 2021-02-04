<template>
  <v-app id="inspire">
  <MainMenu></MainMenu>

    <v-main>
      <PostDetail></PostDetail>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import PostDetail from "../components/PostDetail";
import MainMenu from "../components/MainMenu";
export default {
  components: { PostDetail,MainMenu },
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