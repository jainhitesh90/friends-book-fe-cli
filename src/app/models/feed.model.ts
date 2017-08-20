export class FeedModel {
    /* primary id */
    _id: string
    feedType: string

    /* generic fields */
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

    /* Likes and comments 2 */
    likes: number[]
    comments: commentOwner[]

    /* Bookmark */
    bookmarked : boolean

	addingComment : boolean
}

export class feedOwner {
    userId: string
    name: string
    image: string
}

export class commentOwner {
    userId: number
    comment: string
}
