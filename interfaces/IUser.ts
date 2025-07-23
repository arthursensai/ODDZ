import color from "../types/color";

interface IUser {
    _id: string,
    username: string,
    email: string,
    color: color,
    inRoom: boolean,
    isOnline: boolean
}

export default IUser;