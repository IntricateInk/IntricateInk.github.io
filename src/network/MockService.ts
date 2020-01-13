import { createEmptyFields, DocumentData, DocumentState } from '../data/DocumentData';
import { FolderData } from '../data/FolderData';
import { UserData, UserType } from '../data/UserData';
import RawProject from './RawProject.json';
import { deserializeFolder, serialize } from './Serializer';

export function getUserFolder(username: string): FolderData {
    const raw: string | null = localStorage.getItem('data');

    if (raw !== null) {
        return deserializeFolder(JSON.parse(raw));
    } else {
        const folder: FolderData = new FolderData(username);
        const project1: FolderData = parseRaw('Project 1', RawProject, 0);
        folder.addChild(project1);
        project1.addUser(ALL_USERS['BI_1']);
        return folder;
    }
}


export function saveData(data: FolderData): void {
    const serialized: string = JSON.stringify(serialize(data));
    localStorage.setItem('data', serialized);
}

function parseRaw(name: string, raw: { [key: string]: any }, depth: number): FolderData {
    const parent: FolderData = new FolderData(name);
    parent.toggleOpen(false);

    Object.keys(raw).forEach(key => {
        const val = raw[key];

        if (depth === 2) return new DocumentData(key, parent, DocumentState.None, createEmptyFields(val));
        parent.addChild(parseRaw(key, val, depth + 1));
        parent.toggleOpen(true);
    });

    return parent;
}

export const ALL_USERS: { [key: string]: UserData } = {
    'BI_1': new UserData('BI_1', UserType.Owner),
    'Contractor_1': new UserData('Contractor_1', UserType.Contractor),
    'Contractor_2': new UserData('Contractor_2', UserType.Contractor),
};

const template: FolderData = parseRaw('Template', RawProject, 0);

export function getSubmissionTypes(): string[] {
    return [
        "Air-Conditioning and Mechanical Ventilation (ACMV)",
        "Fire Detection and Protection System",
        "Plumbing and Sanitary System",
        "Fuel Storage and Distribution System",
        "Low Voltage System",
        "High Voltage System",
    ];
}

export function getTemplates(submissionType: string, systemName: string): DocumentData[] {
    return template
        .folder(submissionType)!
        .folder(systemName)!
        .children.filter(child => child instanceof DocumentData) as DocumentData[];
}
