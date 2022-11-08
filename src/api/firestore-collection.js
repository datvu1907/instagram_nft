import { collection } from "firebase/firestore";
import { database } from "../firebase";

export const nftCollectionRef = collection(database, "collectionNFT");
export const userCollectionRef = collection(database, "user");
export const walletCollectionRef = collection(database, "wallets");