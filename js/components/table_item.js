import React from 'react';

let TableItem = React.createClass({
    render() {
        
        let piece = this.props.piece;
        let columnClasses = 'col-xs-3 col-sm-3 col-md-3 col-lg-3';

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="row">
                    <div className={columnClasses}>
                        <img src={piece.thumbnail} height="50" />
                    </div>
                    <div className={columnClasses}>
                        {piece.artist_name}
                    </div>
                    <div className={columnClasses}>
                        {piece.title}
                    </div>
                    <div className={columnClasses}>
                        {piece.availableActions}
                    </div>
                </div>
            </div> 
        );
    }
});

export default TableItem;