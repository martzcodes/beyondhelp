import './CharacterSheetButton.scss';

import React, { Component } from 'react';

class CharacterSheetButton extends Component {
    render() {
        const fromParent = this.props.className || "";
        const hidden = this.props.hidden ? " hidden" : "";
        const className = `${fromParent} character-button-small character-button-outline Character-sheet-button ${hidden}`;
        return (
            <button role="button" className={className} onMouseDown={this.props.onClick} title={this.props.title}>Roll</button>
        );
    }
}

export default CharacterSheetButton;