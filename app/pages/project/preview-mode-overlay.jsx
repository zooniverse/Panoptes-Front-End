import React from 'react';
import ReactDOM from 'react-dom';

export default class PreviewModeOverlay extends React.Component {

    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.el.className = 'previewmode_overlay';
    }

    componentDidMount() {
        document.body.appendChild(this.el);
    }

    componentWillUnmount() {
        document.body.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el,
        );
    }
}
