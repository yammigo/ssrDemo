import {
    fetchUser,
    fetchItems,
    fetchIdsByType
} from '../api'
const { resolve } = require("path")
import axios from "axios"

export default {
    GET_USER: ({ commit, dispatch, state }) => {
        return new Promise((resolve, reject) => {
            console.log("获取用户信息")
            console.log(resolve(__dirname, "../../data/demo.json"))
            axios.get("./data/demo.json" + "?" + Math.random().toString(16)).then(res => {
                console.log("加载数据")
                state.user = res;

                resolve({});
            }).catch(error => {
                console.log("加载错误")
                state.user = error.message;
                // commit('SET_UDATA', error.message);
                reject()
            })
        })
    },
    // ensure data for rendering given list type
    FETCH_LIST_DATA: ({ commit, dispatch, state }, { type }) => {

        commit('SET_ACTIVE_TYPE', { type })
        return fetchIdsByType(type)
            .then(ids => commit('SET_LIST', { type, ids }))
            .then(() => dispatch('ENSURE_ACTIVE_ITEMS'))
    },

    // ensure all active items are fetched
    ENSURE_ACTIVE_ITEMS: ({ dispatch, getters }) => {
        return dispatch('FETCH_ITEMS', {
            ids: getters.activeIds
        })
    },

    FETCH_ITEMS: ({ commit, state }, { ids }) => {
        // on the client, the store itself serves as a cache.
        // only fetch items that we do not already have, or has expired (3 minutes)
        const now = Date.now()
        ids = ids.filter(id => {
            const item = state.items[id]
            if (!item) {
                return true
            }
            if (now - item.__lastUpdated > 1000 * 60 * 3) {
                return true
            }
            return false
        })
        if (ids.length) {
            return fetchItems(ids).then(items => commit('SET_ITEMS', { items }))
        } else {
            return Promise.resolve()
        }
    },

    FETCH_USER: ({ commit, state }, { id }) => {
        return state.users[id] ?
            Promise.resolve(state.users[id]) :
            fetchUser(id).then(user => commit('SET_USER', { id, user }))
    }
}