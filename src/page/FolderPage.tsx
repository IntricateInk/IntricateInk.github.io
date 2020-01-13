import { createStyles, Theme, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import React from 'react';
import { DocumentMenu } from '../component/document-menu/DocumentMenu';
import { FolderMenu } from '../component/folder-menu/FolderMenu';
import { FolderComponent } from '../component/folder-tree/FolderComponent';
import { DocumentData } from '../data/DocumentData';
import { FolderData } from '../data/FolderData';
import { UserData } from '../data/UserData';

const styles = (theme: Theme) => createStyles({

  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },

  foldertree: {
    width: '300px',
    height: '100%',
    flexGrow: 0,
    overflowY: "scroll",
    scrollbarWidth: "thin",
  },

  body: {
    width: 0,
    flexGrow: 1,
  },

});

type Props = WithStyles<typeof styles> & {
    root: FolderData;
    user: UserData;
    selected: FolderData | DocumentData | null;
    onSelect(selected: FolderData | DocumentData | null): void;
    rename(document: FolderData | DocumentData, newName: string): void;

    createProject(name: string): void;
    addFolderToFolder(parent: FolderData, name: string): void;
    addDocumentToFolder(parent: FolderData, template: DocumentData): void;
    deleteFolder(folder: FolderData): void;

    deleteDocument(document: DocumentData): void;

    addUser(folder: FolderData, user: UserData): void;
    removeUser(folder: FolderData, user: UserData): void;

    onDocumentUpdate(): void;
    onLogout(): void;
};

function RenderFolderPage(props: Props) {
    let body = null;

    if (props.selected instanceof FolderData) {
      body = (
        <FolderMenu
          data={ props.selected }
          user={ props.user }
          onSelect={ props.onSelect }
          onCreateProject={ props.createProject }
          onCreateFolder={ props.addFolderToFolder }
          onCreateDocument={ props.addDocumentToFolder }
          onRenameDocument={ props.rename }
          onDeleteDocument={ props.deleteDocument }
          onDeleteFolder={ props.deleteFolder }
          onRenameFolder={ props.rename }
          onAddUser={ props.addUser }
          onRemoveUser={ props.removeUser }
        />
      );
    } else if (props.selected instanceof DocumentData) {
      body = (
        <DocumentMenu
          data={ props.selected }
          user={ props.user }
          onDelete={ props.deleteDocument }
          onUpdate={ props.onDocumentUpdate }
          onSelect={ props.onSelect }
          onRename={ props.rename }
        />
      )
    }

    return (
        <div className={ props.classes.container }>
            <div className={ props.classes.foldertree }>
                <FolderComponent
                    data={ props.root }
                    user={ props.user }
                    onSelect={ props.onSelect }
                    onLogout={ props.onLogout }
                />
            </div>

            <div className={ props.classes.body }>
                { body }
            </div>
        </div>
    );
}

export const FolderPage = withStyles(styles)(RenderFolderPage);
