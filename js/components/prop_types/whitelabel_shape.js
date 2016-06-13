import React from 'react';


const { shape, string } = React.PropTypes;

export default shape({
    name: string,
    subdomain: string,
    title: string,
    user: string
});
