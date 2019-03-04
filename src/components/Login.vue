<template>
<div>
  <el-row :gutter="20">
      <el-col :span="8" :offset="8">
      <h1> Login </h1>
      <h5> Enter Username </h5>
      <el-input placeholder="Please input first name" v-model="inputs.username"></el-input>
      <br>
      <h5> Enter Bio </h5>
      <el-input placeholder="Please input bio" v-model="inputs.bio"></el-input>
      <br>
      <br>
      <br>
      <el-button @click="goToChat" type="primary" size="large">Login</el-button>
      </el-col>
    </el-row>
  </div> 
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      inputs: {
        username: '',
        bio: '',
        gender: ''
      }
    }
  },
  methods: {
    goToChat() {
      console.log(this.inputs.username)
      this.$router.push({ name: 'Chat', params: {userId: this.inputs.username, bio: this.inputs.bio }})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
