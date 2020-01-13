import { FolderData } from "./FolderData";
import { DocumentState, DocumentData } from "./DocumentData";

export function getFolderDocumentCount(folder: FolderData): number {
    return countFolder(folder, () => true);
}

export function getDocumentStateCount(folder: FolderData, documentState: DocumentState): number {
    return countFolder(folder, document => document.getDocumentState() === documentState);
}

function countFolder(folder: FolderData, predicate: (document: DocumentData) => boolean): number {
    let count: number = 0;

    folder.children.forEach(child => {
        if (child instanceof FolderData) count += countFolder(child, predicate);
        else if (predicate(child)) count += 1;
    });

    return count;
}