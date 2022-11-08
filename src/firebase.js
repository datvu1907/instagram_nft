// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  TwitterAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  where,
  query,
  getDocs,
  getDoc,
  setDoc,
  collection,
  doc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXWHfbHlBPoq9oCYUGko6bdF5G_g5Mr38",
  authDomain: "dsc-book.firebaseapp.com",
  projectId: "dsc-book",
  storageBucket: "dsc-book.appspot.com",
  messagingSenderId: "752822236131",
  appId: "1:752822236131:web:d100d22e3d32d5730466d6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);
export const provider = new TwitterAuthProvider();

////////////////
export const signInWithTwitter = (login) => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const profilePic = result.user.photoURL;
      localStorage.setItem("token", result.user.accessToken);
      localStorage.setItem("profilePic", profilePic);
      findUser(result.user);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const logOut = (navigate) => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    })
    .catch((error) => {
      // An error happened.
    });
};

const findUser = async (data) => {
  // const userCollectionRef = collection(database, "user");
  const docRef = doc(database, "user", data.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return;
  } else {
    const user = {
      username: data.displayName,
      avatar: "",
    };
    await setDoc(doc(database, "user", data.uid), user);
  }
  // const ownerQuery = query(userCollectionRef, where("uid", "==", data.uid));
  // const querySnapshot = await getDocs(ownerQuery);
  // if (querySnapshot.docs.length > 0) {
  //   console.log(1);
  //   return;
  // } else {

  //   console.log(2);
  // }
};

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [pending, setPending] = useState(true);
//   const login = async (data) => {
//     setUser(data);
//     navigate("/login");
//   };
//   useEffect(() => {
//     auth.onAuthStateChanged((user) => {
//       console.log(user);
//       setCurrentUser(user);
//       setPending(false);
//     });
//   }, []);

//   if (pending) {
//     return <>Loading...</>;
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         currentUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
