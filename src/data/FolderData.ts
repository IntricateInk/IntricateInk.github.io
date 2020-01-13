import { Color } from "csstype";
import { DocumentData, DocumentState } from "./DocumentData";
import { UserData } from "./UserData";
import { getDocumentStateCount } from "./FolderUtil";

export class FolderData {

    public name: string;
    public parent: FolderData | null;
    public children: (FolderData | DocumentData)[];
    public isOpen: boolean;

    private users: Set<UserData>;

    constructor(name: string) {
        this.name = name;
        this.parent = null;
        this.children = [];
        this.isOpen = true;

        this.users = new Set();
    }

    public folder = (folderName: string): FolderData | undefined => {
        return (this.children.filter(child => child instanceof FolderData) as FolderData[])
            .find(child => child.name === folderName);
    }

    public delete = (): void => {
        if (this.parent !== null) {
            this.parent.removeChild(this);
        }
    }

    public toggleOpen = (isOpen?: boolean): void => {
        this.isOpen = isOpen === undefined ? !this.isOpen : isOpen;
    }

    public removeChild = (child: FolderData | DocumentData): void => {
        child.parent = null;
        this.children = this.children.filter(c => c !== child);
    }

    public addChild = (child: FolderData | DocumentData): void => {
        child.parent = this;
        this.children.push(child);
    }

    public getPath = (): FolderData[] => {
        if (this.parent === null) return [this];
        return this.parent.getPath().concat([this]);
    }

    public getDepth = (): number => {
        if (this.parent === null) return 0;
        return this.parent.getDepth() + 1;
    }

    public getApproved = (): boolean => {
        return this.children
            .every(child =>
                child instanceof FolderData ?
                    child.getApproved() :
                    child.getDocumentState() === DocumentState.Approved
            );
    }

    public getUsers = (): Set<UserData> => {
        return this.users;
    }

    public addUser = (user: UserData): void => {
        this.users.add(user);
    }

    public removeUser = (user: UserData): void => {
        this.users.delete(user);
    }
}

export function getFolderColor(folder: FolderData): Color {
    if (folder.getApproved()) return 'green';
    else if (getDocumentStateCount(folder, DocumentState.Rejected) > 0) return 'red';
    else if (getDocumentStateCount(folder, DocumentState.None) === 0) return 'gray';
    return 'black';
}
