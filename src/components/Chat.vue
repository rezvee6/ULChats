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
                <div class="files" v-for="(file, index) in fileList" :key="index">
                     <div v-if="file.user != me">
                            {{file}}
                        </div>
                        <div class="clr"></div>
                        <div v-if="file.user === me">
                            {{file}}
                        </div>
                        <div class="clr"></div>
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
                            <el-upload
                                class="upload-demo"
                                action=""
                                multiple
                                :auto-upload="false"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-change="handleChange"
                                :before-remove="beforeRemove"
                                :file-list="fileList">
                                <el-button size="small" type="text">
                                    <ion-icon size="large" name="attach"></ion-icon>
                                </el-button>
                                <!-- <div slot="tip" class="el-upload__tip">jpg/png files</div> -->
                            </el-upload>
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
import { saveAs } from 'file-saver';

export default {
    data() {
        return {
            me: '',
            friend: '',
            message: '',
            messages: [],
            socket : io('localhost:3001'),
            fileList: [],
        }
    },
    methods: {
        sendMessage(e) {
            // maintain a local copy of messages sent
            console.log("The following message was sent: ", this.message)
            console.log(this.message)
            
            console.log("Files uploaded: ", this.fileList)
            if(this.fileList.length != 0) {            
                let fileObj = {
                    user: this.friend,
                    fileName: this.fileList[0].name,
                    file: this.fileList[0].raw
                }
                this.socket.emit('SEND_FILE', fileObj);
            }

            let messageObj = {
                user: this.friend,
                message: this.message
            }

            this.socket.emit('SEND_MESSAGE', messageObj);
            this.messages.push(messageObj)
            this.message = ''
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(f) {
            if ('percentage' in f){
                console.log(f)
            } else {
                // gets the file type from the filename
                let fileType = f.fileName.split('.').pop();
                let imageTypes = ["jpg", "png"]
                if (fileType in imageTypes) {
                    let blob = new Blob([f.file], {type : 'image/' + fileType})
                    saveAs(blob, f.fileName)
                } else {
                    let file = new File([f.file], f.fileName, {type: "text/plain;charset=utf-8"});
                    saveAs(file)
                }

            }
        },
        handleExceed(files, fileList) {
            this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`Cancel the transfert of ${ file.name } ?`);
        },
        handleChange(file, fileList) {
            this.fileList.push(file)
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
            this.messages.push(data)
        });

        this.socket.on('FILE', (data) => {
            console.log("I recieved a file")
            console.log("file", data)
            this.fileList.push(data)
        })

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
