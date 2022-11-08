import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "./Setting.css";
import Avatar from "react-avatar-edit";
import { auth, database } from "../../firebase";

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { walletCollectionRef } from "../../api/firestore-collection";
import {
  doc,
  updateDoc,
  getDoc,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { ToastContainer } from "react-toastify";

import { alertSuccess, alertError } from "../../components/Toast/Toast";
import ListWallet from "../../components/ListWallet/ListWallet";
import Header from "../../components/Header/Header";
const Web3 = require("web3");
const web3 = new Web3(process.env.RPC_URL);
const caver = new Web3(
  new Web3.providers.HttpProvider(
    "https://public-node-api.klaytnapi.com/v1/cypress"
  )
);

const Setting = () => {
  const childRef = useRef();
  const headerRef = useRef();
  const [dialogs, setdialogs] = useState(false);
  const [imgCrop, setimgCrop] = useState(false);
  const [storeImage, setstoreImage] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [userName, setUserName] = useState("");
  const storage = getStorage();
  const storageRef = ref(storage, `avatar/${auth.currentUser.uid}`);

  async function handleSubmit() {
    const chainId = 8217; // Klaytn Testnet
    if (window.ethereum.networkVersion !== chainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: web3.utils.toHex(chainId) }],
        });
      } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Klay mainnet",
                chainId: web3.utils.toHex(chainId),
                nativeCurrency: {
                  name: "KLAY",
                  decimals: 18,
                  symbol: "KLAY",
                },
                rpcUrls: ["https://public-en.kaikas.io/v1/cypress"],
              },
            ],
          });
        }
      }
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // setAccounts(account);
      const account = window.ethereum.selectedAddress;
      console.log(account);
      await addWallet(account);
    }
  }
  const addWallet = async (wallet) => {
    const queryOwner = query(
      walletCollectionRef,
      where("owner", "==", auth.currentUser.uid)
    );
    const queryWallet = query(queryOwner, where("address", "==", wallet));
    const queryOwnerSnapshot = await getDocs(queryOwner);
    const queryWalletSnapshot = await getDocs(queryWallet);
    if (queryOwnerSnapshot.docs.length === 0) {
      await addDoc(walletCollectionRef, {
        address: wallet,
        id: 1,
        owner: auth.currentUser.uid,
      });
      childRef.current.reloadWallet();
      alertSuccess("Succefully add new address");
    } else if (
      queryOwnerSnapshot.docs.length > 0 &&
      queryWalletSnapshot.docs.length === 0
    ) {
      await addDoc(walletCollectionRef, {
        address: wallet,
        id: queryOwnerSnapshot.docs.length + 1,
        owner: auth.currentUser.uid,
      });
      childRef.current.reloadWallet();
      alertSuccess("Succefully add new address");
    } else {
      alertError("Address is existed");
      return;
    }
  };
  const onCrop = (view) => {
    setimgCrop(view);
  };

  const onClose = () => {
    setimgCrop(null);
  };
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  const saveImage = () => {
    setstoreImage([...storeImage, { imgCrop }]);
    setdialogs(false);
    var file = dataURLtoFile(imgCrop, `${auth.currentUser.uid}`);
    console.log(file);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        alertError("Fail to update avatar");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
          updateUserAvatar(downloadURL);
          alertSuccess("Succefully update new avatar");
        });
      }
    );
  };

  const updateUserAvatar = async (url) => {
    const collectionRef = doc(database, "user", auth.currentUser.uid);

    // Set the "capital" field of the city 'DC'
    await updateDoc(collectionRef, {
      avatar: url,
    });
    headerRef.current.reloadAvatar();
  };
  const getAvatar = async () => {
    const docRef = doc(database, "user", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setImageURL(docSnap.data().avatar);
      setUserName(docSnap.data().username);
      headerRef.current.reloadAvatar();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  const getListWallet = async () => {
    const queryOwner = query(
      walletCollectionRef,
      where("owner", "==", auth.currentUser.uid)
    );
    const queryOwnerSnapshot = await getDocs(queryOwner);
    console.log("assas", queryOwnerSnapshot.docs[0].data());
    var array = [];
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
    // setListWallet(queryOwnerSnapshot.docs.data);
    //   console.log("asaa",listWallet.length);
  };
  useEffect(() => {
    getAvatar();
    getListWallet();
  }, []);

  return (
    <div>
      <Header ref={headerRef} />
      <ToastContainer />
      <div className="profile_img text-center p-4">
        <div className="div">
          <img
            style={{
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src={imageURL === "" ? "./Image/icon-profile.png" : imageURL}
            alt=""
            onClick={() => setdialogs(true)}
          />

          <Dialog
            visible={dialogs}
            header={() => (
              <p htmlFor="" className="text-2xl font-semibold textColor">
                Update profile
              </p>
            )}
            onHide={() => setdialogs(false)}
          >
            <div className="confirmation-content flex flex-column align-items-center">
              <div className="flex flex-column align-items-center mt-5 w-12">
                <div className="flex flex-column justify-content-around w-12 mt-4">
                  <Avatar
                    width={400}
                    height={300}
                    onClose={onClose}
                    onCrop={onCrop}
                  ></Avatar>
                  <br />
                  <Button onClick={saveImage} label="Save" icon="pi pi-check" />
                </div>
              </div>
            </div>
          </Dialog>
        </div>
        <br />
        <div class="profile-info">
          <h2>{userName}</h2>
        </div>
        <div className = "hrs">
        <hr></hr>
        </div>
        <ListWallet ref={childRef} />
        <br></br>
        <button
          className="primary__button btn btn-primary"
          onClick={handleSubmit}
        >
          Add Wallet
        </button>
      </div>
    </div>
  );
};

export default Setting;
