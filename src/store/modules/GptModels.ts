import { defineStore } from "pinia";

const useGptModels = defineStore('gptModels', {
    state: () => {
        return {
            currentModel: localStorage.getItem('currentModel') || 'gpt-3.5-turbo',
            models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4o', 'gpt-4-turbo', 'gpt-4o-mini']
        }
    },

    actions: {
        setModel(model: string) {
            if(this.models.includes(model)) {
                this.currentModel = model
                localStorage.setItem('currentModel', model)
            }
        }
    }
})

export default useGptModels