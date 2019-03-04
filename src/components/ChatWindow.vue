<template>
<el-container>
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
</template>

<script>
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