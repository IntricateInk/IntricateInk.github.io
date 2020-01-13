import { FileCopy } from "@material-ui/icons";
import React from "react";
import { DocumentData, getColorFromDocumentState } from "../data/DocumentData";
import { LabelComponent } from "./folder-tree/LabelComponent";

type Props = {
    data: DocumentData;
    label?: string;
    onClick?(): void;
    onRename?(newName: string): void;
    onDelete?(): void;
}

function renderLabel(props: Props) {
    return (
        <LabelComponent
            icon={ <FileCopy style={ { color: getColorFromDocumentState(props.data.getDocumentState()) } }/> }
            label={ props.label || props.data.name }
            onClick={ props.onClick }
            onRename={ props.onRename }
            onDelete={ props.onDelete }
        />
    );
}

export const DocumentLabel = renderLabel;
