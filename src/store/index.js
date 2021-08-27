import {createStore} from 'vuex'

export const store = createStore({
    state() {
        return {
        }
    },
    mutations: {
        setState(state, {name, value}) {
            state[name] = value
        }
    }
})