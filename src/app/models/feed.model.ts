export class FeedModel {
    /* primary id */
    _id: string
    feedType: string

    /* generic fields */
    title: string
    description: string
    image: string
    url: string

    /* event fields */
    venue: string
    price: string
    time: string

    /* post field */
    content: any
    contentType: string

    /* Feed owner*/
    feedOwner: feedOwner

    /* Likes section */
    likesCount: number
    hasLiked: boolean

    /* Comment section */
    newComment: string
    commentsCount: number

    /* FE toggle */
    disableComment: boolean
    showDetail: boolean
    showShareOptions: boolean

    /* Likes and comments */
    likesList: string[]
    commentsList: string[]

    /* Bookmark */
    bookmarked : boolean
}

export class feedOwner {
    userId: string
    name: string
    image: string
}
