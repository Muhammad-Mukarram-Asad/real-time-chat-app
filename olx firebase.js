import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query, 
  where,
  getDoc,
  onSnapshot,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIb5zkK2Kpi0CaWkJkAhPf5P7nmntQOts",
  authDomain: "olx-authentication.firebaseapp.com",
  projectId: "olx-authentication",
  storageBucket: "olx-authentication.appspot.com",
  messagingSenderId: "803883668867",
  appId: "1:803883668867:web:687226ffbefb1ea6e9d2b6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

function signInFirebase(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
  
}

async function signUpFirebase(userInfo) {
  const { email, password } = userInfo;
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await addUserToDb(userInfo, userCredential.user.uid);
}

function addUserToDb(userInfo, uid) {
  const { email, name, age } = userInfo;
  return setDoc(doc(db, "users",uid), { email, name, age });
}

function postAdToDb(title, price, description, imageURL,location,contact_number) {
  const userId = auth.currentUser.uid;
  const userEmail = auth.currentUser.email;
  return addDoc(collection(db, "ads"), {
    title,
    price,
    description,
    imageURL,
    location,
    contact_number,
    userId,
    userEmail
  });
}


async function getAdsFromDb() {
  const querySnapshot = await getDocs(collection(db, "ads"));
  const ads = [];
  querySnapshot.forEach((doc) => {
    ads.push({ id: doc.id, ...doc.data() });
    // console.log(ads);
  });
  return ads; // it is returning the array of ads.
}

async function uploadImage(image) {
  const storageREf = ref(storage, `images/${image.name}`);
  const snapshot = await uploadBytes(storageREf, image);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}

// Realtime data get krna ka method firebase ka:
function getRealtimeAds(callback) {
  //2
  onSnapshot(collection(db, "ads"), (querySnapshot) => {
      const ads = []

      querySnapshot.forEach((doc) => {
          ads.push({ id: doc.id, ...doc.data() })
      });
      //3
      callback(ads)
  })
}

function getFirebaseAd(id) {
  const docRef = doc(db, "ads", id)
  return getDoc(docRef)
}

// Creating a method or function for obtaining Ad details when user clicked on it.
// async function clickedAdFromDB(title)
// {
  
// const q = query(collection(db, "ads"), where("title", "==", title));

// const querySnapshot = await getDocs(q);
// let ad_array = [];
// querySnapshot.forEach((doc) => {
//   console.log(doc.id, " => ", doc.data());
//   ad_array.push({ id: doc.id, ...doc.data() })
// })
// return ad_array;
// };

async function checkChatroom(adUserId) {
  const currentUserId = auth.currentUser.uid
  const q = query(collection(db, "chatrooms"),
      where(`users.${currentUserId}`, "==", true),
      where(`users.${adUserId}`, "==", true))

  const querySnapshot = await getDocs(q);
  console.log(`The current_User_Id is =${currentUserId} & \n Ad_Seller_Id is =${adUserId}`);

  let room;
  querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      room = { id: doc.id, ...doc.data() }
  })
  return room
}

function createChatroom(adUserId, adSellerEmail) {
  const currentUserId = auth.currentUser.uid
  console.log(`The current_User_Id is --> ${currentUserId} & \n  Ad_Seller_Id is --> ${adUserId}`);

  const obj =  {
      users: { 
          [currentUserId]: true, // dynamic object keys [key_name];
          [adUserId]: true 
      },
      user_Names:{
        Current_User_Email: auth.currentUser.email,
        Ad_Owner_Email: adSellerEmail
      },
      createdAt: Date.now(),
      lastMessage:{}
  } 
  return addDoc(collection(db, "chatrooms"), obj)
}


// Now addig messages to the chatrooms:
function sendMessageToDb(text,chat_id)
{
  const message = {text,createdAt:Date.now(),userId:auth.currentUser.uid };
  // const messageRef = db.collection("chatrooms").doc(chat_id).collection("messages").add(message);
  // return messageRef;

  return addDoc(collection(db,"chatrooms", chat_id, "messages"), message);
}

// async function getMessagesFromDb(chat_id)
// {
//   const querySnapshot = await getDocs(collection(db, "chatrooms",chat_id, "messages"));
//   const messages = [];
//   querySnapshot.forEach((doc) => {
//     messages.push({ id: doc.id, ...doc.data() });
//   });

//   return messages;
// }

function getRealtimeMessages(roomId, callback) {
  
console.log(`chat firebase.`);
  const q = query(collection(db, "chatrooms", roomId, "messages"), orderBy("createdAt"))
  onSnapshot(q, (querySnapshot) => {
      const messages = []
      querySnapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() })
      })
      console.log(messages);
      callback(messages)
  })

}

// function getRealtimeMessages(callback, chat_id) {
//   //2
//   onSnapshot(collection(db, "chatrooms",chat_id,"messages"), (querySnapshot) => {
//       const messages = []

//       querySnapshot.forEach((doc) => {
//           messages.push({ id: doc.id, ...doc.data() })
//       });
//       //3
//       callback(messages,chat_id)
//   })
// }

export {auth, signUpFirebase, signInFirebase, uploadImage, getAdsFromDb, postAdToDb,getRealtimeAds,
  getFirebaseAd, createChatroom,checkChatroom,sendMessageToDb,getRealtimeMessages};










