import { createStyles, Theme, WithStyles, withStyles, IconButton } from "@material-ui/core";
import React from "react";
import { DocumentData } from "../../data/DocumentData";
import { FolderData } from "../../data/FolderData";
import { UserData } from "../../data/UserData";
import { DocumentLabel } from "../DocumentLabel";
import { FolderLabel } from "../FolderLabel";
import { Indent } from "./Indent";
import { ExitToApp } from "@material-ui/icons";

const styles = (theme: Theme) => createStyles({

    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    
    logoutButton: {
        width: '36px',
        height: '36px',
    },

});

type Props = WithStyles & {
    data: FolderData;
    user: UserData;
    onSelect(selected: FolderData | DocumentData): void;
    onLogout?(): void;
}

class FolderRenderer extends React.Component<Props> {

    public render() {

        const depth: number = this.props.data.getDepth();

        if (depth === 1 && !this.props.data.getUsers().has(this.props.user)) return null;

        const isOpen: boolean = this.props.data.isOpen;

        return (
            <>
                <Indent depth={ depth } key={ `${ depth }_-1` }>
                    <div className={ this.props.classes.headerContainer }>
                        <FolderLabel
                            data={ this.props.data }
                            onClick={ this.onFolderClick }
                        />
                        { depth !== 0 ? null :
                            <IconButton
                                className={ this.props.classes.logoutButton }
                                onClick={ this.props.onLogout }
                            >
                                <ExitToApp/>
                            </IconButton>
                        }
                    </div>
                </Indent>

                { !isOpen ? null : this.props.data.children.map((child, idx) => {
                    if (child instanceof FolderData) {
                        return (
                            <FolderComponent
                                key={ `${ depth }_${ idx }` }
                                data={ child }
                                user={ this.props.user }
                                onSelect={ this.props.onSelect }
                            />
                        );
                    } else {
                        return (
                            <Indent
                                key={ `${ depth }_${ idx }` }
                                depth={ depth + 1 }
                            >
                                <DocumentLabel
                                    data={ child }
                                    onClick={ () => this.props.onSelect(child) }
                                />
                            </Indent>
                        );
                    }
                }) }
            </>
        );
    }

    private onFolderClick = (): void => {
        this.props.data.toggleOpen();
        this.forceUpdate();
        this.props.onSelect(this.props.data);
    }

}

export const FolderComponent = withStyles(styles)(FolderRenderer);
