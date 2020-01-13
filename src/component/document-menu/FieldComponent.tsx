import { Button, createStyles, Input, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import React from 'react';
import { DocumentField, DocumentFieldType } from '../../data/DocumentData';

const styles = (theme: Theme) => createStyles({

    input: {
        width: '100%',
    },

    fieldValueContainer: {
        width: '100%',
        height: '24px',
        display: 'flex',
        flexDirection: 'row',
    },

    fieldValueLabel: {
        paddingLeft: '8px',
        flexGrow: 1,
    },

});

type Props = WithStyles & {
    fieldName: string,
    fieldData: DocumentField,
    onValueUpdate(newValue: string): void,
    onNameUpdate(newName: string): void,
};

function RenderFieldComponent(props: Props) {
    return (
        <tr>
            <td>
                <Typography>{ props.fieldName }</Typography>
            </td>

            <td>
                { RenderInput(props) }
            </td>
        </tr>
    );
}

function RenderInput(props: Props) {

    function saveFileField(field: { name: string, value: string }) {
        props.onValueUpdate(field.value);
        props.onNameUpdate(field.name);
    }

    switch (props.fieldData.type) {
        case DocumentFieldType.Image:
        case DocumentFieldType.Pdf:
            return (
                <div className={ props.classes.fieldValueContainer }>
                    <Button variant="outlined">
                        <label>
                            <Typography>Upload</Typography>
                            <input
                                type="file"
                                style={ { display: 'none' } }
                                accept={ props.fieldData.type === DocumentFieldType.Pdf ? ".pdf" : "image/*" }
                                onChange={ e => loadFile(e.target.files![0]).then(saveFileField) }
                            />
                        </label>
                    </Button>

                    { props.fieldData.value.length === 0 ? <div className={ props.classes.fieldValueLabel }/> :
                        <a
                            className={ props.classes.fieldValueLabel }
                            href={ props.fieldData.value }
                            download={ props.fieldData.name }
                        >
                            <Typography>
                                { props.fieldData.name }
                            </Typography>
                        </a>
                    }
                </div>
            );

        default:
            return (
                <Input
                    className={ props.classes.input }
                    value={ props.fieldData.value || '' }
                    onChange={ ev => props.onValueUpdate(ev.currentTarget.value) }
                />
            );
    }
}

function loadFile(file: File): Promise<{ name: string, value: string }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const result: string = event.target!.result as string;
            resolve({
                name: file.name,
                value: result,
            });
        };
        reader.readAsDataURL(file);
    });
}

export const FieldComponent = withStyles(styles)(RenderFieldComponent);
