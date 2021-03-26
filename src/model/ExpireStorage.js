export class ExpiresStorage {
    constructor(key) {
        this.key = key
    }
    set(value, expires) {
        let params = {
            key: this.key,
            value: value,
            expires: expires,
            startTime: new Date().getTime()
        }
        localStorage.setItem(this.key, JSON.stringify(params))
    }
    get() {
        let val = localStorage.getItem(this.key)
        if (val) {
            let item = JSON.parse(val)
            if (item.startTime && item.expires) {
                let time = new Date().getTime() - item.startTime
                if (time <= item.expires) {
                    return item.value
                } else {
                    localStorage.removeItem(this.key)
                }
            }
            return null
        }
        return null
    }
}

