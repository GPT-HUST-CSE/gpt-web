import { defineStore } from "pinia";
import Message from '@/classes/Message'
import Conversation from '@/classes/Conversation'

const useConversationStore = defineStore("conversation", {
    state: () => {
        const data = localStorage.getItem('conversations')
        if(!data) {
            return {
                conversations: [new Conversation()],
                currentIndex: 0,
                maxId: 1
            }
        }
        const conversations: Conversation[] = JSON.parse(data).conversations.map((v: Conversation, idx: number) => {
            const conversation =  new Conversation({
                id: idx,
                title: v.title,
                time: v.time,
                prompt: v.prompt
            })
            for(const message of v.messages) {
                conversation.addMessage(new Message(message))
            }
            return conversation
        })

        return {
            conversations,
            currentIndex: 0,
            maxId: conversations.length
        }
    },
    getters: {
        currentConversation(state) {
            let index = state.conversations.findIndex(item => item.id === state.currentIndex)
            return state.conversations[index]
        },
        getConversationById(state) {
            return (id: number) => {
                let index = state.conversations.findIndex(item => item.id === id)
                return state.conversations[index]
            }
        }
    },
    actions: {
        saveMessage() {
            const data = {
                conversations: this.conversations,
            }
            localStorage.setItem('conversations', JSON.stringify(data))
        },

        updateMessageName(name: string) {
            const conversation = this.currentConversation
            conversation.title = name
            this.saveMessage()
        },

        addConversation(data: object) {
            this.conversations.push(new Conversation({ ...data, id: this.maxId }))
            this.maxId++
            this.saveMessage()
        },

        deleteConversation(id: number) {
            let index = this.conversations.findIndex(item => item.id === id)
            if (index !== -1) this.conversations.splice(index, 1)
            if (this.conversations.length === 0) this.addConversation({})
            if (id === this.currentIndex) this.currentIndex = this.conversations[0].id
            this.saveMessage()
        },

        updateMessage(id: number, payload: Message, generating: boolean = false) {
            const conversation = this.getConversationById(id)
            if(!conversation) return
            Object.assign(conversation.lastMessage(), payload)
            conversation.generating = generating
            // conversation.lastMessage().content = payload
            this.saveMessage()
        },

        addMessage(message: Message) {
            const conversation = this.currentConversation
            conversation.addMessage(message)
            // const gptRequest = new GptRequestInfo({
            //     messages: conversation.messages,
            //     stream: true
            // })
            
            // requestChat(gptRequest)
            // .then(res => {
            //     const response = new Message({
            //         ...res.data.choices[0].message,
            //         time: new Date()
            //     })
            //     conversation.addMessage(response)
            // })
            // .catch(err => {
            //     console.log(err)
            //     if(err?.name === "AxiosError") {
            //         if(err?.message.includes("timeout")) {
            //             const response = new Message({
            //                 role: 'assistant',
            //                 content: err.message,
            //                 time: new Date()
            //             })
            //             conversation.addMessage(response)
            //         }
            //     }
            // })

            this.saveMessage()
        }
    }
})

export default useConversationStore