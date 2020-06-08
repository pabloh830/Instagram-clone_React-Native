import { firestore } from "firebase"
import { UserInfo } from "../reducers/userReducer"
import { store } from "../store"
import { MAPBOX_ACCESS_TOKEN } from "../constants"

export const timestampToString = (create_at: number, suffix?: boolean): string => {
    let diffTime: string | number = (new Date().getTime() - (create_at || 0)) / 1000
    if (diffTime < 60) diffTime = 'Just now'
    else if (diffTime > 60 && diffTime < 3600) {
        diffTime = Math.floor(diffTime / 60)
            + (Math.floor(diffTime / 60) > 1 ? (suffix ? ' minutes' : 'm') : (suffix ? ' minute' : 'm')) + (suffix ? ' ago' : '')
    } else if (diffTime > 3600 && diffTime / 3600 < 24) {
        diffTime = Math.floor(diffTime / 3600)
            + (Math.floor(diffTime / 3600) > 1 ? (suffix ? ' hours' : 'h') : (suffix ? ' hour' : 'h')) + (suffix ? ' ago' : '')
    }
    else if (diffTime > 86400 && diffTime / 86400 < 30) {
        diffTime = Math.floor(diffTime / 86400)
            + (Math.floor(diffTime / 86400) > 1 ? (suffix ? ' days' : 'd') : (suffix ? ' day' : 'd')) + (suffix ? ' ago' : '')
    } else {
        diffTime = new Date(create_at || 0).toDateString()
    }
    return diffTime
}
export const convertDateToTimeStampFireBase = (date: Date): firestore.Timestamp => {
    return new firestore.Timestamp(Math.floor(date.getTime() / 1000), date.getTime() - Math.floor(date.getTime() / 1000) * 1000)
}
export const generateUsernameKeywords = (fullText: string): string[] => {
    const keywords: string[] = []
    const splitedText = fullText.split('')
    splitedText.map((s, index) => {
        const temp = splitedText.slice(0, index + 1).join('')
        keywords.push(temp)
    })
    return Array.from(new Set(keywords))
}
export const findUsersByName = async (q: string) => {
    let users: UserInfo[] = []
    const ref = firestore()
    const rq = await ref.collection('users').where(
        'keyword', 'array-contains', q
    ).get()
    rq.docs.map(x => {
        const user: UserInfo = x.data()
        users.push(user)
    })
    users = users.filter(u => u.username !== store.getState().user.user.userInfo?.username)
    return users
}
export const uriToBlob = (uri: string) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            // return the blob
            resolve(xhr.response);
        };

        xhr.onerror = function () {
            // something went wrong
            reject(new Error('uriToBlob failed'));
        };
        // this helps us get a blob
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);

        xhr.send(null);
    });
}
export type MapBoxAddress = {
    id: string,
    place_name: string,
}
export const searchLocation = (query: string): Promise<MapBoxAddress[]> => {
    return new Promise((resolve, reject) => {
        fetch(`http://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`)
            .then(res => res.json())
            .then(data => {
                const address: MapBoxAddress[] = []
                const result: {
                    features: MapBoxAddress[]
                } = data
                result.features.map(feature => {
                    address.push({
                        id: feature.id,
                        place_name: feature.place_name
                    })
                })
                resolve(address)
            })
            .catch(err => reject(err))
    })

}