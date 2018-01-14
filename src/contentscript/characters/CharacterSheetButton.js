import './CharacterSheetButton.scss';

import React, { Component } from 'react';

class CharacterSheetButton extends Component {
    render() {
        const fromParent = this.props.className || "";
        const hidden = this.props.hidden ? " hidden" : "";
        const className = `${fromParent} character-button-small character-button-outline Character-sheet-button ${hidden}`;
        return (
            <button id="test" role="button" className={className} onMouseDown={this.props.onClick.bind(this)} title={this.props.title}>{this.props.value}</button>
        );
    }
}

export default CharacterSheetButton;