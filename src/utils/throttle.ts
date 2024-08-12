export function throttle (fn: () => void, wait=200) {
    let timeout: NodeJS.Timeout | null = null
    let lastTime = 0
    return function(this: any, ...args: []) {
        const now = Date.now()
        const remaining = wait - (now - lastTime)
        if(remaining <= 0) {
            if(timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            fn.apply(this, args)
            lastTime = Date.now()
        } else if(!timeout) {
            timeout = setTimeout(() => {
                fn.apply(this, args)
                lastTime = Date.now()
                timeout = null
            }, remaining)
        }
    }
}