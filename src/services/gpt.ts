import { GptRequest } from '@/constants'
import GptRequestInfo from '@/classes/GptRequestInfo'

export const requestChat = async (request: GptRequestInfo) => {
    const messages = request.messages.map(message => ({
        role: message.role,
        content: message.content
    }));
    return GptRequest.post("/v1/chat/completions", {
        model: request.model,
        messages,
        stream: request.stream
    })
}