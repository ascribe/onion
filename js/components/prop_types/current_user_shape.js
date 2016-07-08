import React from 'react';


const { number, object, shape, string } = React.PropTypes;

const currentUserShapeSpec = {
    acl: object.isRequired,
    email: string.isRequired,
    id: number.isRequired,
    profile: object.isRequired,
    username: string.isRequired
};

export default shape(currentUserShapeSpec);
export {
    currentUserShapeSpec
};
