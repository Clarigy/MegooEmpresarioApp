import React from 'react';
import PropertiesClass from './Properties';
/* import { Link } from 'react-router-dom'; */

export default function ButtonComponent(props) {

    return (<PropertiesClass.atomButton
        /* component={Link} */
        /* to={props.route} */
        fullWidth
        variant={props.variant}
        color={props.color}
        onClick={props.onClick}
        startIcon={props.icon}
    >
        {props.text}
    </PropertiesClass.atomButton>);
}
