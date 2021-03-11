import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MenuItem } from "@material-ui/core";
import firebase from "firebase";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function SelectAtom(props) {
  const classes = useStyles();
  const [stateBalance, setStateBalance] = React.useState(props.stateBalance);

  const handleChange = (event) => {
    setStateBalance(event.target.value);
    console.log("CAMBIO");
    console.log(props.storeId);
    console.log(event.target.value);
    console.log(props.balanceId);

    var actualizarEstado = firebase
      .functions()
      .httpsCallable("actualizarEstadoPago");
    actualizarEstado({
      storeId: props.storeId,
      state: event.target.value,
      balanceId: props.balanceId,
    }).then(function (result) {
      // Read result of the Cloud Function.
      //console.log(result.data.message);
      console.log(result.data);
    });
  };

  return (
    <FormControl className={classes.formControl}>
      <Select
        value={stateBalance}
        onChange={handleChange}
        defaultValue={props.stateBalance}
        name="Estado"
        inputProps={{ "aria-label": props.stateBalance }}
      >
        <MenuItem value="Pendiente">Pendiente</MenuItem>
        <MenuItem value="Pagado">Pagado</MenuItem>
      </Select>
    </FormControl>
  );
}
