import { Color } from "@prisma/client";

interface IUser {
    _id: string,
    username: string,
    email: string,
    color: Color,
    inRoom: boolean,
    isOnline: boolean
}

export default IUser;