<template>
    <el-card class="box-card">

        <el-row :gutter="20">
            <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            <el-col :span="4">
                <div class="grid-content bg-purple-light" >
                    <el-button  type="text" @click="sendMessage">
                        <ion-icon size="large" name="call"></ion-icon>
                    </el-button>
                    <el-button type="text" >
                        <ion-icon size="large" name="videocam"></ion-icon>
                    </el-button>
                    <el-button type="text" >
                        <ion-icon size="large" name="settings"></ion-icon>
                    </el-button>
                </div>
            </el-col>
        </el-row>
        <div class="message-area-parent">
            <div class="message-area">
                <div class="messages" v-for="(msg, index) in messages" :key="index">
                    

                       
                        <div class="chat-me">
                            <span class="font-weight-bold" style="color: black;">{{msg.user}}</span>:
                             <span>{{ msg.message }}</span>
                        </div>                 
                </div>
            </div>
        </div>
            <!-- Commented out the select user -->
            
            
        <el-form ref="form" :model="formInLine" >
            <input type="text" v-model="user" class="form-control">
        </el-form>

        <el-row :gutter="20">
            <el-form >
                <el-col :span="20">
                    <el-form-item label="    ">
                        <el-input v-model="message"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4" >
                    <el-form-item>
                            <el-button  type="text" @click="sendMessage">
                                <ion-icon size="large" name="send"></ion-icon>
                            </el-button>
                            <el-button type="text" >
                                <ion-icon size="large" name="attach"></ion-icon>
                            </el-button>
                            <el-button type="text" >
                                <ion-icon size="large" name="images"></ion-icon>
                            </el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
          
    </el-card>
</template>

<script>
import io from 'socket.io-client';

export default {
    data() {
        return {
            user: 'John',
            message: '',
            messages: [],
            socket : io('localhost:3001')
        }
    },
    methods: {
        sendMessage(e) {
            this.socket.emit('SEND_MESSAGE', {
                user: this.user,
                message: this.message
            });
            this.message = ''

        },
        
        
    },
    mounted() {
        this.socket.on('MESSAGE', (data) => {
            this.messages = [...this.messages, data];
            // you can also do this.messages.push(data)
        });
    }
}
</script>

<style>
.message-area-parent{
    overflow: hidden;
    height: 500px;
}
.message-area{
    
    max-height: 500px;
    overflow-y: scroll;
    
    margin-right: -2%; /* PREVENT SCOLL BARmaximum width of scrollbar */
  
}

/**/
.input-area{
    
}
.chat-me{
    background: lightcoral;
    color: white;
    max-width: 50%;
    margin-bottom: 10px ;
    border-radius: 10px;
    padding: 5px;
    display: inline-block;
    
}

.chat-you {
    background: lightgreen;
    color: white;
    
    border-radius: 20px;
    padding: 5px;
    margin-left: 70px;
    margin-right: 60%;
    display: inline-block;
    
}





/**/
     .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .bg-purple {
    background: white;
  }
  .bg-purple-light {
    background: white;
  }
</style>
