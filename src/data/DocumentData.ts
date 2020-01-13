import { FolderData } from "./FolderData";
import { Color } from "csstype";

export enum DocumentState {
    None = "None",
    Filled = "Filled",
    Approved = "Approved",
    Rejected = "Rejected",
};

export enum DocumentFieldType {
    String = "String",
    Pdf = "PDF",
    Image = "Image",
}

export type DocumentFieldString = {
    type: DocumentFieldType.String;
}

export type DocumentFieldPdf = {
    type: DocumentFieldType.Pdf;
    name: string;
}

export type DocumentFieldImage = {
    type: DocumentFieldType.Image;
    name: string;
}

export type DocumentField = (
    DocumentFieldString |
    DocumentFieldPdf |
    DocumentFieldImage
) & {
    value: string;
};

export class DocumentData {

    public name: string;
    public fields: { [key: string]: DocumentField };

    public parent: FolderData;

    private documentState: DocumentState.None | DocumentState.Approved | DocumentState.Rejected;

    constructor(name: string, parent: FolderData, documentState: DocumentState.None | DocumentState.Approved | DocumentState.Rejected, fields: { [key: string]: DocumentField }) {
        this.name = name;
        this.fields = fields;

        this.parent = parent;
        this.documentState = documentState;

        this.parent.addChild(this);
    }

    public setDocumentState = (newState: DocumentState.None | DocumentState.Approved | DocumentState.Rejected): void => {
        this.documentState = newState;
    }

    public getDocumentState = (): DocumentState => {
        if (this.documentState === DocumentState.None && this.isFilled()) return DocumentState.Filled;
        return this.documentState;
    }

    public delete = (): void => {
        this.parent.removeChild(this);
    }

    public isFilled = (): boolean => {
        return Object.values(this.fields).every(field => field.value.length !== 0);
    }
}

export function createFromTemplate(template: DocumentData, parent: FolderData): DocumentData {
    const fields: { [key: string]: DocumentField } = {};

    Object.entries(template.fields).forEach(([key, field]) => {
        fields[key] = createEmptyField(field.type);
    });

    return new DocumentData(template.name, parent, DocumentState.None, fields);
}

export function createEmptyFields(obj: any): { [key: string]: DocumentField } {
    const out: { [key: string]: DocumentField } = {};

    Object.entries(obj).forEach(([name, type]) => {
        out[name] = createEmptyField(type as any);
    });

    return out;
}

export function createEmptyField(fieldType: DocumentFieldType): DocumentField {
    switch (fieldType) {
        case DocumentFieldType.Image:
            return {
                type: DocumentFieldType.Image,
                value: '',
                name: '',
            };

        case DocumentFieldType.Pdf:
            return {
                type: DocumentFieldType.Pdf,
                value: '',
                name: '',
            };
        
        case DocumentFieldType.String:
            return {
                type: DocumentFieldType.String,
                value: '',
            };
    }
}

export function getColorFromDocumentState(documentState: DocumentState): Color {
    switch (documentState) {
        case DocumentState.Approved:
            return 'green';

        case DocumentState.Rejected:
            return 'red';

        case DocumentState.Filled:
            return 'gray';

        case DocumentState.None:
            return 'black';
    }
}
