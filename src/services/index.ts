import GptRequestInfo from '@/classes/GptRequestInfo'
import { DEFAULT_HOST, DEFAULT_Authorization, API2D_HOST, Authorization } from '@/constants/index'
import { createParser } from 'eventsource-parser';
import { arrayBufferToBase64, getBase64ImageFromFile } from '@/utils/imagebase64';

import useImagesStore from '@/store/modules/Images';
const imagesStore = useImagesStore()

export interface IOnTextCallbackResult {
    text: string,
    cancle: () => void
}

import useChatSettingStore from '@/store/modules/ChatSetting';
const chatSettingStore = useChatSettingStore()
// const DEFAULT_HOST = chatSettingStore.defaultApi

const loadingImages = new Set()

export const getFileContentAsBase64 = async (fileId: string) => {
    const host = chatSettingStore.cur_api
    // const api_key = chatSettingStore.key
    // const apiUrl = `${DEFAULT_HOST}/v1/files/${fileId}/content`;
    const api_key = chatSettingStore.key
    const apiUrl = `${host}/v1/files/${fileId}/content`;
    if(loadingImages.has(fileId)) {
        const res_base64 = await new Promise((resolve, reject) => {
            try {
                let res = '', count = 0
                const intervalId = setInterval(() => {
                    count++
                    res = imagesStore.get_image(fileId)
                    if(res) {
                        clearInterval(intervalId)
                        resolve(res)
                    }
                    if(count === 10) {
                        clearInterval(intervalId)
                        reject('get image timeout!')
                    }
                }, 1000);
            } catch(error) {
                reject(error)
            }
        })
        return res_base64 as string
    }

    loadingImages.add(fileId)
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${api_key}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching file content: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const base64String = await arrayBufferToBase64(arrayBuffer);
    loadingImages.delete(fileId)
    return base64String;
}

export const updateFile = async (
    file: File,
    onText?: (res: string, base64: string) => void,
    onError?: (error: Error) => void
) => {
    if(!file) throw new Error('No files to upload')
    let hasCancle = false
    const controller = new AbortController()
    const cancle = () => {
        hasCancle = true
        controller.abort()
    }

    const file_base64 = await getBase64ImageFromFile(file)

    const formdata = new FormData()
    formdata.append("file", file, file.name);
    formdata.append("purpose", "vision");
    try {
        const host = chatSettingStore.cur_api
        const api_key = chatSettingStore.key
        fetch(
            `${host}/v1/files`,{
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${api_key}`,
                },
                body: formdata,
                signal: controller.signal
            }
        )
        .then(response => {
            // if (!response.ok) {
            //     throw new Error(`Error fetching file content: ${response.statusText}`);
            // }
            // if(response.status !== 200) {
            //     throw new Error(`Error from OpenAI: ${response.status} ${response.statusText}`);
            // }
            // if(!response.body) {
            //     throw new Error('No response body');
            // }
            return response.json()
        })
        .then(data => {
            if(Object.prototype.hasOwnProperty.call(data, 'error')) {
                throw new Error(data.error.message)
            }
            if(data?.object === 'error') {
                throw new Error(data.message)
            }
            onText?.(data.id, file_base64 as string)
        })
        .catch(error => {
            onError?.(error instanceof Error?error: new Error(error))
        })
    } catch(error) {
        if(hasCancle) return
        onError?.(error as Error)
        throw error
    }
}

export const completion = async (
    request: GptRequestInfo,
    onText?: (option: IOnTextCallbackResult) => void,
    onError?: (error: Error) => void
) => {
    if(request.messages.length === 0) {
        throw new Error('No messages to replay')
    }

    let hasCancle = false
    const controller = new AbortController()
    const cancle = () => {
        hasCancle = true
        controller.abort()
    }

    let fulltext = ''
    const promises_messages = request.messages.map(async (message) => {
        if(message.role !== 'user' || message.images.length === 0) {
            return {
                role: message.role,
                content: message.content
            }
        } else {
            const content: object[] = [{type: "text", text: message.content}]
            for(const image_id of message.images) {
                let image_base64 = imagesStore.get_image(image_id)
                if(!image_base64) {
                    image_base64 = await getFileContentAsBase64(image_id)
                    imagesStore.set_image(image_id, image_base64)
                }
                content.push({
                    type: "image_url",
                    image_url: {
                        url: image_base64
                    }
                })
            }
            return {
                role: message.role,
                content
            }
        }
    });

    const messages = await Promise.all(promises_messages)

    try {
        const host = chatSettingStore.cur_api
        const api_key = chatSettingStore.key
        const response = await fetch(
            `${host}/v1/chat/completions`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${api_key}`,
                    'Content-Type': `application/json`
                },
                body: JSON.stringify({
                    messages,
                    model: request.model,
                    // stream: request.stream
                    stream: true
                }),
                signal: controller.signal
            }
        )
        await handlerSSE(response, (message) => {
            if(message === '[DONE]') return
            const data = JSON.parse(message)
            if(data.error) {
                throw new Error(`Error from OpenAI: ${JSON.stringify(data)}`);
            }
            const text = data.choices[0]?.delta?.content;
            if(text !== undefined) {
                fulltext += text
                onText?.({text: fulltext, cancle})
            }
        })
    } catch(error) {
        if(hasCancle) return
        onError?.(error as Error)
        throw error
    }
    return fulltext
}

const handlerSSE = async function(response: Response, onMessage: (message: string) => void) {
    if(!response.ok) {
        const error = await response.json()?.catch(err => null)
        throw new Error(error? JSON.stringify(error):`${response.status} ${response.statusText}`)
    }
    if(response.status !== 200) {
        throw new Error(`Error from OpenAI: ${response.status} ${response.statusText}`);
    }
    if(!response.body) {
        throw new Error('No response body');
    }
    const parser = createParser((event) => {
        if(event.type === 'event') {
            onMessage(event.data)
        }
    })

    const decoder = new TextDecoder()

    for await (const chunk of iterableStreamAsync(response.body)) {
        const str = decoder.decode(chunk)
        parser.feed(str)
    }
}


const iterableStreamAsync = async function *(stream: ReadableStream) {
    const reader = stream.getReader()
    try {
        while(true) {
            const { value, done } = await reader.read()
            if(done) return
            yield value
        }
    } finally {
        reader.releaseLock()
    }
}
