import { Button, createStyles, Input, Theme, Typography, withStyles, WithStyles, IconButton } from "@material-ui/core";
import React, { useState, ReactElement } from "react";
import { KeyCode } from "../../utill/KeyCode";
import { Delete, Edit } from "@material-ui/icons";

const styles = (theme: Theme) => createStyles({

    container: {
        width: '100%',
        height: '100%',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'row',
    },

    folderButton: {
        flexGrow: 1,
        justifyContent: 'left',
        padding: '6px 8px',
        display: 'flex',
        flexDirection: 'row',
    },
    
    text: {
        flexGrow: 1,
        paddingLeft: '4px',
        lineHeight: 1.5,
        overflowX: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textAlign: 'left',
        textTransform: 'none',
    },

    textInput: {
        padding: 0,
    },

    optionIcon: {
        height: '36px',
        width: '36px',
    },

});

type Props = WithStyles & {
    icon: React.ReactElement,
    label: string;
    onClick?(): void;
    onRename?(newName: string): void;
    onDelete?(): void;
}

function RenderLabel(props: Props) {

    const [isRenaming, setRenaming] = useState(false);
    const doRename = (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement> |
        React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setRenaming(false);
        if (props.onRename !== undefined) props.onRename(ev.currentTarget.value);
    }

    const body = (
        <>
            { props.icon }
            {
                isRenaming ? (
                    <Input
                        className={ props.classes.text }
                        inputProps={ { className: props.classes.textInput } }
                        autoFocus
                        type="text"
                        defaultValue={ props.label }
                        onBlur={ doRename }
                        onKeyDown={ (ev) => { if (ev.keyCode === KeyCode.ENTER) doRename(ev); } }
                    />
                ) : (
                    <Typography
                        className={ props.classes.text }
                    >
                        { props.label }
                    </Typography>
                )
            }
        </>
    );

    const folderButtonProps = {
        className: props.classes.folderButton,
        children: body,
    };

    const folderButton: ReactElement = !(props.onClick || props.onRename) || isRenaming ? (
        <div { ...folderButtonProps }/>
    ) : (
        <Button
            onClick={ props.onClick ? props.onClick : () => setRenaming(true) }
            { ...folderButtonProps }
        />
    );

    return (
        <div className={ props.classes.container }>
            { folderButton }
            { props.onClick && props.onRename ?
                <IconButton
                    className={ props.classes.optionIcon }
                    onClick={ () => setRenaming(true) }
                >
                    <Edit/>
                </IconButton>
                :
                null
            }
            { props.onDelete ?
                <IconButton
                    className={ props.classes.optionIcon }
                    onClick={ props.onDelete }
                >
                    <Delete/>
                </IconButton>
                :
                null
            }
        </div>
    )
}

export const LabelComponent = withStyles(styles)(RenderLabel);
