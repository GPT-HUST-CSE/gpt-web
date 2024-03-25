export default class Message {
    sender: string;
    content: string;
    time: Date;

    // 构造函数
    constructor({sender = "user", content = "请输入内容", time = new Date()} = {}) {
        this.sender = sender;
        this.content = content;
        this.time = time;
    }

    // 方法
    describe(): string {
        return `${this.sender} is ${this.content} years old.`;
    }
}