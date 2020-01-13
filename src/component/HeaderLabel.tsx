import { createStyles, IconButton, Theme, Typography, withStyles, WithStyles, Tooltip } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React from "react";
import { DocumentData, DocumentState, getColorFromDocumentState } from "../data/DocumentData";
import { FolderData } from "../data/FolderData";
import { getDocumentStateCount, getFolderDocumentCount } from "../data/FolderUtil";
import { DocumentLabel } from "./DocumentLabel";
import { FolderLabel } from "./FolderLabel";

const styles = (theme: Theme) => createStyles({

    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
    },

    parentLabel: {
        flexGrow: 0,
    },

    labelSeperator: {
        lineHeight: '36px',
    },

    legendContainer: {
        lineHeight: '36px',
        flexShrink: 0,
        display: 'ruby',
        alignContent: 'center',
        padding: '0 8px',
    },

    icon: {
        height: '36px',
        width: '36px',
    }
    
});

type Props<T extends FolderData | DocumentData> = WithStyles & {
    data: T;
    onSelect(document: FolderData | DocumentData | null): void;
    onDelete?(self: T): void;
    onRename?(self: T, newName: string): void;
}

function renderLabel<T extends FolderData | DocumentData>(props: Props<T>) {
    return (
        <div className={ props.classes.headerContainer }>
            { props.data.parent === null ? null : (
                <>
                    <div className={ props.classes.parentLabel }>
                        <FolderLabel
                            data={ props.data.parent }
                            onClick={ () => props.onSelect(props.data.parent) }
                        />
                    </div>
                    <Typography className={ props.classes.labelSeperator }>>></Typography>
                </>
            ) }

            { renderSelfLabel(props) }

            { props.data instanceof FolderData ? renderFolderLegend(props, props.data) : null }

            { (props.data instanceof FolderData && props.data.getDepth() === 2) || props.onDelete === undefined ? null :
                <IconButton
                    className={ props.classes.icon }
                    onClick={ () => props.onDelete!(props.data) }
                >
                    <Delete/>
                </IconButton>
            }
        </div>
    );
}

function renderFolderLegend<T extends FolderData | DocumentData>(props: Props<T>, folder: FolderData) {

    const T: number = getFolderDocumentCount(folder);

    return (
        <div className={ props.classes.legendContainer }>
            { renderCount("Approved", folder, DocumentState.Approved) }{" + "}
            { renderCount("Rejected", folder, DocumentState.Rejected) }{" + "}
            { renderCount("Filled", folder, DocumentState.Filled) }{" + "}
            { renderCount("Pending", folder, DocumentState.None) }{" = "}
            <Tooltip title="Total"><Typography style={ { color: "black" } }>{ T }</Typography></Tooltip>
        </div>
    );
}

function renderCount(title: string, folder: FolderData, documentState: DocumentState) {
    return (
        <Tooltip title={ title }>
            <Typography style={ { color: getColorFromDocumentState(documentState) } }>
                { getDocumentStateCount(folder, documentState) }
            </Typography>
        </Tooltip>
    );
}

function renderSelfLabel<T extends FolderData | DocumentData>(props: Props<T>) {
    if (props.data instanceof DocumentData) {
        return (
            <DocumentLabel
                data={ props.data }
                onRename={ props.onRename ? (newName) => props.onRename!(props.data, newName) : undefined }
            />
        )
    } else if (props.data instanceof FolderData) {
        return (
            <FolderLabel
                data={ props.data }
                onRename={ props.onRename ? (newName) => props.onRename!(props.data, newName) : undefined }
            />
        )
    }
}

export const HeaderLabel = withStyles(styles)(renderLabel);

