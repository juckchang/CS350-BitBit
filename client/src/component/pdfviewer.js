import React, { Component } from 'react';
import ViewSDKClient from '../util/viewSDKclient';

class FullWindow extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const viewSDKClient = new ViewSDKClient();
        viewSDKClient.ready().then(() => {
            /* Invoke file preview */
            /* By default the embed mode will be Full Window */
            viewSDKClient.previewFile("pdf-div", {
                showAnnotationTools: false,
                showDownloadPDF: false,
                showPrintPDF: false,
            }, this.props.url);
        });
    }

    render() {
        return <div id="pdf-div" style={{ minHeight: "100% !important" }} />;
    }
}

export default FullWindow;
