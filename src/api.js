const API_URL = 'https://world.openfoodfacts.org/api/v1/product'
import { db } from './FirebaseConfig';
import { collection, addDoc, Timestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const myCollection = collection(db, 'products')
const timestamp = Timestamp.now();
const data = {
    product_name: '',
    barcode: '',
    expiry_date: timestamp
}

export async function fetchProductName(barcode) {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v1/product/${barcode}.json`)
        if (!response.ok) {
            console.log(response)
        }
        const fetchedData = await(response.json())
        return fetchedData.product.product_name

    } catch(error) {
        console.log(error)
    }
}

export async function deleteOneProduct(id) {
    // console.log(id);
    try {
        const response = await deleteDoc(doc(db, "products", id))
        console.log(response)
        return response;
    } catch(err) {
        console.log(err)
    }
};

export async function addProduct(barcode, product_name, expiry_date) {
    try {
        data.product_name = product_name
        data.barcode = barcode
        data.expiry_date = expiry_date
        const docRef = await addDoc(myCollection, data);
    } catch(error) {
        console.log(error)
    }
}

export async function fetchProducts() {
    try {
        const querySnapshot = await getDocs(myCollection);
        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() });
        });

        return fetchedData;
        
    } catch (error) {
        console.log(error)
    }
}

export async function checkExpiredProducts() {
    try {
        const today = new Date();
        const querySnapshot = await getDocs(myCollection);
        const fetchedData = [];
        querySnapshot.forEach((doc) => {
            if (today >= doc.data().expiry_date.toDate()) {
                fetchedData.push({ id: doc.id, ...doc.data() });
            }
        
        });
        return fetchedData;
    } catch (error) {
        console.log(error);
    }
}

// Push Notification implementation
  
  
// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
export async function sendPushNotification(expoPushToken) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Shelf Secure',
        body: 'The product has been expired',
        data: { someData: 'goes here' },
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
    
}

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        }
        if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
        }
        token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
        });
        // console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token.data;
}

