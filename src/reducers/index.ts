import { combineReducers } from 'redux'
import {
    useSelector as useReduxSelector,
    TypedUseSelectorHook,
} from 'react-redux'
import userReducer, { userPayload } from './userReducer'
import storyReducer, { StoryList } from './storyReducer'
import postReducer, { PostList } from './postReducer'
import commentReducer, { CommentExtraList } from './commentReducer'
export type AppState = {
    user: userPayload,
    storyList: StoryList,
    postList: PostList,
    comment: CommentExtraList
}
const rootReducer = combineReducers<AppState>({
    user: userReducer,
    storyList: storyReducer,
    postList: postReducer,
    comment: commentReducer
})
export const useSelector:
    TypedUseSelectorHook<ReturnType<typeof rootReducer>> = useReduxSelector
export default rootReducer