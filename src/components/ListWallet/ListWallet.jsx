import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import './ListWallet.css'
import { query, getDocs, where } from "firebase/firestore";
import { auth } from "../../firebase";
import { walletCollectionRef } from "../../api/firestore-collection";

const ListWallet = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    reloadWallet() {
      getListWallet();
    },
  }));

  const [walletArr, setWalletArr] = useState([]);

  const getListWallet = async () => {
    const queryOwner = query(
      walletCollectionRef,
      where("owner", "==", auth.currentUser.uid)
    );
    const queryOwnerSnapshot = await getDocs(queryOwner);

    var array = [];
    queryOwnerSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      array.push({
        address: doc.data().address,
        id: doc.data().id,
      });
    });
    array.sort((a, b) => a.id - b.id);
    setWalletArr(array);
    console.log("Aa", walletArr);

    // setListWallet(queryOwnerSnapshot.docs.data);
    //   console.log("asaa",listWallet.length);
  };

  useEffect(() => {
    getListWallet();
  }, []);
  return (
    <div className="listWallet">
      {walletArr.map((element) => (
        
        <h5>{element.address}</h5>
        
      ))}
    </div>
  );
});

export default ListWallet;
