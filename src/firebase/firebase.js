import firebase from 'firebase/app'
import 'firebase/storage'

const firebaseConfig = {
	apiKey: "AIzaSyCMulvIMMrVg7XyY5na3VVKaD_dCb4-Iqo",
	authDomain: "uit-lib.firebaseapp.com",
	databaseURL: "https://uit-lib.firebaseio.com",
	projectId: "uit-lib",
	storageBucket: "uit-lib.appspot.com",
	messagingSenderId: "350707517083",
	appId: "1:350707517083:web:52a85d0863139271ab283e",
	measurementId: "G-V19Z6NJREC"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()

export {
	storage, firebase as default
}
