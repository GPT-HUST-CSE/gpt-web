interface MessageParams {
    role?: string;
    content?: string;
    time?: Date;
    images?: string[];
}

export default class Message {
    role: string;
    content: string;
    time: Date;
    images: string[];

    // 构造函数
    constructor({role = "user", content = "你是谁", time = new Date(), images = []}: MessageParams = {}) {
        this.role = role;
        this.content = content;
        this.time = time;
        this.images = images;
    }

    // 方法
    describe(): string {
        return `${this.role} is ${this.content} years old.`;
    };

    addImages(...images: string[]) {
        this.images.push(...images)
    }
}