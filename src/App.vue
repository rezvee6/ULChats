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

export default {
  name: 'app',
  components: {
    Chat,
    SideMenu
  }
}
</script>

<style>

</style>
