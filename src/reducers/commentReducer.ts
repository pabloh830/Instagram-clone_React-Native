import { commentActionTypes } from '../constants'
import { Alert } from 'react-native'
import { firestore } from 'firebase'
import { UserInfo } from './userReducer'
import { ExtraPost } from './postReducer'
export type Comment = {
    content?: string,
    uid?: number,
    userId?: string,
    likes?: string[],
    create_at?: firestore.Timestamp,
    replies?: ExtraComment[]
}
export type ExtraComment = Comment & {
    ownUser?: UserInfo
}
export type CommentList = ExtraComment[]
export interface CommentErrorAction {
    type: string,
    payload: {
        message: string
    }
}
export type CommentExtraList = {
    comments: CommentList,
    post: ExtraPost,
    scrollDown?: boolean
}
export interface CommentSuccessAction<T> {
    type: string,
    payload: T
}
export type CommentListWithScroll = {
    comments: CommentList,
    scrollDown: boolean
}
export type CommentAction = CommentSuccessAction<CommentExtraList>
    | CommentErrorAction | CommentSuccessAction<CommentListWithScroll>
const defaultState: CommentExtraList = {
    comments: [],
    post: {},
    scrollDown: false
}
const reducer = (state: CommentExtraList = defaultState, action: CommentAction): CommentExtraList => {
    switch (action.type) {
        case commentActionTypes.FETCH_COMMENTS_REQUEST:
            state = { ...defaultState }
            return state
        case commentActionTypes.FETCH_COMMENTS_SUCCESS:
            action = <CommentSuccessAction<CommentExtraList>>action
            state = { ...action.payload }
            return state
        case commentActionTypes.FETCH_COMMENTS_FAILURE:
            action = <CommentErrorAction>action
            const message = action.payload.message
            Alert.alert('Error', message)
            return state
        case commentActionTypes.LOAD_MORE_COMMENTS_REQUEST:
            state = { ...defaultState }
            return state
        case commentActionTypes.LOAD_MORE_COMMENTS_SUCCESS:
            action = <CommentSuccessAction<CommentListWithScroll>>action
            state = {
                ...state, comments: [...state.comments,
                ...action.payload.comments],
                scrollDown: action.payload.scrollDown || false
            }
            return state
        case commentActionTypes.LOAD_MORE_COMMENTS_FAILURE:
            action = <CommentErrorAction>action
            const message2 = action.payload.message
            Alert.alert('Error', message2)
            return state
        default:
            return state
    }
}
export default reducer