<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="posts"
      sort-by="name"
      class="elevation-1"
      :items-per-page="5"
      @click:row="serverPage"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Post List</v-toolbar-title>
          <span v-if="tagname" class="body-1 font-italic ml-3"
            >(with {{ tagname }} tagged)</span
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click.stop="dialogOpen('create', {})"
            >New Post</v-btn
          >
          <v-dialog v-model="dialogDelete" max-width="800px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click.stop="dialogOpen('update', item)"> mdi-pencil </v-icon>
        <v-icon small @click.stop="deletePost(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="fetchPostList"> Reset </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-form id="post-form" ref="postForm">
            <v-text-field label="ID" name="id" v-model="editedItem.id" readonly></v-text-field>
            <v-text-field label="TITLE" name="title" v-model="editedItem.title"></v-text-field>
            <v-text-field label="DESCRIPTION" name="description" v-model="editedItem.description"></v-text-field>
            <v-textarea label="CONTENT" name="content" outlined v-model="editedItem.content"></v-textarea>
            <v-text-field label="OWNER" name="owner" v-model="editedItem.owner" readonly></v-text-field>
            <v-text-field label="TAGS" name="tags" v-model="editedItem.tags"></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import EventBus from './event_bus';
export default {
  //name: "HelloWorld",

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "제 목", value: "title" },
      { text: "요 일", value: "description" },
      { text: "수정일", value: "modify_dt" },
      { text: "작성자", value: "owner" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    posts: [],
    tagname: "",
    editedIndex: -1,
    editedItem: {},
    actionKind: '',
    me:{username : 'Anonymous'}

  }),

  computed: {
    formTitle() {
      // return this.editedIndex === -1 ? "New Item" : "Edit Item";
      if (this.actionKind === 'create') return 'Create Item';
      else return 'Update Item';
    },
  },

  created() {
    const params = new URL(location).searchParams;
    this.tagname = params.get("tagname");
    this.fetchPostList();

    EventBus.$on('me_chanhe', (val)=>{
      this.me =val;
    })
  },

  methods: {
    fetchPostList() {
      console.log("fetchPostList", this.tagname);
      let getUrl = "";
      if (this.tagname) getUrl = `/api/post/list?tagname=${this.tagname}`;
      else getUrl = "/api/post/list";

      axios
        .get(getUrl)
        .then((res) => {
          console.log("POST GET RES", res);
          this.posts = res.data;
        })
        .catch((err) => {
          console.log("POST GET RES", err.response);
          alert(err.response.status + " " + err.response.statusText);
        });
    },

    serverPage(item) {
      console.log("serverPage()...", item);
      location.href = `/blog/post/${item.id}/`;
    },

    dialogOpen(actionKind, item){
      console.log("cancel()...",actionKind, item);
      if (this.me.username === 'Anonymous' ){
        alert("Please login first !");
        return;
      }
      this.actionKind = actionKind;
      if( actionKind ==='create'){
        this.editedIndex = -1;
        this.editedItem = {};

      }else{
        this.editedIndex = this.posts.indexOf(item);
        this.editedItem =  Object.assign({},item);

      }
      this.dialog = true;
    },

    cancel(){
      console.log("cancel()...");
      this.dialog = false;
    },

    save(){
      console.log("save()...");

      if (this.actionKind === 'create') this.createPost();
      else this.updatePost();
      this.dialog = false;
    },
    createPost(){
      console.log("createPost()..."); 
      const postData = new FormData(document.getElementById('post-form'));
      axios.post('/api/post/create/',postData)
      .then(res=>{
        console.log('CREATE POST RES', res);
        this.posts.push(res.data);
      })
      .catch(err =>{
        console.log("CREATE POST ERR.RESPONSE", err.response);
        alert(err.response.status + ' '+ err.response.statusText);
      });
    },
    updatePost(){
      console.log("updatePost()..."); 
      const postData = new FormData(document.getElementById('post-form'));
      postData.set('owner',this.me.id);
      axios.post(`/api/post/${this.editedItem.id}/update/`,postData)
      .then(res=>{
        console.log('UPDATE PSOT GET RES', res);
        this.posts.splice(this.editedIndex,1, res.data);
      })
      .catch(err =>{
        console.log("UPDATE POST ERR>RESPONSE", err.response);
        alert(err.response.status + ' '+ err.response.statusText);
      });
    },
    deletePost(item){
      console.log("deleteItem()...",item);
      if (this.me.username === 'Anonymous' ){
        alert("Please login first !");
        return;
      }
      if (!confirm("Are you sure to delete ?")) return;
      axios.delete(`/api/post/${item.id}/delete/`)
      .then(res =>{
        console.log("POST DELETE RES", res);
        const index = this.posts.indexOf(item);
        console.log("INDEX : ", index);
        this.posts.splice(index, 1);
        console.log("INDEX END ");
      })
      .catch(err =>{
        console.log("POST DELETE ERR.RESPONSE", err.response);
        alert(err.response.status + ' '+ err.response.statusText);
      });
      
    },
  },
};
</script>

<style scoped>
.v-data-table >>> tbody > tr {
  cursor: pointer;
}
</style>