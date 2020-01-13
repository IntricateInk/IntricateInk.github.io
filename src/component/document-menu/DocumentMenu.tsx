import { Button, createStyles, Table, TableBody, Theme, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { DocumentData, DocumentField, DocumentFieldType, DocumentState } from "../../data/DocumentData";
import { FolderData } from "../../data/FolderData";
import { HeaderLabel } from "../HeaderLabel";
import { FieldComponent } from "./FieldComponent";
import { UserData, UserType } from "../../data/UserData";

const styles = (theme: Theme) => createStyles({
    
    container: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },

    tableContainer: {
        height: '100%',
        overflowY: 'scroll',
        scrollbarWidth: "thin",
    },

    table: {
        width: '100%',
        tableLayout: 'fixed',
        border: 'solid transparent 16px',
    },

});

type Props = WithStyles & {
    data: DocumentData;
    user: UserData;
    onUpdate(): void;
    onDelete(document: DocumentData): void;
    onSelect(document: FolderData | DocumentData | null): void;
    onRename(document: FolderData | DocumentData, newName: string): void;
};

class DocumentMenuRenderer extends React.Component<Props> {

    public render(): React.ReactElement {
        const documentState: DocumentState = this.props.data.getDocumentState();
        const isProcessing: boolean = documentState !== DocumentState.None && documentState !== DocumentState.Filled;
        const isContractor: boolean = this.props.user.userType === UserType.Contractor;

        return (
            <div className={ this.props.classes.container }>
                <HeaderLabel
                    data={ this.props.data }
                    onDelete={ isContractor ? undefined : this.props.onDelete }
                    onSelect={ this.props.onSelect }
                    onRename={ isContractor ? undefined : this.props.onRename }
                />

                { isProcessing || isContractor ? null :
                    <Button onClick={ () => this.setDocumentState(DocumentState.Approved) }>Approve</Button>
                }

                { isProcessing || isContractor ? null :
                    <Button onClick={ () => this.setDocumentState(DocumentState.Rejected) }>Reject</Button>
                }

                { !isProcessing || isContractor ? null :
                    <Button onClick={ () => this.setDocumentState(DocumentState.None) }>Reset</Button>
                }

                <div className={ this.props.classes.tableContainer }>
                    <Table className={ this.props.classes.table }>
                        <colgroup>
                            <col width="300px"/>
                            <col width="100%"/>
                        </colgroup>

                        <TableBody>
                            { Object.entries(this.props.data.fields).map(([name, field], idx) => (
                                <FieldComponent
                                    key={ idx }
                                    fieldName={ name }
                                    fieldData={ field }
                                    onValueUpdate={ (newValue: string) => this.setDocumentFieldValue(field, newValue) }
                                    onNameUpdate={ (newName: string) => this.setDocumentFieldName(field, newName) }
                                />
                            )) }
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    private setDocumentFieldValue = (field: DocumentField, newValue: string): void => {
        field.value = newValue;
        this.props.onUpdate();
    }

    private setDocumentFieldName = (field: DocumentField, newName: string): void => {
        if (field.type !== DocumentFieldType.Pdf && field.type !== DocumentFieldType.Image) return;
        field.name = newName;
        this.props.onUpdate();
    }

    private setDocumentState = (documentState: DocumentState.None | DocumentState.Approved | DocumentState.Rejected): void => {
        this.props.data.setDocumentState(documentState);
        this.props.onUpdate();
    }

}

export const DocumentMenu = withStyles(styles)(DocumentMenuRenderer);
