export default class Message {
    role: string;
    content: string;
    time: Date;

    // 构造函数
    constructor({role = "user", content = "你是谁", time = new Date()} = {}) {
        this.role = role;
        this.content = content;
        this.time = time;
    }

    // 方法
    describe(): string {
        return `${this.role} is ${this.content} years old.`;
    }
}