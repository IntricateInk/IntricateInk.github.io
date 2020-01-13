import React from "react";

type Props = {
    depth: number;
    children: React.ReactNode;
}

function renderIndent(props: Props) {
    return (
        <div
            style={ { paddingLeft: `${ 24 * props.depth }px`} }
        >
            { props.children }
        </div>
    );
}

export const Indent = renderIndent;
