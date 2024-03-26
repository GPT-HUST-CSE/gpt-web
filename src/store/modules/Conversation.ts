import { defineStore } from "pinia";
import Message from '@/classes/Message'
import GptRequestInfo from '@/classes/GptRequestInfo'
import Conversation from '@/classes/Conversation'
import { requestChat } from '@/services/gpt'

const useConversationStore = defineStore("conversation", {
    state: () => ({
        conversations: [new Conversation()],
        currentIndex: 0,
        maxId: 1
    }),
    getters: {
        currentConversation(state) {
            let index = state.conversations.findIndex(item => item.id === state.currentIndex)
            return state.conversations[index]
        }
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
        },

        async addMessage(message: Message) {
            const currentIndex = this.currentIndex
            this.conversations[currentIndex].addMessage(message)
            const gptRequest = new GptRequestInfo({
                messages: this.conversations[currentIndex].messages
            })
            requestChat(gptRequest)
            .then(res => {
                const response = new Message({
                    ...res.data.choices[0].message,
                    time: new Date()
                })
                this.conversations[currentIndex].addMessage(response)
            })
            .catch(err => {
                console.log(err)
                if(err?.name === "AxiosError") {
                    if(err?.message.includes("timeout")) {
                        const response = new Message({
                            role: 'assistant',
                            content: err.message,
                            time: new Date()
                        })
                        this.conversations[currentIndex].addMessage(response)
                    }
                }
            })
            
        }
    }
})

export default useConversationStore