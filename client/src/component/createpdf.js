import React, { Component, useHistory } from 'react';
import SendIcon from '@mui/icons-material/Send'
import Axios from 'axios'
import BlackButton from './blackbutton';

class CreatePDF extends Component {
    constructor(props, state) {
        super(props)
    }

    handleButtonClick = async () => {
        if (this.props.dataTransferList.length <= 0) {
            alert('Upload PDF files')
        } else {
            if ((this.props.selectType.current == null) || (this.props.selectType.current == 'null')) {
                alert('Choose the Select Summary Type')
            } else {
                this.props.serialNumber.current = Math.floor(100000000 + Math.random() * 900000000)
                this.props.setLoading(() => (1));

                const dataTransfer = new DataTransfer()
                this.props.dataTransferList.forEach(item => {
                    dataTransfer.items.add((item.file))
                })
                const fileList = []
                let errorFlag = 0
                
                for (let i = 0; i < dataTransfer.files.length; i++) {
                    const formData = new FormData()
                    formData.append("file", dataTransfer.files[i])
                    const res = await Axios({
                        method: 'POST',
                        url: '/api/upload', 
                        data: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    if (res.status === 200) {
                        fileList.push(res.data.message)
                    } else {
                        alert(`Upload Error on ${dataTransfer.files[i].name}`)
                        errorFlag = 1
                        break
                    }
                }

                if (errorFlag == 1) {
                    this.props.setLoading(() => (1));
                } else {
                    const res = await Axios({
                        method: 'POST',
                        url: '/api/summarize',
                        data: JSON.stringify({
                            'files': fileList,
                            'option': parseInt(this.props.selectType.current)
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    if (res.status === 200) {
                        this.props.setResponse({
                            url: res.data.message
                        })
                        this.props.setLoading(() => (2));
                    } else {
                        alert(`Error on summarize`)
                        this.props.setLoading(() => (1));
                    }
                }
            }
        }
    }

    render() {
        return (
            <div
                style={{ marginTop: "40px", marginBottom: "40px" }}
                onClick={this.handleButtonClick}>
                <BlackButton name={'Summarize'} icon={<SendIcon sx={{ color: 'white' }} />} />
            </div >
        );
    }
}

export default CreatePDF;