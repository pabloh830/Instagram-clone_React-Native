import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { SCREEN_WIDTH } from '../../constants'
const index = () => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.navigationBar}>
            <TouchableOpacity
                onPress={() => { }}
                style={styles.btnBack}>
                <Icon name="camera" size={24} />
            </TouchableOpacity>
            <View style={styles.centerBar}>
                <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
            </View>
            <TouchableOpacity style={styles.btnMessenger}>
                <Icon name="send" size={24} />
            </TouchableOpacity>
        </TouchableOpacity >
    )
}

export default index

const styles = StyleSheet.create({
    navigationBar: {
        flexDirection: 'row',
        height: 44,
        width: '100%',
        alignItems: 'center',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    centerBar: {
        height: 44,
        width: SCREEN_WIDTH - 44 * 2,
        paddingHorizontal: 15
    },
    logo: {
        resizeMode: 'contain',
        height: 44,
        width: '100%'
    },
    btnBack: {
        height: 44,
        width: 44,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnMessenger: {
        height: 44,
        width: 44,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
