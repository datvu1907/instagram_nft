import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./Home.css";
import Profile from "../components/Profile/Profile";
import { query, where, onSnapshot } from "firebase/firestore";
import { nftCollectionRef } from "../api/firestore-collection";
import { auth, signInWithTwitter } from "../firebase";
import { useOutlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import { ToastContainer } from "react-toastify";

const Home = () => {
  const [nft, setNft] = useState([]);
  const { currentUser } = useAuth();

  const outlet = useOutlet();

  useEffect(() => {
    if (auth.currentUser != null) {
      const queryData = query(
        nftCollectionRef,
        where("owner", "==", auth.currentUser.uid)
      );
      const unsubscribe = onSnapshot(
        queryData,
        { includeMetadataChanges: true },
        (snapshot) => {
          snapshot.docs.sort((a, b) => b.data.createdOn - a.data.createdOn);

          // console.log(snapshot.docs);
          const temp = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
          temp.sort((a, b) => b.data.createdOn - a.data.createdOn);

          setNft(temp);
          // console.log(nft[0].data.image);
        }
      );
      return () => {
        unsubscribe();
      };
    }
  }, []);
  if (currentUser == null) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div>
      <Header />
      <ToastContainer />
      <Profile />

      <section class="gallery min-vh-100">
        <div class="container-lg">
          <div class="row gy-4 row-cols-1 row-cols-sm-2 row-cols-md-3">
            {nft.map((element) => (
              <div class="col" key={element.id}>
                <img
                  src={element.data.image}
                  class="gallery-item"
                  alt="gallery"
                  data-bs-toggle="modal"
                  data-bs-target="#imageExample"
                ></img>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div>
        <Footer />
      </div>
      {outlet}
    </div>
  );
};

export default Home;
