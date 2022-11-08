import React, { useState, useEffect } from "react";
import { database, auth } from "../../firebase";
import "./Profile.css";
import { KeyNumbers } from "../key-numbers";
import * as Icons from "../icons";

import { doc, getDoc } from "firebase/firestore";
const Profile = () => {
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(database, "user", auth.currentUser.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setAvatar(docSnap.data().avatar);
          setUsername(docSnap.data().username);
        }
      });

      // if (docSnap.exists()) {
      //   console.log("Document data:", docSnap.data());
      // } else {
      //   // doc.data() will be undefined in this case
      //   console.log("No such document!");
      // }
    };
    fetchData();
  }, []);
  return (
    <div class="Header">
      <div class="HeaderWrap">
        <div class="ProfilePic">
          <div class="ProfileImg">
            <img
              src={avatar == "" ? "./Image/icon-profile.png" : avatar}
              class="gallery-item"
              alt="gallery"
            ></img>
          </div>
        </div>
        <div>
          <div class="ProfileRow">
            <div class="ProfileTitle">
              <div class="ProfileName">{username}</div>
              <div class="ProfileIcon">
                <Icons.Verified />
              </div>
              <div class="ProfileButton">
                <button type="button" class="btn btn-primary Button">
                  Follow
                </button>
              </div>
            </div>
          </div>
          <div class="DesktopOnly">
            <div class="ProfileRow">
              <KeyNumbers />
            </div>
            <div class="ProfileDescriptionsA">
              <div class="ProfileDescription">apple</div>
              <div class="ProfileDescriptionSpan">
                Everyone has a story to tell you
                <br />
                Tag <strong class="ProfileDescriptionA">#ShotonNFT</strong> to
                take part
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
