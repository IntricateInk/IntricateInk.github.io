import { Button, createStyles, Menu, MenuItem, Theme, Typography, withStyles, WithStyles, IconButton } from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import React from "react";
import { DocumentData } from "../../data/DocumentData";
import { FolderData } from "../../data/FolderData";
import { UserData, UserType } from "../../data/UserData";
import { getTemplates, getSubmissionTypes, ALL_USERS } from "../../network/MockService";
import { DocumentLabel } from "../DocumentLabel";
import { Indent } from "../folder-tree/Indent";
import { FolderLabel } from "../FolderLabel";
import { HeaderLabel } from "../HeaderLabel";

const styles = (theme: Theme) => createStyles({

    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
    },

    userTitleLabel: {
        padding: '8px',
    },

    userContainer: {
        width: '100%',
        height: '36px',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'row',
    },

    userText: {
        flexGrow: 1,
        paddingLeft: '4px',
        lineHeight: 1.5,
        overflowX: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textAlign: 'left',
        textTransform: 'none',
    },

    userDeleteIcon: {
        height: '36px',
        width: '36px',
    },

    parentLabel: {
        flexGrow: 0,
    },

    labelSeperator: {
        lineHeight: '36px',
    },
    
});

type Props = WithStyles & {
    data: FolderData;
    user: UserData;
    onSelect(document: FolderData | DocumentData | null): void;
    onCreateProject(name: string): void;
    onCreateFolder(parent: FolderData, name: string): void;
    onCreateDocument(parent: FolderData, template: DocumentData): void;
    onRenameDocument(document: DocumentData, newName: string): void;
    onDeleteDocument(document: DocumentData): void;
    onRenameFolder(document: FolderData, newName: string): void;
    onDeleteFolder(folder: FolderData): void;
    onAddUser(folder: FolderData, user: UserData): void;
    onRemoveUser(folder: FolderData, user: UserData): void;
};

function renderFolderMenu(props: Props): React.ReactElement {
    let children = props.data.children;
    const depth: number = props.data.getDepth();
    const isContractor: boolean = props.user.userType === UserType.Contractor;

    if (depth === 0)
        children = children.filter(child => child instanceof FolderData && child.getUsers().has(props.user));

    return (
        <div>
            <HeaderLabel
                data={ props.data }
                onDelete={ isContractor || depth === 0 ? undefined : props.onDeleteFolder }
                onSelect={ props.onSelect }
                onRename={ isContractor || depth === 0 ? undefined : props.onRenameFolder }
            />

            { children.map((child, idx) => {
                if (child instanceof DocumentData) {
                    return (
                        <Indent depth={ 1 } key={ idx }>
                            <DocumentLabel
                                data={ child }
                                onClick={ () => props.onSelect(child) }
                                onRename={ isContractor ? undefined : (newName) => props.onRenameDocument(child, newName) }
                                onDelete={ isContractor ? undefined : () => props.onDeleteDocument(child) }
                            />
                        </Indent>
                    )
                } else {
                    return (
                        <Indent depth={ 1 } key={ idx }>
                            <FolderLabel
                                data={ child }
                                onClick={ () => props.onSelect(child) }
                                onRename={ isContractor || props.data.getDepth() !== 0 ? undefined : (newName) => props.onRenameFolder(child, newName) }
                                onDelete={ isContractor || props.data.getDepth() === 1 ? undefined : () => props.onDeleteFolder(child) }
                            />
                        </Indent>
                    );
                }
            }) }

            { isContractor ? null : 
                <Indent depth={ 1 }>
                    { RenderCreateButton(props) }
                </Indent>
            }

            { isContractor ? null : RenderUsers(props) }

        </div>
    )
}

function RenderUsers(props: Props) {
    const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);

    if (props.data.getDepth() !== 1) return null;

    const users: UserData[] = Object.values(ALL_USERS).filter(user => !props.data.getUsers().has(user));

    const menuOpen = (event: React.MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget);
    const menuClose = () => setMenuAnchor(null);
    const menu = (
        <Menu
            anchorEl={menuAnchor}
            keepMounted
            open={Boolean(menuAnchor)}
            onClose={menuClose}
        >
            { users.map((user, idx) => (
                <MenuItem
                    key={ idx }
                    onClick={ () => {
                        props.onAddUser(props.data, user);
                        menuClose();
                    } }
                >
                    { user.name }
                </MenuItem>
            )) }   
        </Menu>
    );

    return (
        <>
            <Typography className={ props.classes.userTitleLabel }>Users</Typography>
            
            { Array.from(props.data.getUsers()).map((user, idx) => (
                <Indent depth={ 1 } key={ idx }>
                    <div className={ props.classes.userContainer }>
                        <Typography className={ props.classes.userText }>{ user.name }</Typography>
                        { props.user === user ? null :
                            <IconButton
                                className={ props.classes.userDeleteIcon }
                                onClick={ () => props.onRemoveUser(props.data, user) }
                            >
                                <Delete/>
                            </IconButton>
                        }
                    </div>
                </Indent>
            )) }

            <Indent depth={ 1 }>
                <Button onClick={ menuOpen } disabled={ users.length === 0 }>
                    <Add/>
                    Add User
                </Button>
            </Indent>

            { menu }
        </>
    );
}

function RenderCreateButton(props: Props) {
    const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);

    let label: string = 'New Document';
    let menuItems: string[] = [];
    let onClick: (name: string) => void = (name: string) => props.onCreateFolder(props.data, name);

    switch (props.data.getDepth()) {
        case 0:
            return (
                <Button
                    onClick={ () => props.onCreateProject('New Project') }
                >
                    <Add/>
                    New Project
                </Button>
            );

        case 1:
            return null!;
            
        case 2:
            label = 'New Submission Document';
            menuItems = getSubmissionTypes().filter(folder => props.data.children.find(child => child.name === folder) === undefined);
            break;
            
        case 3:
            const templates: { [key: string]: DocumentData } = {};
            getTemplates(props.data.parent!.name, props.data.name).forEach(template => templates[template.name] = template);
            menuItems = Object.keys(templates);
            onClick = (name: string) => props.onCreateDocument(props.data, templates[name]);
            break;
    }

    if (menuItems.length === 0) return null!;

    const menuOpen = (event: React.MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget);
    const menuClose = () => setMenuAnchor(null);
    const menu = (
        <Menu
            anchorEl={ menuAnchor }
            keepMounted
            open={ Boolean(menuAnchor) }
            onClose={ menuClose }
        >
            { menuItems.map((item, idx) => (
                <MenuItem
                    key={ idx }
                    onClick={ () => {
                        onClick(item);
                        menuClose();
                    } }
                >
                    { item }
                </MenuItem>
            )) }
        </Menu>
    );

    return (
        <>
            <Button
                onClick={ menuOpen }
                disabled={ menuItems.length === 0 }
            >
                <Add/>
                { label }
            </Button>
            { menu }
        </>
    )
}

export const FolderMenu = withStyles(styles)(renderFolderMenu);
