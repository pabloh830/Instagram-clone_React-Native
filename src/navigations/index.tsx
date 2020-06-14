import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { ExtraPost } from '../reducers/postReducer';
import { UserInfo } from '../reducers/userReducer';
import EditProfile from '../screens/Home/Account/EditProfile';
import GalleryChooser, { ProcessedImage } from '../screens/Home/Account/GalleryChooser';
import LocationChooser from '../screens/Home/Account/LocationChooser';
import MuteOptions from '../screens/Home/Account/MuteOptions';
import NotificationOptions from '../screens/Home/Account/NotificationOptions';
import TagPeople from '../screens/Home/Account/TagPeople';
import PostOptions from '../screens/Others/PostOptions';
import Comment from '../screens/Root/Comment';
import { MapBoxAddress } from '../utils';
import { navigationRef } from './rootNavigation';
import RootTab from './RootTab';
import DiscoverPeople from '../screens/Home/Account/DiscoverPeople';
import PostDetail from '../screens/Home/PostDetail';
export type SuperRootStackParamList = {
    RootTab: undefined,
    Comment: {
        postId: number
    },
    PostOptions: {
        item: ExtraPost
    },
    EditProfile: undefined,
    GalleryChooser: { isChooseProfilePhoto?: boolean },
    TagPeople: {
        images: ProcessedImage[],
        onDone?: (images: ProcessedImage[]) => void
    },
    LocationChooser: {
        address: MapBoxAddress,
        onDone?: (address: MapBoxAddress) => void
    },
    NotificationOptions: {
        user: UserInfo
    },
    MuteOptions: {
        user: UserInfo
    },
    DiscoverPeople: undefined,
    PostDetail: {
        postId: number
    }
};
const RootStack = createStackNavigator<SuperRootStackParamList>()
const index = (): JSX.Element => {
    const navigationOptions: StackNavigationOptions = {
        headerShown: false,
        gestureEnabled: false
    }
    return (
        <NavigationContainer ref={navigationRef}>
            <RootStack.Navigator
                initialRouteName='RootTab'
                screenOptions={navigationOptions}>
                <RootStack.Screen name="RootTab" component={RootTab} />
                <RootStack.Screen name="Comment" component={Comment} />
                <RootStack.Screen options={{
                    ...TransitionPresets.ModalTransition,
                    cardStyle: { backgroundColor: 'transparent' }
                }} name="PostOptions" component={PostOptions} />
                <RootStack.Screen options={{
                    animationEnabled: false,
                    cardStyle: { backgroundColor: 'transparent' }
                }} name="EditProfile" component={EditProfile} />
                <RootStack.Screen options={{
                    ...TransitionPresets.ModalTransition,
                }} name="GalleryChooser" component={GalleryChooser} />
                <RootStack.Screen options={{
                    ...TransitionPresets.ModalTransition,
                }} name="TagPeople" component={TagPeople} />
                <RootStack.Screen options={{
                    ...TransitionPresets.ModalTransition,
                }} name="LocationChooser" component={LocationChooser} />
                <RootStack.Screen options={{
                    ...TransitionPresets.ModalTransition,
                    cardStyle: { backgroundColor: 'transparent' }
                }} name="NotificationOptions" component={NotificationOptions} />
                <RootStack.Screen options={{
                    ...TransitionPresets.ModalTransition,
                    cardStyle: { backgroundColor: 'transparent' }
                }} name="MuteOptions" component={MuteOptions} />
                <RootStack.Screen component={DiscoverPeople} name="DiscoverPeople" />
                <RootStack.Screen component={PostDetail} name="PostDetail" />

            </RootStack.Navigator>
        </NavigationContainer>
    )
}
export default index

