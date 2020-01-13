import { createStyles, Fab, TextField, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import React, { useState } from "react";

const styles = (theme: Theme) => createStyles({

    container: {
        height: '100%',
        width: '100%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        verticalAlign: 'middle',
    },

    padDiv: {
        height: 0,
        flexGrow: 1,
    },

    formContainer: {
        display: 'flex',
        flexDirection: 'column',
    },

    title: {
        textAlign: 'center',
    },

});

type Props = WithStyles<typeof styles> & {
    onLogin(username: string, password: string): boolean;
};

const RenderLogin = (props: Props): React.ReactElement => {

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isFailedLogin, setFailedLogin] = useState(false);

    function tryLogin() {
        if (props.onLogin(username, password)) return;
        setUserName('');
        setPassword('');
        setFailedLogin(true);
    }

    return (
        <div className={ props.classes.container }>

            <div className={ props.classes.padDiv } />

            <div className={ props.classes.formContainer }>
                <Typography className={ props.classes.title } variant="h2">
                    BI App
                </Typography>

                <TextField
                    label="Username"
                    margin="normal"
                    variant="outlined"
                    value={ username }
                    onChange={ e => setUserName(e.currentTarget.value) }
                />

                <TextField
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                    variant="outlined"
                    value={ password }
                    onChange={ e => setPassword(e.currentTarget.value) }
                />

                <Fab
                    variant="extended"
                    size="large"
                    color={ isFailedLogin ? "secondary" : "primary" }
                    onClick={ tryLogin }
                >
                    Login
                </Fab>
            </div>

            <div className={ props.classes.padDiv } />

        </div>
    );

}

export const LoginPage = withStyles(styles)(RenderLogin);
