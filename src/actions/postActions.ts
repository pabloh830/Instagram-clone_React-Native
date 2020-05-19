import { firestore } from 'firebase';
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { ExtraComment } from '../reducers/commentReducer';
import { LIMIT_POSTS_PER_LOADING, postActionTypes, ExtraPost, Post, PostAction, PostErrorAction, PostList, PostSuccessAction } from '../reducers/postReducer';
import { UserInfo } from '../reducers/userReducer';
import { store } from "../store";
import { LoadMoreCommentListSuccess } from './commentActions';

export const FetchPostListRequest = ():
    ThunkAction<Promise<void>, {}, {}, PostAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, PostAction>) => {
        try {
            const me = store.getState().user.user
            const request = await firestore()
                .collection('users')
                .doc(me.userInfo?.username)
                .get()

            const result: UserInfo = request.data() || {}
            if (result) {
                const follwingList: string[] = result.followings || []
                const userIds: string[] = []
                let collection: Post[] = []
                while (follwingList.length > 0
                    && collection.length < LIMIT_POSTS_PER_LOADING) {
                    const rs = await firestore().collection('posts')
                        .where('userId', 'in', follwingList.splice(0, 10))
                        .orderBy('create_at', 'desc')
                        .limit(LIMIT_POSTS_PER_LOADING - collection.length)
                        .get()
                    const temp = rs.docs.map(doc => {
                        if (userIds.indexOf(doc.data().userId) < 0) userIds.push(doc.data().userId)
                        let post = { ...doc.data() }
                        const rqCmt = doc.ref.collection('comments')
                            .orderBy('create_at', 'desc').get()
                        rqCmt.then(rsx => {
                            post.comments = rsx.docs.map(docx => docx.data())
                        })
                        return post
                    })
                    collection = collection.concat(temp)
                }
                let ownInfos: UserInfo[] = []
                while (userIds.length > 0) {
                    const rs = await firestore().collection('users')
                        .where('username', 'in', userIds.splice(0, 10))
                        .get()
                    const temp = rs.docs.map(doc => {
                        return doc.data()
                    })
                    ownInfos = ownInfos.concat(temp)
                }
                const extraPostList: PostList = collection.map((post, index) => {
                    const extraPost: ExtraPost = Object.assign(post, {
                        ownUser: ownInfos.filter(x => x.username === post.userId)[0]
                    })
                    return extraPost
                })
                dispatch(FetchPostListSuccess(extraPostList))
            } else dispatch(FetchPostListFailure())
        } catch (e) {
            console.warn(e)
            dispatch(FetchPostListFailure())
        }
    }
}
export const FetchPostListFailure = (): PostErrorAction => {
    return {
        type: postActionTypes.FETCH_POST_LIST_FAILURE,
        payload: {
            message: 'Get Post List Failed!'
        }
    }
}
export const FetchPostListSuccess = (payload: PostList): PostSuccessAction<PostList> => {
    return {
        type: postActionTypes.FETCH_POST_LIST_SUCCESS,
        payload: payload
    }
}
/**
 * LOADING MORE ACTIONS 
 */
export const LoadMorePostListRequest = ():
    ThunkAction<Promise<void>, {}, {}, PostAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, PostAction>) => {
        try {
            const me = store.getState().user.user
            const request = await firestore()
                .collection('users')
                .doc(me.userInfo?.username)
                .get()
            const result = request.data()
            const loadedUids = store.getState().postList
                .map(post => post.uid).filter(id => id !== undefined)

            if (result) {
                const follwingList: string[] = result.followings
                const userIds: string[] = []
                let collection: Post[] = []
                while (follwingList.length > 0
                    && collection.length < LIMIT_POSTS_PER_LOADING) {
                    const rs = await firestore().collection('posts')
                        .where('userId', 'in', follwingList.splice(0, 10))
                        .orderBy('create_at', 'desc')
                        .limit(LIMIT_POSTS_PER_LOADING + loadedUids.length)
                        .get()
                    rs.docs.map(doc => {
                        if (loadedUids.indexOf(doc.data().uid) < 0
                            && collection.length < LIMIT_POSTS_PER_LOADING) {
                            if (userIds.indexOf(doc.data().userId) < 0)
                                userIds.push(doc.data().userId)
                            let post = { ...doc.data() }
                            doc.ref.collection('comments')
                                .orderBy('create_at', 'desc').get().then(rqCmt => {
                                    post.comments = rqCmt.docs.map(docx => docx.data())
                                    if (collection.length < LIMIT_POSTS_PER_LOADING)
                                        collection.push(post)
                                })
                        }
                    })
                }

                let ownInfos: UserInfo[] = []
                while (userIds.length > 0) {
                    const rs = await firestore().collection('users')
                        .where('username', 'in', userIds.splice(0, 10))
                        .get()
                    const temp = rs.docs.map(doc => {
                        return doc.data()
                    })
                    ownInfos = ownInfos.concat(temp)
                }
                const extraPostList: PostList = collection.map((post, index) => {
                    const extraPost: ExtraPost = Object.assign(post, {
                        ownUser: ownInfos[index]
                    })
                    return extraPost
                })
                dispatch(LoadMorePostListSuccess(extraPostList))
            } else dispatch(LoadMorePostListFailure())
        } catch (e) {
            dispatch(LoadMorePostListFailure())
        }
    }
}
export const LoadMorePostListFailure = (): PostErrorAction => {
    return {
        type: postActionTypes.LOAD_MORE_POST_LIST_FAILURE,
        payload: {
            message: 'Can not load more posts!'
        }
    }
}
export const LoadMorePostListSuccess = (payload: PostList): PostSuccessAction<PostList> => {
    return {
        type: postActionTypes.LOAD_MORE_POST_LIST_SUCCESS,
        payload: payload
    }
}
/**
 * POST COMMENTS ACTIONS
 */
export const PostCommentRequest = (postId: number, content: string):
    ThunkAction<Promise<void>, {}, {}, PostAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, PostAction>) => {
        try {
            const me = store.getState().user.user
            let postList = [...store.getState().postList]
            const ref = firestore()
            const rq = await ref.collection('posts').where('uid', '==', postId).get()
            if (rq.docs.length > 0) {
                const targetPost = rq.docs[0]
                const uid = new Date().getTime()
                await targetPost.ref.collection('comments').doc(`${uid}`).set({
                    uid: uid,
                    content,
                    likes: [],
                    userId: me.userInfo?.username,
                    create_at: new Date()
                })
                const rq2 = await targetPost.ref.collection('comments')
                    .orderBy('create_at', 'desc').get()
                postList = postList.map((post) => {
                    if (post.uid === postId) {
                        post = { ...post }
                        post.comments = rq2.docs.map(x => x.data())
                    }
                    return post
                })
                const comment: ExtraComment = rq2.docs[0].data()
                comment.ownUser = me.userInfo
                const payload = {
                    comments: [comment],
                    scrollDown: true
                }
                dispatch(LoadMoreCommentListSuccess(payload))
                dispatch(PostCommentSuccess(postList))
            } else {
                dispatch(PostCommentFailure())
            }
        } catch (e) {
            dispatch(PostCommentFailure())
        }
    }
}
export const PostCommentFailure = (): PostErrorAction => {
    return {
        type: postActionTypes.COMMENT_POST_FAILURE,
        payload: {
            message: 'Can not load more posts!'
        }
    }
}
export const PostCommentSuccess = (payload: PostList): PostSuccessAction<PostList> => {
    return {
        type: postActionTypes.COMMENT_POST_SUCCESS,
        payload: payload
    }
}

/**
 * TOGGLE LIKE POST ACTIONS
 */
export const ToggleLikePostRequest = (postId: number):
    ThunkAction<Promise<void>, {}, {}, PostAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, PostAction>) => {
        try {
            const me = store.getState().user.user
            let postList = [...store.getState().postList]
            const ref = firestore()
            const rq = await ref.collection('posts').where('uid', '==', postId).get()
            if (rq.docs.length > 0) {
                postList = postList.map((post) => {
                    if (post.uid === postId) {
                        const targetPost: Post = rq.docs[0].data()
                        const index = targetPost.likes?.indexOf(
                            me.userInfo?.username || '')
                        if (index !== undefined && index > -1) {
                            targetPost.likes?.splice(index, 1)
                        } else targetPost.likes?.push(me.userInfo?.username || '')
                        rq.docs[0].ref.update({
                            likes: targetPost.likes
                        })
                        post = { ...post, likes: targetPost.likes }
                    }
                    return post
                })
                dispatch(ToggleLikePostSuccess(postList))
            } else {
                dispatch(ToggleLikePostFailure())
            }
        } catch (e) {
            dispatch(ToggleLikePostFailure())
        }
    }
}
export const ToggleLikePostFailure = (): PostErrorAction => {
    return {
        type: postActionTypes.TOGGLE_LIKE_POST_FAILURE,
        payload: {
            message: 'Can not load more posts!'
        }
    }
}
export const ToggleLikePostSuccess = (payload: PostList): PostSuccessAction<PostList> => {
    return {
        type: postActionTypes.TOGGLE_LIKE_POST_SUCCESS,
        payload: payload
    }
}
