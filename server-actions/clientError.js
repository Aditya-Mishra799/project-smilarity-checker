export class ClientError extends Error{
    constructor(messsage){
        super(messsage)
        this.name = "ClientError"
    }
}