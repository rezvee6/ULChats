<template>
    <div id=friendsList>
        <!--<friendList-component v-for="friend in friends" :friend="frined"/>-->
        <div class="friend" :style="styleObject" v-for="friend in friends" v-on:click="selectFriend(friend)" :friend="friend">
            <div class="box">
                <article class="media">
                    <div class="media-left">
                        <figure class="image">
                            <img :src="friend.img">
                        </figure>
                    </div>
                    <div class="media-content">
                        <div class="content">
                            <p><strong>{{friend.name}}</strong></p>
                            <p id="smallText">{{friend.msg}}</p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script>

//Imports
import io from 'socket.io-client';
import store from '../store.js'
import {bus} from '../bus.js'
import { JSEncrypt } from 'jsencrypt';
let crypt = new JSEncrypt()
const CryptoJS = require("crypto-js")
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
const crypto = require('crypto');

export default {
    data() {
        return {
            socket: io('localhost:3001'),
            friends:[],
            friend_keys:{},
            publicKey: null,
            privateKey: null,
            keysGenerated: false,
            fakeFriends: [
                    {
                        id: 1,
                        name: 'James',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822711_user_512x512.png',
                        msg: 'Looking for help in Maths ...'
                    },
                    {
                        id: 2,
                        name: 'Jessica',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822739_user_512x512.png',
                        msg: 'Anyone have experience with Java??',
                    },
                    {
                        id: 3,
                        name: 'Heather',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822761_user_512x512.png',
                        msg: 'Chemistry report help!!',
                    },
                    {
                        id: 4,
                        name: 'Arthur',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822745_user_512x512.png',
                        msg: 'Anyone need help with programming??',
                    },
                    {
                        id: 5,
                        name: 'Francesca',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822715_user_512x512.png',
                        msg: 'Electronics labs need help please!!',
                    },
                    {
                        id: 6,
                        name: 'Tina',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822726_user_512x512.png',
                        msg: 'Comms and Networking need some help to understand a protocol.',
                    }],
            maleIcons: [],
            femaleIcons: [],
        }
    },
    methods:{
    
    // Event for click on a friend card
    selectFriend: function(friendCard) {
            store.commit('selectFriend', friendCard.name)
            bus.$emit('friendChosen')
        }
    },
    beforeMount() {

        for(var i in this.fakeFriends) {
            this.friends.push(this.fakeFriends[i])
            //console.log(this.fakeFriends[i])
        }
        
        // Broadcast of online users from server
        this.socket.on('ONLINE_USERS', data => {

            for(var i in data){

                // Save users public key to the store
                let obj = {
                    friend: data[i].user,
                    key: data[i].public_key
                }
                store.commit('addFriendPubKeys', obj)

                // ------------------ Beginning of Protocol to Mutaully generate a shared key between two clients ------------------

                //Check for previous key generation for this user 
                if(!this.keysGenerated && (data[i].user!=this.$attrs.username || (this.friend_keys[data[i].user] == undefined && data[i].user!=this.$attrs.username))){
                    
                    console.log("MUTUAL KEY GEN PROTOCOL > Mutually generating a shared key with " + data[i].user)
                    
                    let friend_publicKey = data[i].public_key; //friends public key used to encrypt challenge

                    // Generate Challenge 128bits (passA)
                    let passA = crypto.randomBytes(16);
                    let passA_text = passA.toString('base64');

                    // Save this to the store
                    store.commit('addPassA', passA_text)
                    // Create a key based on user, used to check if key is already generated for this user in future calls
                    this.friend_keys[data[i].user] = passA_text 

                    // Encrypt hash with our private key for digital signature.
                    crypt.setPrivateKey(store.state.RSA_priv_key)
                    let ds_h_passA_text = crypt.sign(passA.toString('base64'), CryptoJS.SHA256, "sha256").toString()
                    
                    // Generate a random AES Key
                    let aes_key = crypto.randomBytes(16); //used to encrypt message
                    let aes_key_text = aes_key.toString('base64')

                    // Construct the payload for Client_B
                    let payload_obj = {
                        challenge: passA_text,
                        digitally_signed_hashed_challenge: ds_h_passA_text,
                    }

                    //Use the randomly generated AES key to encrypt this payload
                    let encrypted_payload_text = AES.encrypt(JSON.stringify(payload_obj), aes_key_text).toString()
                    
                    // Use Client_B's public key to encrypt the AES key
                    crypt.setPublicKey(friend_publicKey)
                    let encrypted_key_text = crypt.encrypt(aes_key_text).toString()
                    
                    // Construct a object for Client_B including the payload and encrypted AES key
                    let client_connect = {
                        from: this.$attrs.username,
                        to: data[i].user,
                        payload_obj: encrypted_payload_text,
                        encrypted_key: encrypted_key_text // maybe just the key
                    }
                    
                    //Send this to the Server to be forwarded to Client_B
                    console.log("MUTUAL KEY GEN PROTOCOL > STEP 1 A->B")
                    this.socket.emit('SEND_CLIENT_SECRET_1', client_connect)
                }
            }
            this.keysGenerated = true;

            // Add new online users to user list
            this.friends = []
            for (var i in data) {
                let freindObj = {
                    id: i,
                    name: data[i].user,
                    img: 'https://www.shareicon.net/data/128x128/2016/09/01/822711_user_512x512.png',
                    msg: data[i].bio
                }
                if (freindObj.name !== this.$attrs.username) {
                    this.friends.unshift(freindObj)
                }
            }
            // Add fake friends to list for demo 
            for(var i in this.fakeFriends){
                this.friends.push(this.fakeFriends[i])
            }
        })
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Muli:400,800');
#friendsList{
    height: 62.7vh;
    background: #e6ecf1;
    font-family: 'Muli', sans-serif;
    margin-right: -5%;
    overflow-y: scroll;
 
}

strong {
  font-weight: 800;
}

p {
  line-height: 1.2;
  margin-top: 4px;
}

.friend {
  background-color: rgb(108, 186, 214);
  color: #ffffff;
  box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
  padding: 1vh;
 
}

.friend:hover {
  background-color: rgb(84, 177, 210);
  cursor: pointer;
}
  .media {
    display: flex;
  }
  img {
    width: 5vh;
    
  }
  small {
    font-size: 10px;
    color: #657786;
  }
#smallText{
    color: rgb(247,247,247);
    font-size: 90%;
}


</style>