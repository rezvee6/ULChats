<template>
<el-container>
        <el-aside width="30%">
          <SideMenu />
          <FriendsView />
        </el-aside>
        <el-container>
          <el-main>
            <Chat :username="this.myUserName"/>
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
      myUserName: ''
    }
  },
  beforeMount () {
    this.myUserName = this.$attrs.userId
  }
}
</script>