<template>
    <div>
    <el-card class="box-card">
         <h1> Logged in as {{this.me}} </h1>
         <hr>
        <div class="chat-header">
            <el-row type="flex" class="row-bg" justify="space-between">

                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <div class="image-profile" >
                            <img  src="https://pbs.twimg.com/profile_images/919197168245751813/9hUje-Yq_400x400.jpg"
                                style=" border-radius: 50%; 
                                        max-height: 50px;">
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <h1> 
                        {{this.user}}
                    </h1>
                </el-col>
                <el-col :span="6" >
                    <div class="grid-content bg-purple-light" >
                        <el-button  type="text" >
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
        </div>
        <div class="message-area-parent">
            <div class="message-area">
                <div class="messages" v-for="(msg, index) in messagesSent" :key="index">
                    <div class="chat">
                        <div>
                            {{msg.message}}
                        </div>
                    </div>
                </div>
                <div class="messages" v-for="(msg, index) in messagesRecieved" :key="index">
                    <div class="chat">
                        <div>
                            {{msg.message}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <el-row :gutter="20" >
            <el-form >
                <el-col :sm="16" :xl="20">
                    <el-form-item label="    ">
                        <el-input v-model="message"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="8" :xl="4" >
                    <el-form-item style="text-align:center;">
                            <el-button  type="text" style="color: turquoise;" @click="sendMessage">
                                <ion-icon size="large" name="send"></ion-icon>
                            </el-button>
                            <el-button type="text" >
                            <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :before-remove="beforeRemove"
                            >
                            <ion-icon size="large" name="attach"></ion-icon>
                            </el-upload>
                            </el-button>
                    </el-form-item>
                    
                </el-col>
            </el-form>
        </el-row>
    </el-card>
    </div>
</template>

<script>
import io from 'socket.io-client';
import {sampleNames} from './chat.js'

export default {
    data() {
        return {
            me: '',
            user: '',
            message: '',
            messagesSent: [],
            messagesRecieved: [],
            socket : io('localhost:3001')
        }
    },
    methods: {
        beforeRemove(file) {
            return this.$confirm('Remove '+ file.name +'?');
        },
        sendMessage(e) {
            
            // maintain a local copy of messages sent
            console.log("The following message was sent: ", this.message)
            this.messagesSent.push(this.message)
            console.log("messagesSent: ", this.messagesSent)
            this.socket.emit('SEND_MESSAGE', {
                user: this.user,
                message: this.message
            });
            this.message = ''
        }
    },
    created() {
        // Grabs a random index from the names array & assign to local scope
        var me = sampleNames[Math.floor(Math.random() * Math.floor(13))]
        var name = sampleNames[Math.floor(Math.random() * Math.floor(13))]
        this.user = name
        // this.me = me
    },
    beforeMount() {

        this.me = this.$attrs.username

        this.socket.on('MESSAGE', (data) => {
            console.log("I recieved a message")
            console.log("messagesRecieved: ", this.messagesRecieved)
            // guessing this is just a weird push?
            this.messagesRecieved = [...this.messagesRecieved, data];
            // this.messagesRecieved.push(data) ?
        });

        // When queried by server .. respond with username and socket id
        this.socket.on('CLIENT_QUERY', (data) => {
            console.log("I was queried by the server!")
            this.socket.emit('CLIENT_INFO', {
                type: 'clientInfo',
                user: this.me,
                socketID: this.socket.id
            });
        });

        this.socket.on('ONLINE_USERS', data => {
            console.log("Recieved broadcast information")
            console.log("bdata: ", data)
        })
    }
}
</script>



<style>

body{
    
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 300;

}

.message-area-parent{
    overflow: hidden;
    height: 500px;
}
.message-area{
    max-height: 500px;
    overflow-y: scroll;
    margin-right: -2%; /* PREVENT SCOLL BAR maximum width of scrollbar */
  
}

.el-button{
    padding: 0px;
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

.img{
    border-radius: 50%;
    float: left;
    max-height: 35px;
    border-right: 5px;
    margin-right: 10px;
    
}
.chat-you {
    background: lightcoral;
    color: white;
    border-radius: 15px 15px 15px 0px;
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
    float: right;
  }
  .bg-purple {
    background: white;
  }
  .bg-purple-light {
    background: white;
  }
</style>
