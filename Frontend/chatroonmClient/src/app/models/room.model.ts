import { GroupMember } from "./group-member.model"

export interface Room {
    roomName:string
    bio:string
    createdBy:GroupMember
    members:GroupMember[]
}
