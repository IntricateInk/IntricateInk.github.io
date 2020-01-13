import { Folder, FolderOpen } from "@material-ui/icons";
import { Color } from "csstype";
import React from "react";
import { FolderData, getFolderColor } from "../data/FolderData";
import { LabelComponent } from "./folder-tree/LabelComponent";

type Props = {
    data: FolderData | null;
    onClick?(): void;
    onRename?(newName: string): void;
    onDelete?(): void;
}

function renderLabel(props: Props) {
    if (props.data === null) return null;

    const iconColor: Color = getFolderColor(props.data);
    const isOpen: boolean = props.data.isOpen;

    return (
        <LabelComponent
            icon={ isOpen ? <FolderOpen style={ { color: iconColor } }/> : <Folder style={ { color: iconColor } }/> }
            label={ props.data.name }
            onClick={ props.onClick }
            onRename={ props.onRename }
            onDelete={ props.onDelete }
        />
    );
}

export const FolderLabel = renderLabel;

