import React from 'react';


const { number, object, shape, string } = React.PropTypes;

const currentUserShapeSpec = {
    acl: object,
    email: string,
    id: number,
    profile: object,
    username: string
};

export default shape(currentUserShapeSpec);
export {
    currentUserShapeSpec
};
