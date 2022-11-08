import React, { useState, useEffect } from "react";
import "./ModalWallet.css";
import { Form, Button } from "react-bootstrap";
import { auth, database } from "../../firebase";
import { getDocs, addDoc, collection, query, where } from "firebase/firestore";
import { alertSuccess, alertError } from "../Toast/Toast";
const Web3 = require("web3");
const web3 = new Web3(process.env.RPC_URL);
const caver = new Web3(
  new Web3.providers.HttpProvider(
    "https://public-node-api.klaytnapi.com/v1/cypress"
  )
);
const ModalWallet = (props) => {
  const { closeModal } = props;
  const initialValues = { Address: "", TokenID: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // console.log(formValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    checkNFT();
  };
  const tokenURIABI = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  async function addNFT(metadata) {
    const nftCollection = collection(database, "collectionNFT");
    const ownerQuery = query(
      nftCollection,
      where("owner", "==", metadata.owner)
    );
    const addressQuery = query(
      ownerQuery,
      where("address", "==", metadata.address)
    );
    const idQuery = query(addressQuery, where("id", "==", metadata.id));
    const querySnapshot = await getDocs(idQuery);
    if (querySnapshot.docs.length > 0) {
      closeModal();
      alertError("NFT is existed");
    } else {
      addDoc(nftCollection, metadata)
        .then((response) => {
          closeModal();
          alertSuccess("Successfully add new NFT");
        })
        .catch((error) => {
          closeModal();
          alertError("Fail to add new NFT");
          console.log(error.mesage);
        });
    }
  }
  async function pullJson(url) {
    const request = new Request(url);
    const response = await fetch(request);
    const metadata = await response.json();

    // metadata.owner = auth.currentUser.uid;
    const object = {
      address: formValues.Address,
      id: formValues.TokenID,
      image: metadata.image,
      owner: auth.currentUser.uid,
      createdOn: Date.now(),
    };

    addNFT(object);
  }

  async function getNFTMetadata() {
    const contract = new caver.eth.Contract(tokenURIABI, formValues.Address);
    const result = await contract.methods.tokenURI(formValues.TokenID).call();

    console.log(result); // ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/101
    pullJson(result);
  }

  async function checkNFT() {
    if (window.ethereum) {
      //   // const provider = new ethers.providers.Web3Provider(window.ethereum);
      //   // const dscBook = new ethers.Contract(nftBook, DSCBook, provider);

      //   // console.log(dscBook);
      //   // const isOwner = await dscBook.checkNFTOwner(nft721, 1, accounts);
      //   // console.log(isOwner);
      getNFTMetadata();
    }
  }
  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors]);
  const validate = (values) => {
    const errors = {};
    const regex = /^0x[a-fA-F0-9]{40}$/g;
    const regexNumber = /^\d+$/;

    if (!values.Address) {
      errors.Address = "Token address is required!";
    } else if (!regex.test(values.Address)) {
      errors.Address = "This is not a valid Address format!";
    }
    if (!values.TokenID) {
      errors.TokenID = "Token id is required";
    } else if (!regexNumber.test(values.TokenID)) {
      errors.TokenID = "This is not a valid Number format!";
    }
    return errors;
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit}>
        <div className="ui divider"></div>
        <div className="ui form">
          <Form.Group className="field">
            <label>Address</label>

            <Form.Control
              type="text"
              name="Address"
              placeholder="Address"
              value={formValues.Address}
              onChange={handleChange}
            />
          </Form.Group>
          <p>{formErrors.Address}</p>
          <Form.Group className="field">
            <label>TokenID</label>
            <Form.Control
              type="text"
              name="TokenID"
              placeholder="TokenID"
              value={formValues.TokenID}
              onChange={handleChange}
            />
          </Form.Group>
          <p>{formErrors.TokenID}</p>
          <button className="fluid ui buttonSubmit blue">Submit</button>
        </div>
      </Form>
    </div>
  );
};

export default ModalWallet;
