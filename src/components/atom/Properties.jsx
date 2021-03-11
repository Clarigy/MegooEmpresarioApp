import { Button, withStyles } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';

//Colores, redondo.
export default class PropertiesClass {

    // ------------ Colores principales ------------
    static pColorPurple = '#6C3EFF'; //Morado principal
    static pColorPurpleLight = '#8964ff'; //Morado principal claro
    static pColorPurpleDark = '#4b2bb2'; //Morado principal oscuro

    static pColorPurpleBlack = '#1A1446'; //Morado oscuro
    static pColorBlueLight = '#00D4D8'; //Azul celeste
    static pColorWhite = '#FFFFFF'; //Blanco

    // ------------ Colores secundarios ------------
    static sColorPink = '#FF3B7B'; //Rosado secundario
    static sColorPinkLight = '#ff6295'; //Rosado secundario claro
    static sColorPinkDark = '#b22956'; //Rosado secundario oscuro

    static sColorGreenLight = '#34D69B'; //Verde claro
    static sColorGray = '#E0E0E0'; //Gris

    // ------------ Propiedades del tema para Material UI ------------
    static theme = createMuiTheme({
        palette: {
            primary: {
                light: this.pColorPurpleLight,
                main: this.pColorPurple,
                dark: this.pColorPurpleDark,
                contrastText: '#fff',
            },
            secondary: {
                light: this.sColorPinkLight,
                main: this.sColorPink,
                dark: this.sColorPinkDark,
                contrastText: '#fff',
            },
            default: {
                main: this.pColorWhite,
                contrastText: '#fff',
            },
        },
    });

    // ------------ Propiedades tipografia ------------
    static fontText = 'Spartan';
    static semiBoldWeightText = 600;
    static normalWeightText = 400;

    // ------------ Propiedad bordes ------------
    static borderRadius = '0.5rem';
    static border = '0.2rem solid';

    // ------------ Propiedades del botón principal ------------
    static atomButton = withStyles((theme) => ({
        root: {
            fontFamily: this.fontText,
            borderRadius: this.borderRadius,
            fontWeight: this.semiBoldWeightText,
            margin: theme.spacing(1, 0, 1),
        },
        label: {
            textTransform: 'initial',
        },

    }))(Button);

}




