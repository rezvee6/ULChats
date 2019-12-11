import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const mutations = {
    selectFriend (state, friend) {
        state.friend = friend
    },
    setPrivKey (state, key) {
      state.RSA_priv_key = key
    },
    setPubKey (state, key) {
      state.RSA_pub_key = key
    },
    addFriendPubKeys (state, data) {
      state.friend_pub_keys[data.friend] = data.key
    },

    addPassA (state, pass) {
      state.passA = pass
    },
    addPassB (state, pass) {
      state.passB = pass
    },
    addkAB (state, data) {
      state[kAB][data.friend]["key"] = data.key
    },
    // authorizeKab (state, data) {
    //   state.kAB[data.friend].authorized = data
    // }

}

var store = new Vuex.Store({
  state: {
    friend: '',
    RSA_priv_key: '',
    RSA_pub_key: '',
    friend_pub_keys:{},
    passA: '',
    passB: '',
    kAB:{},
  },
  mutations,
  strict: false
})

export default store
