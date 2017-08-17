export class SocialUserModel {
    _id : string
    email : string
    name : string
    image : string
    provider : string
    authToken : string
    uid : string
    socialLoginToken : string
    newUser : boolean

    /* Friends */
    friendStatus : boolean
}

export class pendingFriendRequest {
    _id: string
    name : string
    image : string
}