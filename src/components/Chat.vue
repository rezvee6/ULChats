<template>
    <el-card class="box-card" style = "background-color: rgb(231, 241, 246);  border-radius: 0 !important; overflow-y:hidden">
         <div style ="height:5vh; padding-bottom:1vh">
        <el-row>
          <el-col :span="10">
              <p style="color:rgb(170, 198, 210);text-align: left; display: inline"> Your Bio: {{this.bio}} </p>
          </el-col>
          <el-col :span="10">
              <el-row>
              <switches v-model="encrypted" theme="bootstrap" color="success"></switches> <span id="encryption_status" style="padding-left:10px">Encrypted Data: {{this.encrypted}}</span>
              </el-row>
         </el-col>
          <el-col :span="4">
         <p style="margin:0px;color:rgb(170, 198, 210); text-align: right; display: inline"> Logged in as <b><u>{{this.me}}</u></b> </p>
         </el-col>
        </el-row>
         </div>
       
        <div class="chat-header">
            <el-row type="flex" class="row-bg" justify="space-between">

                <el-col :span="6">
                     <div class="media-left">
                        <figure class="image">
                            <img src="" width="50vw">
                        </figure>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div style="text-align:center">
                    <h1> 
                        {{this.friend}}
                    </h1>
                    </div>
                </el-col>
                <el-col :span="6" >
                    <div class="grid-content bg-purple-light" >
                         
                        <el-button  type="text" >
                            <ion-icon size="large" name="call" style="color: rgb(108, 186, 214)"></ion-icon>
                        </el-button>
                        <el-button type="text" >
                            <ion-icon size="large" name="videocam" style="color: rgb(108, 186, 214)"></ion-icon>
                        </el-button>
                        <el-button type="text" >
                            <ion-icon size="large" name="settings" style="color: rgb(108, 186, 214)"></ion-icon>
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
                                    <ion-icon size="large" name="attach"  style="color: rgb(108, 186, 214)"></ion-icon>
                                </el-button>
                            </el-upload>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="message-area-parent">
            <div class="message-area">
                <div class="messages" v-for="(msg, index) in messages" :key="index">
                    <div class="chat">
                        <div v-if="msg.user != me" class="chat-me">
                            {{msg.message}}
                        </div>
                        <div class="clr"></div>
                        <div v-if="msg.user === me" class="chat-you">
                            {{msg.message}}
                        </div>
                        <div class="clr"></div>
                    </div>
                </div>
                <div class="files" v-for="(file, index) in fileList" :key="index">
                     <div v-if="file.user != me" class="chat-you">
                           Click send to share file!
                        </div>
                        <div class="clr"></div>
                        <div v-if="file.user === me" class="chat-me">
                            There is a file in the file tray if you wish to accept.
                        </div>
                        <div class="clr"></div>
                </div>
            </div>
        </div>

        <el-row :gutter="24" >
            <el-form @submit.prevent>
                <el-col :span="22" >
                        <el-input v-model="message" v-on:keyup.enter="sendMessage"></el-input>
                </el-col>
                <el-col :span="2" style="margin-top:-1vh">
                            <el-button  type="text" style="color: rgb(108, 186, 214)" @click="sendMessage">
                                <ion-icon size="large" name="send"></ion-icon>
                            </el-button>
                </el-col>
            </el-form>
        </el-row>
    </el-card>
</template>

<script>
import io from 'socket.io-client';
import {sampleNames} from './chat.js'
import {bus} from '../bus.js'
import store from '../store.js'
import { saveAs } from 'file-saver';
import { JSEncrypt } from 'jsencrypt';
const CryptoJS = require("crypto-js")
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
const crypto = require('crypto');
var b64toBlob = require('b64-to-blob');
import Switches from 'vue-switches';


export default {
    components: {
        Switches
    },
    data() {
        return {
            me: '',
            friend: '',
            message: '',
            messages: [],
            socket : io('localhost:3001'),
            fileList: [],
            dialogVisible: false,
            publicKey: null,
            privateKey: null,
            kAB_keys: {},
            kAB_auth: {},
            encrypted: true,
        }
    },
    watch:{
        // Trggered when encrypted changes i.e. when the toggle is clicked
        encrypted: function(){
            if(!this.encrypted){
                // Opens message dialog
                this.openInsecureMessagingWarning()
            }else{
                //Creates a message popup
                this.$message({
                    type:'success',
                    message: 'Action completed: Secure Messaging Mode'
                })
            }
        }

    },
    methods: {
        // Opens warning dialog to warn against using unencrypted messaging
        openInsecureMessagingWarning() {
            this.$confirm('Are you sure you want to use insecure mesaging. Your messages and files will not be encrypted end to end and data may be compromised', 'Insecure Messaging Risk', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'warning',
                    message: 'Action completed: Insecure Messaging Mode'
                });
            }).catch(() => {
                this.encrypted = true
                this.$message({
                    type: 'info',
                    message: 'Action canceled'
                });          
            });
        },

        // Opens dialog for to notify user about key generation issues
        openIssueGenKeyWarning() {
          this.$alert('There was a problem mutually generating a key with one or more of the online users.\nPlease try and login again!\nIf this issue persists I swear it was working when we tested it!', 'Oops!', {
            confirmButtonText: 'OK',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${ action }`
              });
            }
          });
        },

        // Called when the send button is pressed
        sendMessage(e) {
            if (this.encrypted){
                if(this.kAB_auth[this.friend]){
                    if(this.fileList.length != 0) {


                        let fileName = this.fileList[0].name
                        let fileType = fileName.split('.').pop();

                        let blob = new Blob([this.fileList[0].raw], {type : 'image/.' + fileType})
                        var reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onloadend = _ => {
                            let base64data = reader.result;
                            base64data = base64data.substr(base64data.indexOf(',')+1)
                            //console.log(base64data);
                            let encryptedFile = AES.encrypt(base64data, this.kAB_keys[this.friend]).toString();
                            let payload = {
                                user: this.friend,
                                from: this.$attrs.username,
                                fileName: fileName,
                                fileObj: encryptedFile,
                                encrypted: this.encrypted
                            }
                            this.socket.emit('SEND_FILE', payload);
                        }
                    }
                    if (this.message != '') {
                        // Encrypt the message using the mutully generated key
                        let encryptedMsg = AES.encrypt(this.message, this.kAB_keys[this.friend]).toString();
                        let messageObj = {
                            user: this.friend,
                            from: this.$attrs.username,
                            message: this.message,
                            encrypted: this.encrypted
                        }
                        // Add new message object to messages array
                        this.messages.push(messageObj)
                        let messageObj_encrypted = {
                            user: this.friend,
                            from: this.$attrs.username,
                            message: encryptedMsg,
                            encrypted: this.encrypted
                        }
                        // Send encrpyted message 
                        this.socket.emit('SEND_MESSAGE', messageObj_encrypted);
                        console.log("MESSAGE INFO > I have just sent an encrypted message: ")
                        console.log("MESSAGE INFO > ", this.message, " was encrypted and sent as: ", encryptedMsg)
                    }
                    this.fileList = []
                }else{
                    this.openIssueGenKeyWarning()
                }
            }else{
                if(this.fileList.length != 0) {
                        let fileObj = {
                            user: this.friend,
                            fileName: this.fileList[0].name,
                            file: this.fileList[0].raw,
                            encrypted: this.encrypted
                        }
                        this.socket.emit('SEND_FILE', fileObj);
                }
                if (this.message != '') {
                    // Add new message object to messages array
                    let messageObj = {    
                        user: this.friend,
                        from: this.$attrs.username,
                        message: this.message,
                        encrypted: this.encrypted
                    }
                    this.messages.push(messageObj)

                    // Send unencrpyted message 
                    this.socket.emit('SEND_MESSAGE', messageObj);
                    console.log("MESSAGE INFO > I have just sent an unencrypted message: ")
                    console.log("MESSAGE INFO > The following message was sent: ", this.message )    
                }
                this.fileList = []
            }
            this.message = ''
        },
        // File handlers
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(f) {
            this.$confirm('Do you want to accept this file?').then(_ => {
            if ('percentage' in f){
                console.log(f)
            } else {
                 saveAs(f, "Test_Image")
                 this.fileList = []
            }
        }).catch(_ => {
            this.$mesage.success("Successfully rejected a file")
            console.log(_)
        });

        },
        handleClose (done) {
            this.$confirm('Do you want to accept this file?')
                .then(_ => {
                    done();
                }).catch(_ => {});
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
        // Friend Choosen bus event fired by clicking a user in FriendsView
        bus.$on('friendChosen', _ => {
            this.friend = store.state.friend
            this.messages = []
        })
    },
    beforeMount() {
        this.me = this.$attrs.username
        this.bio = this.$attrs.bio

        // Received message forwarded by the server
        this.socket.on('MESSAGE', (data) => {
        if(data.encrypted){  
            console.log("MESSAGE INFO > I recieved the following encrypted message: ", data.message)
            //Check if a key was sucessfully mutually generated with this user
            if(this.kAB_auth[data.from]!=undefined){
                //access shared key from the store using the user as a key
                let sharedKey = this.kAB_keys[data.from] 
                //decrypt the message using the shared key
                let decrypted_message = AES.decrypt(data.message, sharedKey).toString(CryptoJS.enc.Utf8);
                console.log("MESSAGE INFO > I have successfully decrypted the message : ") 
                console.log(decrypted_message)
                // Push this new decrypted message inside an objects to the Messages array  
                let data_obj = {
                    user: data.user,
                    message: decrypted_message
                }
                this.messages.push(data_obj)
                }else{
                    //Display error dialog
                    this.openIssueGenKeyWarning()
                }
            }else{
                // Push new unencrypted message to the messages array 
                this.messages.push(data)
            }
        });

        // Received a file forwarded by the server
        this.socket.on('FILE', (data) => {
            if(data.encrypted){
                if (this.kAB_auth[data.from] != undefined) {
                    let sharedKey = this.kAB_keys[data.from]
                    let decrypted = CryptoJS.AES.decrypt(data.fileObj, sharedKey).toString(CryptoJS.enc.Utf8)
                    let fileType = data.fileName.split('.').pop();
                    var blob = b64toBlob(decrypted, "image/." + fileType);
                    // Push Actual blob
                    this.fileList.push(blob)
                }
            }
            else{
                console.log("I recieved a file")
                console.log("file", data)
                let fileType = data.fileName.split('.').pop();
                let blob = new Blob([data.file], {type : 'image/.' + fileType})
                this.fileList.push(blob)
            }
        })

        // ------------------ Protocol to Mutaully generate a shared key between two clients ------------------
        // Receive Step 1 on Client_B side
        this.socket.on('CLIENT_SECRET_1', (data) => {

            //load private Client_B's public and private keys
            let myPrivKey = store.state.RSA_priv_key
            let myPubKey = store.state.RSA_pub_key

            let recieve_crypt = new JSEncrypt()
            // decrypt AES key in payload using Client_B private key
            recieve_crypt.setKey(myPrivKey)
            let decrypted_key = recieve_crypt.decrypt(data.encrypted_key)

            // decrypt challenge object using the decrypted AES key
            let decrypted_bytes = AES.decrypt(data.payload_obj, decrypted_key)
            let decrypted_payload = JSON.parse(decrypted_bytes.toString(CryptoJS.enc.Utf8))

            // Load Client_A's public key from the store
            let friend_pub_key = store.state.friend_pub_keys[data.from]
            recieve_crypt.setKey(friend_pub_key)
            //Verify the digitally signed hash of the challenege
            let verified = recieve_crypt.verify(decrypted_payload.challenge, decrypted_payload.digitally_signed_hashed_challenge, CryptoJS.SHA256)

            if (verified) {
                console.log("MUTUAL KEY GEN PROTOCOL > STEP 1 COMPLETED SUCCESSFULLY")

                // ---------- STEP 2 -----------
                //Get pass_A from the decrypted payload
                let passA_text = decrypted_payload.challenge
                // Generate Challenge 128 bits (passB)
                let passB = crypto.randomBytes(16); 
                let passB_text = passB.toString('base64');

                // Save passB to the store 
                store.commit('addPassB', passB_text)

                // Generate secret key with passA & passB
                let secret = passA_text.concat(passB_text)
                let Kab = SHA256(secret)

                // Add kAB to thekAB_keys object using Client_A and the key
                this.kAB_keys[data.from] = Kab.toString()
                console.log("MUTUAL KEY GEN PROTOCOL > STEP 2 COMPLETED SUCCESSFULLY")

                // Prepare data for STEP 3 - encrypt passA with the newly generated key
                let encrypted_passA_text = AES.encrypt(passA_text, Kab.toString()).toString()

                // Generate a payload object consisting of Client_B's challenege and a repsonse
                let payload_obj = {
                    challenge: passB_text,
                    response: encrypted_passA_text
                }

                // Digitally sign and hash this payload using Client_B's private key
                recieve_crypt.setPrivateKey(store.state.RSA_priv_key)  
                let signed_payload_text = recieve_crypt.sign(JSON.stringify(payload_obj), CryptoJS.SHA256, "sha256").toString()

                // Construct a nested payload with the payload and digitally signed hash of the payload
                let nested_payload = {
                    payload: payload_obj,
                    signature: signed_payload_text
                }
                
                // Generate a random AES Key and use this key to encrypt the nested payload
                let aes_key = crypto.randomBytes(16); 
                let aes_key_text = aes_key.toString('base64')
                let encrypted_payload_text = AES.encrypt(JSON.stringify(nested_payload), aes_key_text).toString()

                //Encrypt this AES key with Client_A's public key
                recieve_crypt.setKey(friend_pub_key)
                let encrypted_key_text = recieve_crypt.encrypt(aes_key_text).toString()

                // Construct a object to be sent to Client_A
                let client_connect = {
                        from: this.$attrs.username,
                        to: data.from,
                        payload_obj: encrypted_payload_text,
                        encrypted_key: encrypted_key_text // maybe just the key
                }

                console.log("MUTUAL KEY GEN PROTOCOL > STEP 3 B->A")
                this.socket.emit('SEND_CLIENT_SECRET_3', client_connect)
            }
            else{
                // Display a warning dialog if there where issues verifying STEP 1
                this.openIssueGenKeyWarning()
            }
        })

        this.socket.on('CLIENT_SECRET_3', (data) => {
            
            let crypt3 = new JSEncrypt()

            // Decrypt the AES key using Client_A's private key
            crypt3.setPrivateKey(store.state.RSA_priv_key)
            let decrypted_key = crypt3.decrypt(data.encrypted_key)

            // Decrypt payload using the decrypted AES key
            let decrypted_bytes = AES.decrypt(data.payload_obj, decrypted_key)
            let decrypted_payload = JSON.parse(decrypted_bytes.toString(CryptoJS.enc.Utf8))

            // Load Client_B's public key from the store to verify to digitally signed hash
            let friend_pub_key = store.state.friend_pub_keys[data.from]
            crypt3.setPublicKey(friend_pub_key)
            let verified = crypt3.verify(JSON.stringify(decrypted_payload.payload), decrypted_payload.signature, CryptoJS.SHA256)
            
            if(verified){
                console.log("MUTUAL KEY GEN PROTOCOL > STEP 3 COMPLETED SUCCESSFULLY")
                this.kAB_auth[data.from] = true
                // ---------- STEP 4 ----------
                // Access passB from payload and save to store
                let passB_text = decrypted_payload.payload.challenge
                store.commit('addPassB', passB_text)

                // Generate secret key with passA & passB
                let secret = store.state.passA.concat(passB_text)
                let Kab = SHA256(secret)
                
                // Add kAB to thekAB_keys object using Client_B and the key
                this.kAB_keys[data.from] = Kab.toString()
                console.log("MUTUAL KEY GEN PROTOCOL > STEP 4 COMPLETED SUCCESSFULLY")

                // Prepare data for STEP 5 - encrypt passB with the the mutually generated key kAB
                let encrypted_passB = AES.encrypt(passB_text, Kab.toString()).toString()
                //construct an object to be sent to Client_B
                let client_connect = {
                    from: data.to,
                    to: data.from,
                    encrypted_passB: encrypted_passB
                }
                
            
                console.log("MUTUAL KEY GEN PROTOCOL > STEP 5 A->B")
                this.socket.emit('SEND_CLIENT_SECRET_5', client_connect)
                console.log(("MUTUAL KEY GEN PROTOCOL > PROTOCOL SUCCESSFUL READY FOR SECURE MESSAGING"))
            }else{
                // Display a warning dialog if there where issues verifying STEP 3
                this.openIssueGenKeyWarning()
            }


        })

        this.socket.on('CLIENT_SECRET_5', (data) => {

            
            if( store.state.passB == (AES.decrypt(data.encrypted_passB, this.kAB_keys[data.from]).toString(CryptoJS.enc.Utf8))) {
                this.kAB_auth[data.from] = true
                console.log("MUTUAL KEY GEN PROTOCOL > STEP 5 COMPLETED SUCCESSFULLY")
                console.log(("MUTUAL KEY GEN PROTOCOL > PROTOCOL SUCCESSFUL READY FOR SECURE MESSAGING"))
            }
            else {
                //issue here with mutiple sometimes ???
                this.kAB_auth[data.from] = true 
                this.openIssueGenKeyWarning()
            }
        })

        // When queried by server .. respond with username and socket id
        this.socket.on('CLIENT_QUERY', (data) => {
            // Generate public and private key
            let crypt = new JSEncrypt({default_key_size: 2056})
            this.privateKey = crypt.getPrivateKey()
            this.publicKey = crypt.getPublicKey()
            
            // Add public and private keys to store
            store.commit('setPubKey', this.publicKey)
            store.commit('setPrivKey', this.privateKey)

            // Send clients information back to server
            this.socket.emit('CLIENT_INFO', {
                type: 'clientInfo',
                user: this.me,
                bio: this.bio,
                public_key: this.publicKey,
                socketID: this.socket.id
            });
        });
    }
}
</script>



<style>

#encryption_status{
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    color: rgb(113, 156, 174);
}

body{
    
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 300;

}

.el-main{
    padding: 0px !important
}
.message-area-parent{
    overflow: hidden;
    height: 47.5vh;
  
}

.box-card{
        background-color: red;

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
    background: rgb(113, 156, 174);
    color: white;
    border-radius: 15px 10px 0px 15px;
    padding: 7px;
    max-width: 40%;
    float: right;
    
}


.chat-you {
    background: white;
    color: white;
    border-radius: 15px 15px 15px 0px;
    padding: 7px;
    max-width: 40%;
    float: left;
    color: rgb(99, 116, 123)
}
.clr{
    clear:both;
    padding-bottom: 10px;
}
/**/
.grid-content {
    float: right;
  }

  
</style>
