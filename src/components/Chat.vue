<template>
    <div>
    <el-card class="box-card">
        <h1> Logged in as {{this.me}} </h1>
        <h3> Bio: {{this.bio}} </h3>
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
                        Talking to 
                        {{this.friend}}
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
                <div class="messages" v-for="(msg, index) in messages" :key="index">
                    <div class="chat">
                        <div v-if="msg.user != me" class="chat-you">
                            {{msg.message}}
                        </div>
                        <div class="clr"></div>
                        <div v-if="msg.user === me" class="chat-me">
                            {{msg.message}}
                        </div>
                        <div class="clr"></div>
                    </div>
                </div>
            </div>
        </div>

        <el-row :gutter="20" >
            <el-form >
                <el-col :sm="16" :xl="20">
                    <el-form-item label="">
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
import {bus} from '../bus.js'
import store from '../store.js'

export default {
    data() {
        return {
            me: '',
            friend: '',
            message: '',
            messages: [],
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
            console.log(this.message)
            let messageObj = {
                user: this.friend,
                message: this.message
            }
            this.socket.emit('SEND_MESSAGE', messageObj);
            this.messages.push(messageObj)
            this.message = ''
        }
    },
    created() {
        bus.$on('friendChosen', _ => {
            console.log("Setting friend to talk to")
            this.friend = store.state.friend
        })
        console.log(this.friend)
    },
    beforeMount() {
        this.me = this.$attrs.username
        this.bio = this.$attrs.bio

        this.socket.on('MESSAGE', (data) => {
            console.log("I recieved a message")
            console.log("message: ", data)
            console.log("messagesRecieved: ", this.messages)
            // guessing this is just a weird push?
            this.messages = [...this.messages, data];
            // this.messagesRecieved.push(data) ?
        });

        // When queried by server .. respond with username and socket id
        this.socket.on('CLIENT_QUERY', (data) => {
            console.log("I was queried by the server!")
            this.socket.emit('CLIENT_INFO', {
                type: 'clientInfo',
                user: this.me,
                bio: this.bio,
                socketID: this.socket.id
            });
        });
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
