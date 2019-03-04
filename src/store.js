import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const mutations = {
    selectFriend(state, friend) {
        state.friend = friend
    }
}

var store = new Vuex.Store({
  state: {
    friend: ''
  },
  mutations,
  strict: true
})

export default store
