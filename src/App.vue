<template>
   <div id="app">
      <el-container>
        <el-aside width="30%">
          <SideMenu />
        </el-aside>
        <el-container>
          <el-main>
            <Chat />
          </el-main>
        </el-container>
      </el-container>
  </div>
</template>

<script>
import Chat from './components/Chat.vue'
import SideMenu from './components/SideMenu.vue'
//import io from 'socket.io-client';

export default {
  name: 'app',
  components: {
    Chat,
    SideMenu
  },
  data() {
        return {
            //onlineUsers: [],
            //socket : io('localhost:3001')
        }
  },
  mounted(){
    // this.socket.on('ONLINE_USERS', (data) => {
    //         this.onlineUsers = data.userObjects 
    //         console.log(this.onlineUsers)
            
    // });
  }
}
</script>

<style>

</style>
