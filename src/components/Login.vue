<template>

  <el-row :gutter="20" style="padding-top:12vh">


<el-col :span="8" :offset="8">
  <el-card class="box-card" id="mainCard">
  <div slot="header" class="clearfix" style="padding-left:13vh">
    <img src="@/assets/logo.jpg" height="110vw">
  </div>
    <el-row :gutter="20">
      <el-col :span="20" :offset="2">
        <h1> Login </h1>
        <h5> Enter Username </h5>
        <el-input placeholder="Please input first name" v-model="inputs.username"></el-input>
        <br>
         <h5> Select Your Gender </h5>
        <el-select v-model="value" placeholder="Select">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <br>
        <h5> Enter Bio </h5>
        <el-input placeholder="Please input bio" v-model="inputs.bio"></el-input>
        <br>
        <br>
        <br>
        <el-button @click="goToChat" type="primary" size="large">Login</el-button>

      </el-col>
    </el-row>
  </el-card>
</el-col>
</el-row>


</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        inputs: {
          username: '',
          bio: '',
          gender: ''
        },
        options: [{
          value: 'Male',
          label: 'Male'
          },{
          value: 'Female',
          label: 'Female'
        }]
      }
    },
    methods: {
      goToChat() {
        this.$router.push({ name: 'Chat', params: { userId: this.inputs.username, bio: this.inputs.bio } })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#mainCard{
  height: 70vh;
  padding-top: 2vh;
  background-color: rgb(231, 241, 246)
}
</style>