<template>
  <v-app id="inspire">
    <MainMenu></MainMenu>
    <v-main>
      <Todo></Todo>
    </v-main>
  </v-app>
</template>

<script>
import Todo from "../components/Todo";
import MainMenu from "../components/MainMenu";
export default {
  components: { Todo, MainMenu },
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

