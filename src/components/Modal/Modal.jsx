import React from 'react'

const Modal = () => {
  return (
    <div className="modal fade" id ="imageExample"  tabIndex="-1" aria-hidden="true">
        <div className = "modal-dialog">
            <div className ="modal-content">
                <div className = "modal-body">
                    <button type = "button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        
                    </button>
                    <img src="./Image/mate1.png" alt=""  className = "d-block w-100" ></img>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Modal