<template>
    <el-card class="box-card">

        <el-row :gutter="20">
            <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            <el-col :span="4">
                <div class="grid-content bg-purple-light top-icons" >
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
                       
                        <!-- <div class="chat-me">
                            <span class="font-weight-bold" style="color: black;">{{msg.user}}</span>:
                            <span>{{ msg.message }}</span>
                        </div>     -->
                    <div class="chat">
                        <div class="chat-me">
                            {{msg.message}}
                        </div>
                        <div class="clr">

                        </div>
                        <div class="chat-you">
                            <span class="font-weight-bold" style="color:black;">{{msg.user}} </span> {{msg.message}}
                        </div>
                        <div class="clr">

                        </div>
                    </div>



                </div>
            </div>
        </div>
            <!-- Commented out the select user -->
            
            
        <!-- <el-form ref="form" :model="formInLine" >
            <input type="text" v-model="user" class="form-control">
        </el-form> -->

        <el-row :gutter="20">
            <el-form >
                <el-col :span="20">
                    <el-form-item label="    ">
                        <el-input v-model="message"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4" >
                    <el-form-item class="top-icons">
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






/**/
.top-icons{
    text-align: center;
}
.chat {
    position: relative;
    border-radius: .4em;
    padding-left: 10px;
    padding-right: 10px;
    
    
}
.chat-me {
    background: lightseagreen;
    color: white;
    border-radius: 15px 10px 0px 15px;
    padding: 7px;

    max-width: 40%;
    float: right;
}
.chat-you {
    background: lightcoral;
    color: white;
    border-radius: 10px 15px 15px 0px;
    padding: 7px;
    max-width: 40%;
    float: left;
}

	

.clr{
    clear:both;
    padding-bottom: 10px;
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
