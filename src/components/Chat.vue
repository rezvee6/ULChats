<template>
    <el-card class="box-card">

        <div class="chat-header">
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <div class="image-profile" >
                            <img  src="https://pbs.twimg.com/profile_images/919197168245751813/9hUje-Yq_400x400.jpg"
                                style=" border-radius: 50%; 
                                        max-height: 50px;">
                            </img>
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
                <div class="messages" v-for="(msg, index) in messages" :key="index">
                    <div class="chat">
                        <div  :class="{'chat-me' : msg.type == 'me','chat-you' : msg.type == 'you'}">
                            {{msg.message}}
                        </div>
                            <div class="clr">
                            </div>
                        <div class="user2">
                            <!-- <div class="image-profile" >
                                <img  src="https://pbs.twimg.com/profile_images/919197168245751813/9hUje-Yq_400x400.jpg"
                                    style=" border-radius: 50%;
                                            float: left;
                                            max-height: 35px;
                                            border-right: 5px;
                                            margin-right: 10px;
                                            margin-bottom: 10px;">
                                </img>
                                
                            </div>
                            <div  class="chat-you">
                                {{msg.message}}
                            </div>
                            <div class="clr">
                            </div> -->
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
                <el-col :sm="8":xl="4" >
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
</template>

<script>
import io from 'socket.io-client';

export default {
    data() {
        return {
            user: '',
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
            this.socket.emit('SEND_MESSAGE', {
                type: 'you',
                user: this.user,
                message: this.message
            });
            this.message = ''

        }
        // Trying to emulate user2 sending back a message
       
        
    },
    created(){
            var names = ["Rez", "Ciaran", "Eoghan", "Tom", "John", "Pat", "Colin", "Ryan", "Sam", "Bill", "Tim", "larry", "jacob"]
            var name = names[Math.floor(Math.random() * Math.floor(13))]
            console.log(name)
            this.user = name
    },
    mounted() {
        this.socket.on('MESSAGE', (data) => {
            this.messages = [...this.messages, data];
        });


        this.socket.on('CLIENT_QUERY', (data) => {
            this.socket.emit('CLIENT_INFO', {
                type: 'clientInfo',
                user: this.user,
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
