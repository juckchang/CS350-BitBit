import React, { Component } from 'react';
import List from './list'
import { CheckValidity } from '../util/checkvalidity.js';

class DragDropList extends Component {
    constructor(props, state) {
        super(props)
        this.state = {
            dragOver: false
        }
    }

    handleButtonClick = (e) => {
        if (Number(this.props.dataFileCounter.current) >= 5) {
            alert(`Up to 5 files are available`);
        } else { this.props.fileInputRef.current.click(); }
    };

    dropHandler = (e) => {
        this.setState({ dragOver: false })

        e.preventDefault();
        e.stopPropagation();

        if ((Number(this.props.dataFileCounter.current) + Number(e.dataTransfer.items.length)) > 5) {
            alert(`Up to 5 files are available`);
        } else {
            if (e.dataTransfer.items) {
                [...e.dataTransfer.items].forEach((item, i) => {
                    if (item.kind === 'file') {
                        const file = item.getAsFile();
                        if (CheckValidity(file, this.props.dataTransferList)) {
                            this.props.setDataTransferList((list) => [...list, { file: file }]);
                            this.props.dataFileCounter.current++;
                        }
                    }
                });
            }
        }
    };

    dragOverHandler = (e) => {
        this.setState({ dragOver: true })
        e.preventDefault();
        e.stopPropagation();
    };

    dragEnterHandler = (e) => {
        this.setState({ dragOver: true })
        e.preventDefault();
        e.stopPropagation();
    }

    dragLeaveHandler = (e) => {
        this.setState({ dragOver: false })
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        return (
            <div
                className={this.state.dragOver ? ['b-inner-dragdrop', 'b-inner-dragdrop-dragover'].join(" ") : 'b-inner-dragdrop'}
                onClick={this.handleButtonClick}
                onDrop={this.dropHandler}
                onDragOver={this.dragOverHandler}
                onDragEnter={this.dragEnterHandler}
                onDragLeave={this.dragLeaveHandler}>
                {
                    (this.props.dataTransferList.length <= 0)
                        ? <div className='b-inner-dragdrop-none'>
                            <div style={{ height: "100%", marginTop: "10px" }}><i>Drag one or more files to this drop zone.</i></div>
                            <div><i>1. Up to 5 files are available</i></div>
                            <div><i>2. Only PDF files are available</i></div>
                            <div style={{ marginBottom: "10px" }}><i>3. Each file should consist of at least 95% of English and must not exceed 5 MB in size.</i></div>
                        </div>
                        : <List dataFileCounter={this.props.dataFileCounter} dataTransferList={this.props.dataTransferList} setDataTransferList={this.props.setDataTransferList} />
                }
            </div >
        )
    }
}

export default DragDropList;