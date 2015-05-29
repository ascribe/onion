import React from 'react';

let ButtonSubmitOrClose = React.createClass({
    render() {
        if (this.props.submitted){
            return (
                <div className="modal-footer">
                    Loading
                </div>
            )
        }
        return (
            <div className="modal-footer">
                <button type="submit" className="btn btn-ascribe-inv">{this.props.text}</button>
                <button className="btn btn-ascribe-inv" onClick={this.props.onClose}>CLOSE</button>
            </div>
        )
    }
});

export default ButtonSubmitOrClose;
