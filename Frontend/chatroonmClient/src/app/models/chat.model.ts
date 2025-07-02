import { ChatMessage } from "./chat-message.model"

export  class Chat {
    chatName:string
  
    chatMessages:ChatMessage[]

    constructor(chatName:string,chatMessages:ChatMessage[]){

        this.chatName=chatName
        this.chatMessages= chatMessages
    }
}
