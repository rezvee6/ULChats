<template>
<el-container>
        <el-aside width="30%">
          <SideMenu />
        </el-aside>
        <el-container>
          <el-main>
            <!-- <h1> Logged in as {{myUserName}} </h1> -->
            <Chat :username="this.myUserName"/>
          </el-main>
        </el-container>
      </el-container>
</template>

<script>
import Chat from './Chat'
import SideMenu from './SideMenu'
export default {
  name: 'app',
  components: {
    Chat,
    SideMenu
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