

export class Response<T> {
    statusCode: string
    message: string
    data: T | any
    constructor(statusCode: string, message: string, data: T | any) {
        this.statusCode = statusCode
        this.message = message
        this.data = data
        return this
    }

}