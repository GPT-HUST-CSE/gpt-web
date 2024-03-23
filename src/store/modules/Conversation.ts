import { defineStore } from "pinia";

import Conversation from '@/classes/Conversation'

const useConversationStore = defineStore("conversation", {
    state: () => ({
        conversations: [new Conversation()],
        currentIndex: 0,
        maxId: 1
    }),
    getters: {

    },
    actions: {
        addConversation(data: object) {
            this.conversations.push(new Conversation({ ...data, id: this.maxId }))
            this.maxId++
        },

        deleteConversation(id: number) {
            let index = this.conversations.findIndex(item => item.id === id)
            if (index !== -1) this.conversations.splice(index, 1)
            if (this.conversations.length === 0) this.addConversation({})
            if (id === this.currentIndex) this.currentIndex = this.conversations[0].id
        }
    }
})

export default useConversationStore