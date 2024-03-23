export default class Message {
    sender: string;
    content: string;

    // 构造函数
    constructor(sender: string, content: string) {
        this.sender = sender;
        this.content = content;
    }

    // 方法
    describe(): string {
        return `${this.sender} is ${this.content} years old.`;
    }
}