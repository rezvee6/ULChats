<template>
    <div id=friendsList>
        <!--<friendList-component v-for="friend in friends" :friend="frined"/>-->
        <div class="friend" :style="styleObject" v-for="friend in friends" v-on:click="selectFriend($event)" :friend="friend">
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
  export default {
        data() {
            return {
                friends: [
                    {
                        id: 1,
                        name: 'James',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822711_user_512x512.png',
                        msg: 'Puppy kitty ipsum dolor sit good dog tigger good boy furry teeth purr lazy cat run fast fish critters string.'
                    },
                    {
                        id: 2,
                        name: 'Jessica',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822739_user_512x512.png',
                        msg: 'Wag Tail tuxedo run bedding head chew food purr drool kisses carrier chirp toy ID tag slobbery smooshy.',
                    },
                    {
                        id: 3,
                        name: 'Heather',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822761_user_512x512.png',
                        msg: 'Rover maine coon cat speak harness whiskers mouse.',
                    },
                    {
                        id: 4,
                        name: 'Arthur',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822745_user_512x512.png',
                        msg: 'Toys stay finch polydactyl stay barky bark pet supplies food Buddy chirp Spike nap stick dog house throw.Tail collar leash Rover meow catch Scooby snacks.',
                    },
                    {
                        id: 5,
                        name: 'Francesca',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822715_user_512x512.png',
                        msg: 'Kitty bark string shake litter box toys polydactyl yawn polydactyl scratcher water dog stay cage nest slobber chirp water.',
                    },
                    {
                        id: 6,
                        name: 'Tina',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822726_user_512x512.png',
                        msg: 'Birds fur collar fluffy collar parakeet barky dog house run sit Buddy purr. Bird wag tail small animals groom vitamins Tigger.',
                    },
                    {
                        id: 6,
                        name: 'Tina',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822726_user_512x512.png',
                        msg: 'Birds fur collar fluffy collar parakeet barky dog house run sit Buddy purr. Bird wag tail small animals groom vitamins Tigger.',
                    },
                    {
                        id: 6,
                        name: 'Tina',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822726_user_512x512.png',
                        msg: 'Birds fur collar fluffy collar parakeet barky dog house run sit Buddy purr. Bird wag tail small animals groom vitamins Tigger.',
                    },
                    {
                        id: 6,
                        name: 'Tina',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822726_user_512x512.png',
                        msg: 'Birds fur collar fluffy collar parakeet barky dog house run sit Buddy purr. Bird wag tail small animals groom vitamins Tigger.',
                    },
                    {
                        id: 6,
                        name: 'Tina',
                        img: 'https://www.shareicon.net/data/128x128/2016/09/01/822726_user_512x512.png',
                        msg: 'Birds fur collar fluffy collar parakeet barky dog house run sit Buddy purr. Bird wag tail small animals groom vitamins Tigger.',
                    }
                ]
            }
        },
        methods:{
            selectFriend: function(event) {
                alert("Friend Selected!");
            }
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