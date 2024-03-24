export const getAssetURL = (image: string) => {
    // 参数一: 相对路径
    // 参数二: 当前路径的URL
    return new URL(`../assets/image/${image}`, import.meta.url).href
}


