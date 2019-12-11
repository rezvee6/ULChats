<template>
  <el-row :gutter="20">
    <el-col :span="18" :offset="3">
      <el-container id="mainCont">
        <el-aside width="30%">
          <SideMenu />
          <FriendsView :username="this.myUserName" />
        </el-aside>
        <el-container>
          <el-main>
            <Chat :username="this.myUserName" :bio="this.myBio"/>
          </el-main>
        </el-container>
      </el-container>
    </el-col>
  </el-row>
</template>

<script scoped>
import Chat from './Chat'
import SideMenu from './SideMenu'
import FriendsView from './FriendsView'
export default {
  name: 'app',
  components: {
    Chat,
    SideMenu,
    FriendsView
  },
  data () {
    return {
      myUserName: '',
      myBio: ''
    }
  },
  beforeMount () {
    this.myUserName = this.$attrs.userId
    this.myBio = this.$attrs.bio
  }
}
</script>

<style scoped>

#mainCont{
  padding-top: 10vh;
  height:85vh;
}

.el-aside{
  width: 30%;
  overflow-x: hidden;
  overflow-y: hidden; 
}

.el-container{
  margin: 0px !important;
  padding-left: 0px !important;
}



</style>