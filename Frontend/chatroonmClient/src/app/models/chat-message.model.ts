export interface ChatMessage {

    msg:string;
    senderId:string;//email
    receiverId:string;//email
    /*
    Type :
        GROUP,
        PRIVATE,
        ADMIN
    */
    type:string;
}
