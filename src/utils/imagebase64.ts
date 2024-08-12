// import * as fs from 'fs'
// import * as path from 'path'

const getImageType = (base64: string) => {
    const fileHeader = new Map();

    fileHeader.set("/9j", "jpeg");
    fileHeader.set("iVB", "png");
    fileHeader.set("Qk0", "bmp");
    fileHeader.set("SUk", "tiff");
    fileHeader.set("JVB", "pdf");
    fileHeader.set("UEs", "ofd");
    fileHeader.set("R0l", "gif");
    fileHeader.set("PHN", "svg+xml");
    fileHeader.set("Ukl", "webp");

    let res = ""

	//遍历map中所提及的文件头特征
    fileHeader.forEach((v, k) => {
        if (k == base64.substring(0, 3)) {
            res = `data:image/${v};base64`
        }
    })

    return res
}

export const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // 读取结果会包含 data URL 以 "data:application/octet-stream;base64," 开头
            const base64String = (reader.result as string).split(',')
            const image_type = getImageType(base64String[1]) || ''
            base64String[0] = image_type
            resolve(base64String.join(','));
        };
        reader.onerror = reject;
        reader.readAsDataURL(new Blob([arrayBuffer]));
    });
};

export const getBase64ImageFromFile = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onloadend = function(event) {
            const base64String = event?.target?.result
            resolve(base64String);
        };

        reader.onerror = function(error) {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}