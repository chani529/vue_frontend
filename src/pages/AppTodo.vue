<template>
  <v-app id="inspire">
    <div id="todoApp">
      <div class="container">
        <div class="col-md-6 offset-md-3">
          <h1 class="text-center mb-4">Todo 어플리케이션</h1>
          <input
            type="text"
            class="form-control mb-4"
            v-model="userInput"
            @keyup.enter="addNewTodo"
          />

          <div class="list-group mb-4">
            <template v-for="(todo, index) in activeTodoList">
              <!-- <todo
                v-bind:key="index"
                :label="todo.label"
                @component-click="toggleTodoState(todo)"
              /> -->
              <button class ="list-group-item text-left" @click="toggleTodoState(todo)" v-bind:key="index">
                {{todo.label}}
              </button>
            </template>
          </div>

          <div style="text-align: right">
            <button
              type="button"
              class="btn btn-sm"
              @click="changeCurrentState('active')"
            >
              할 일
            </button>
            <button
              type="button"
              class="btn btn-sm"
              @click="changeCurrentState('done')"
            >
              완료
            </button>
            <button
              type="button"
              class="btn btn-sm"
              @click="changeCurrentState('all')"
            >
              전체
            </button>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
// import Todo from "./components/Todo.vue";

export default {
  name: "TodoApp",
  data() {
    return {
      userInput: "",
      todoList: [],
      currentState: "active",
    };
  },
  computed: {
    activeTodoList() {
      return this.todoList.filter(
        (todo) =>
          this.currentState === "all" || todo.state === this.currentState
      );
    },
  },
  methods: {
    changeCurrentState(state) {
      this.currentState = state;
    },
    addNewTodo() {
      this.todoList.push({
        label: this.userInput,
        state: "active",
      });
      this.userInput = "";
    },
    toggleTodoState(todo) {
      todo.state = todo.state === "active" ? "done" : "active";
    },
  },
  components: {
    //Todo,
  },
};
</script>

<style>
#todoApp {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
