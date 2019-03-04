<template>
    <div>
        <el-row>
            <el-col :span="6" style="height:6vh">
                <el-button @click="toggleSideMenu" type="primary" icon="el-icon-menu" plain style="width:100%; height:100%"></el-button>
            </el-col>
            <el-col :span="18">
                <el-input placeholder="Search" v-model="input"></el-input>
            </el-col>
        </el-row>
        
        <div v-if="this.isCollapse == false">
            <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
            <el-submenu index="1">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">Contacts</span>
                </template>
                <el-menu-item-group>
                <span slot="title">Settings</span>
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                <span slot="title">item four</span>
                <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">Calls</span>
            </el-menu-item>
            <el-menu-item index="3">
                <i class="el-icon-document"></i>
                <span slot="title">Start Converstation</span>
            </el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
        isCollapse: true
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      toggleSideMenu() {
          this.isCollapse = !this.isCollapse
      }
    }
}
</script>

<style>
</style>
