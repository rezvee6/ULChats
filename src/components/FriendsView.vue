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
                            <p>{{friend.msg}}</p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client';
import store from '../store.js'
import {bus} from '../bus.js'

export default {
    data() {
        return {
            socket: io('localhost:3001'),
            friends: []
        }
    },
    methods:{
        selectFriend: function(friendCard) {
            store.commit('selectFriend', friendCard.name)
            bus.$emit('friendChosen')
        }
    },
    beforeMount() {
        this.socket.on('ONLINE_USERS', data => {
            console.log("Recieved broadcast information within friends view")
            console.log("bdata: ", data)
            this.friends = []
            for (var i in data) {
                console.log(data)
                let freindObj = {
                    id: i,
                    name: data[i].user,
                    img: 'https://www.shareicon.net/data/128x128/2016/09/01/822711_user_512x512.png',
                    msg: data[i].bio
                }
                if (freindObj.name !== this.$attrs.username) {
                    this.friends.push(freindObj)
                }
            }
        })
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Muli:400,800');
#friendsList{
    height: 1080px;
    background: #e6ecf1;
    font-family: 'Muli', sans-serif;
    max-width: 100%;
    margin: 30px auto;
    overflow:scroll;
    overflow-x:hidden;
}

strong {
  font-weight: 800;
}

p {
  line-height: 1.2;
  margin-top: 5px;
}

.friend {
  background-color: #fff;
  color: #373737;
  box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
  padding: 30px;
 
    margin-top: 5px;
}

.friend:hover {
  background-color: rgba(247,247,247,1);
  cursor: pointer;
}
  .media {
    display: flex;
  }
  img {
    width: 80px;
    margin-right: 15px;
  }
  small {
    font-size: 14px;
    color: #657786;
  }



</style>