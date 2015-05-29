import React from 'react';

let ModalMixin = {
    onRequestHide(e){
        if (e)
            e.preventDefault();
        this.props.onRequestHide();
    }
};

export default ModalMixin;