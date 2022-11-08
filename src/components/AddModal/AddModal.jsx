import React, { useState } from "react";
import { MdOutlineLibraryAdd } from "react-icons/md";
import ModalWallet from "../Modal/ModalWallet";
import { Modal, Button } from "react-bootstrap";

const AddModal = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  // const handleShow = () => {
  //   let url =
  //     "https://api.twitter.com/1.1/users/show.json?user_id=HmsrZuVrqtQ6mzSm3IsFFPXIpLt1";
  //   fetch(url)
  //     .then((response) => {
  //       let data = response.json();
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       // handle the error
  //     });
  // };
  const handleClose = () => setShow(false);

  return (
    <div>
      <div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          class="mx-3"
          font-size="25px"
        >
          <MdOutlineLibraryAdd onClick={handleShow} />
        </svg>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Add NFT</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ModalWallet closeModal={handleClose} />
        </Modal.Body>

        {/* <Modal.Footer>
          <Button variant="success" type="submit" block onClick={handleAdd}>
            Add New
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close Button
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
};

export default AddModal;
