import Message from './Message'

export default class GptRequestInfo {
    model: string;
    messages: Message[];
    stream: Boolean;

    constructor({ model = "gpt-3.5-turbo", messages = [new Message()], stream = false } = {}) {
        this.model = model
        this.messages = messages
        this.stream = stream
    }
}