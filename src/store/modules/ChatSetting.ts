import { defineStore } from "pinia";
import { DEFAULT_HOST } from "@/constants";

const useChatSettingStore = defineStore('chatSettingStore', {
    state: () => {
        const chatSetData = localStorage.getItem('chatSet')
        if(chatSetData) return JSON.parse(chatSetData)
        return {
            defaultApi: DEFAULT_HOST,
            api: '',
            key: '',
        }
    },

    getters: {
        cur_api(state) {
            return state.api || this.defaultApi
        }
    },

    actions: {
        set_data(api: string, key: string) {
            this.api = api
            this.key = key
            localStorage.setItem('chatSet', JSON.stringify({
                defaultApi: this.defaultApi,
                api,
                key
            }))
        }
    }
})

export default useChatSettingStore