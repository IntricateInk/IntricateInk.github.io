import { createStyles, Theme, withStyles } from "@material-ui/core";
import { WithStyles } from "@material-ui/styles";
import React, { ReactElement } from "react";
import { createFromTemplate, DocumentData } from "./data/DocumentData";
import { FolderData } from "./data/FolderData";
import { UserData } from "./data/UserData";
import { ALL_USERS, getUserFolder, saveData } from "./network/MockService";
import { FolderPage } from "./page/FolderPage";
import { LoginPage } from "./page/LoginPage";

const styles = (theme: Theme) => createStyles({

  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
  },

});

type Props = WithStyles<typeof styles> & {

};

type State = {
  user: UserData | null,
  root: FolderData,
  selected: FolderData | DocumentData | null,
};

class MainComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      user: null,
      root: new FolderData(''),
      selected: null,
    };
  }

  public componentDidMount = () => {
  }

  private doLogin = (username: string, password: string): boolean => {
    const user: UserData = ALL_USERS[username];
    if (user === undefined) return false;

    this.setState(prevState => {
      const root = getUserFolder(user.name);
      root.name = user.name;
  
      return {
        user: user,
        root: root,
      };
    });

    return true;
  }

  private doLogout = (): void => {
    this.setState({
      user: null,
      root: new FolderData(''),
      selected: null,
    });
  }

  private selectDocument = (selected: FolderData | DocumentData) => {
    this.setState({ selected }, this.forceUpdate);
  }

  private renameDocument = (document: FolderData | DocumentData, newName: string) => {
    document.name = newName;
    this.onDocumentUpdate();
  }

  private createProject = (name: string): void => {
    const project: FolderData = new FolderData(name);
    project.addChild(new FolderData('Materials'));
    project.addChild(new FolderData('Design'));
    project.addChild(new FolderData('T&C'));
    project.addUser(this.state.user!);

    this.state.root.addChild(project);
    this.onDocumentUpdate();
  }

  private addFolderToFolder = (parent: FolderData, name: string): void => {
    parent.addChild(new FolderData(name));
    this.onDocumentUpdate();
  }

  private addDocumentToFolder = (parent: FolderData, template: DocumentData): void => {
    createFromTemplate(template, parent);
    this.onDocumentUpdate();
  }

  private deleteFolder = (folder: FolderData): void => {
    folder.delete();
    this.setState(prevState => {
      return prevState.selected === folder ? { selected: null } : null;
    }, this.onDocumentUpdate);
  }

  private deleteDocument = (document: DocumentData): void => {
    document.delete();
    this.setState(prevState => {
      return prevState.selected === document ? { selected: null } : null;
    }, this.onDocumentUpdate);
  }

  private addUser = (folder: FolderData, user: UserData) => {
    if (folder.getUsers().has(user)) return;

    folder.addUser(user);
    this.onDocumentUpdate();
  }

  private removeUser = (folder: FolderData, user: UserData) => {
    if (!folder.getUsers().has(user)) return;

    folder.removeUser(user);
    this.onDocumentUpdate();
    
  }

  private onDocumentUpdate = () => {
    saveData(this.state.root);
    this.forceUpdate();
  }

  public render = (): ReactElement => {
    return (
      <div className={ this.props.classes.container }>
        { this.state.user === null ? 
          <LoginPage
            onLogin={ this.doLogin }
          />
          :
          <FolderPage
            root={ this.state.root }
            user={ this.state.user }
            selected={ this.state.selected }
            onSelect={ this.selectDocument }
            rename={ this.renameDocument }
            createProject={ this.createProject }
            addFolderToFolder={ this.addFolderToFolder }
            addDocumentToFolder={ this.addDocumentToFolder }
            deleteFolder={ this.deleteFolder }
            deleteDocument={ this.deleteDocument }
            addUser={ this.addUser }
            removeUser={ this.removeUser }
            onDocumentUpdate={ this.onDocumentUpdate }
            onLogout={ this.doLogout }
          />
        }
      </div>
    );
  }

}

export const Main = withStyles(styles)(MainComponent);
