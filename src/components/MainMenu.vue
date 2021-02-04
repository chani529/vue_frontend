<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link @click="todoLocation">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Todo</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Django And Vue (세션 미사용)</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn text href="/">Home</v-btn>
      <v-btn text href="/blog/post/list">Blog</v-btn>
      <v-btn text href="/admin">Admin</v-btn>
      <!-- <v-btn text>/</v-btn>
      <v-btn text href="/todo">todo</v-btn>
      <v-btn text href="/post_list.html">PostList</v-btn> -->
      <!-- <v-btn text href="/post_detail.html">PostDetail</v-btn> --> 

      <v-spacer></v-spacer>

      <v-menu offset-y left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon>mdi-account</v-icon>
            {{me.username }}
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <template v-if="me.username === 'Anonymous'">
            <v-list-item @click.stop = "dialogOpen('login')">
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
            <v-list-item @click.stop = "dialogOpen('register')">
              <v-list-item-title>Register</v-list-item-title>
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item @click="logout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
            <v-list-item @click.stop = "dialogOpen('pwdchg')">
              <v-list-item-title>Password change</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-app-bar>
<!-- 로그인 -->
     <v-dialog
        v-model="dialog.login"
        max-width="600"
      >
        <v-card class="elevation-12">
                <v-toolbar
                  color="primary"
                  dark
                  flat
                >
                  <v-toolbar-title>Login form<br/>(세션X 로그인 값이 서버에 저장되므로
                    종료 시 로그아웃)</v-toolbar-title>
              
                </v-toolbar>
                <v-card-text>
                  <v-form id ='login-form' ref="loginForm">
                    <v-text-field
                      label="Username"
                      name="username"
                      prepend-icon="mdi-account"
                      type="text"
                    ></v-text-field>
  
                    <v-text-field
                      label="Password"
                      name="password"
                      prepend-icon="mdi-lock"
                      type="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="grey" @click = "cancel('login')">cancle</v-btn>
                  <v-btn color="primary" class="mr-5" @click = "save('login')">Login</v-btn>
                </v-card-actions>
              </v-card>
      </v-dialog>
      <!-- Register -->
     <v-dialog
        v-model="dialog.register"
        max-width="600"
      >
        <v-card class="elevation-12">
                <v-toolbar
                  color="success"
                  dark
                  flat
                >
                  <v-toolbar-title>Register form (보안 취약)</v-toolbar-title>
              
                </v-toolbar>
                <v-card-text>
                  <v-form id ="register-form" ref= "registerForm" >
                    <v-text-field
                      label="Username"
                      name="username"
                      prepend-icon="mdi-account"
                      type="text"
                    ></v-text-field>
  
                    <v-text-field
                      label="Password (10자리 이상)"
                      name="password1"
                      prepend-icon="mdi-lock"
                      type="password"
                    ></v-text-field>
                            <v-text-field
                      label="Password again"
                      name="password2"
                      prepend-icon="mdi-lock"
                      type="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="grey" @click= "cancel('register')">cancle</v-btn>
                  <v-btn color="success" class="mr-5" @click= "save('register')">Register</v-btn>
                </v-card-actions>
              </v-card>
      </v-dialog>
      <!-- pwdchg -->
     <v-dialog
        v-model="dialog.pwdchg"
        max-width="600"
      >
        <v-card class="elevation-12">
                <v-toolbar
                  color="warning"
                  dark
                  flat
                >
                  <v-toolbar-title>Password change form</v-toolbar-title>
              
                </v-toolbar>
                <v-card-text>
                  <v-form id ="pwdchg-form" ref= "pwdchgForm">
  
                    <v-text-field

                      label="Old password"
                      name="old_password"
                      prepend-icon="mdi-lock"
                      type="password"
                    ></v-text-field>
                          <v-text-field
                      label="New Password"
                      name="new_password1"
                      prepend-icon="mdi-lock"
                      type="password"
                    ></v-text-field>
                          <v-text-field
                      label="New Password again"
                      name="new_password2"
                      prepend-icon="mdi-lock"
                      type="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="grey" @click= "cancel('pwdchg')">cancle</v-btn>
                  <v-btn color="warning" class="mr-5" @click= "save('pwdchg')">Password change</v-btn>
                </v-card-actions>
              </v-card>
      </v-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import EventBus from './event_bus';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
export default {
    data: () => ({
        drawer: null,
        dialog: {
          login: false,
          register: false,
          pwdchg: false,
          },
        me: { username: "Anonymous"},
    }),

    watch:{
      me(newVal, oldVal){
        console.log("watch.me()...",newVal,oldVal);
        EventBus.$emit('me_chanhe',newVal);
      }
    },
    created(){
      this.getUserInfo();

    },
    methods:{
      todoLocation(){
        location.href = "/todo";
      },
      dialogOpen(kind){
        console.log("dialogOpen()...",kind) 
        if(kind==='login') {
          this.dialog.login = true;
        }
        else if(kind==='register'){
          this.dialog.register = true;
        } 
        else if(kind==='pwdchg') {
          this.dialog.pwdchg = true;
        }
      },
      cancel(kind){
        console.log("cancel()...", kind);
        if(kind==='login') {
          this.dialog.login = false;
          this.$refs.loginForm.reset();
        }
        else if(kind==='register'){
          this.dialog.register = false;
          this.$refs.registerForm.reset();
        } 
        else if(kind==='pwdchg') {
          this.dialog.pwdchg = false;
          this.$refs.pwdchgForm.reset();
        }

      },
      save(kind){
        console.log("save()...",kind);
        if(kind === 'login'){
          this.login();
          this.dialog.login = false;
          this.$refs.loginForm.reset();
        } else if (kind === 'register'){
          this.register();
          this.dialog.register = false;
          this.$refs.registerForm.reset();
        } else if (kind === 'pwdchg'){
          this.pwdchg();
          this.dialog.pwdchg = false;
          this.$refs.pwdchgForm.reset();
        }
      },

      login(){
        console.log("login()...");
        const postData = new FormData(document.getElementById('login-form'));
        axios.post('/api/login/',postData)
        .then( res => {
          console.log("LOGIN POST RES", res);
          this.me = res.data;

        })
        .catch(err => {
          console.log("LOGIN POST ERR", err.response);
          alert("login NOK");
        });
      },
      register(){
        console.log("register()...");
        const postData = new FormData(document.getElementById('register-form'));
        axios.post('/api/register/',postData)
        .then( res => {
          console.log("REGISTER POST RES", res);
          alert(`user ${res.data.username} created OK`)
          // this.me = res.data;

        })
        .catch(err => {
          console.log("REGISTER POST ERR", err.response);
          alert("REGISTER NOK");
        });
      },
      logout(){
        console.log("logout()...");
        axios.get('/api/logout/')
        .then((res) =>{
          console.log("LOGOUT GET RES",res);
          alert(`user ${this.me.username} logout OK`)
          this.me = {username : 'Anonymous'};

        })
        .catch(err => {
          console.log("REGISTER POST ERR", err.response);
          alert("logout NOK");
        });
      },
      pwdchg(){
        console.log("pwdchg()...");
        const postData = new FormData(document.getElementById('pwdchg-form'));
        axios.post('/api/pwdchg/',postData)
        .then( res => {
          console.log("PWDCHG POST RES", res);
          alert(`user ${this.me.username} pwdchg OK`)
          // this.me = res.data;

        })
        .catch(err => {
          console.log("PWDCHG POST ERR", err.response);
          alert("PWDCHG NOK");
        });
      },
      getUserInfo(){
        console.log("getUserInfo()...");
        axios.get('/api/me/')
        .then( res => {
          console.log("GETUSERINFO GET RES", res);
          this.me = res.data;

        })
        .catch(err => {
          console.log("GETUSERINFO GET ERR", err.response);
          alert(err.response.status);
        });
      },
    },

};
</script>
<style>
</style>