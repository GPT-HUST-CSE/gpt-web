import axios from 'axios'

export const DEFAULT_HOST = 'https://api.openai.com';
export const API2D_HOST = 'https://openai.api2d.net'

export const GptRequest = axios.create({
    baseURL: API2D_HOST,
    timeout: 10000,
    headers: {
        Authorization: "Bearer fk225073-KCzjQokxqpHThWf6uNvyOCTrMFGDwwRt",
        "Content-Type": "application/json"
    }
})