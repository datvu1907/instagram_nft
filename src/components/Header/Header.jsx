import React, { useState, useEffect ,forwardRef , useImperativeHandle} from "react";

import { database, auth } from "../../firebase";
import { Link } from "react-router-dom";
import "./Header.css";
import AddModal from "../AddModal/AddModal";
import { useAuth } from "../../hooks/Auth";
import { doc, getDoc } from "firebase/firestore";

const Header = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({

    reloadAvatar() {
     fetchData()
    }

  }));
  const [avatar, setAvatar] = useState("");

  const { signOut } = useAuth();


  const fetchData = async () => {
    const docRef = doc(database, "user", auth.currentUser.uid);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setAvatar(docSnap.data().avatar);
      }
    });

    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }
  };
  useEffect(() => {
   
    fetchData();
  }, []);

  return (
    <div className="app">
      <div className="app__header">
        <img
          class="logo-size"
          src="./Image/Logo_Background.png"
          height="40"
          padding-left="200px"
          alt=""
        ></img>
        <div className="app__headerWrapper">
          <AddModal></AddModal>
          <div className="app__headerButtons">
            <div class="dropdown text-end">
              <div
                href="#"
                class="d-block link-dark text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={avatar == "" ? "./Image/icon-profile.png" : avatar}
                  alt="mdo"
                  width="32"
                  height="32"
                  class="rounded-circle"
                />
              </div>
              <ul class="dropdown-menu text-small">
                <li>
                  <div class="dropdown-item">Challenges</div>
                </li>
                <li>
                  <div class="dropdown-item">
                    <Link to="/Setting">Settings</Link>
                  </div>
                </li>

                <li>
                  <hr class="dropdown-divider"></hr>
                </li>
                <li>
                  <div class="dropdown-item" onClick={signOut}>
                    Sign out
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Header;
