import { DocumentData, DocumentField, DocumentState } from "../data/DocumentData";
import { FolderData } from "../data/FolderData";
import { UserData } from "../data/UserData";
import { ALL_USERS } from "./MockService";

export function serialize(item: FolderData | DocumentData): object {
    if (item instanceof FolderData) return serializeFolder(item);
    return serializeDocument(item);
}

function serializeFolder(folder: FolderData): object {
    return {
        type: 'folder',
        name: folder.name,
        users: Array.from(folder.getUsers()).map(user => user.name),
        data: folder.children.map(serialize),
    };
}

function serializeDocument(document: DocumentData): object {
    const state = document.getDocumentState();
    return {
        type: 'document',
        name: document.name,
        status: state === DocumentState.Filled ? DocumentState.None : state,
        fields: document.fields,
    };
}

function deserialize(parent: FolderData, obj: any): FolderData | DocumentData {
    switch (obj.type) {
        case 'folder':
            const child = deserializeFolder(obj);
            parent.addChild(child);
            return child;
        
        case 'document':
        default:
            return deserializeDocument(parent, obj);
    }
}

export function deserializeFolder(obj: any): FolderData {
    const name: string = obj.name;
    const folder = new FolderData(name);

    const users: UserData[] = obj.users.map((user: string) => ALL_USERS[user]);
    users.forEach(folder.addUser);

    obj.data.forEach((i: any) => deserialize(folder, i));

    return folder;
}

function deserializeDocument(parent: FolderData, obj: any): DocumentData {
    const name: string = obj.name;
    const status = obj.status;
    const fields: { [key: string]: DocumentField } = obj.fields;
    return new DocumentData(name, parent, status, fields);
}
