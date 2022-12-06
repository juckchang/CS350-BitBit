import React, { useState } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { CheckValidity } from '../util/checkvalidity.js';
import useMediaQuery from '@mui/material/useMediaQuery';

function UploadPDF(props) {
    const handleButtonClick = (e) => {
        if (Number(props.dataFileCounter.current) >= 5) {
            alert(`Up to 5 files are available`);
        } else { props.fileInputRef.current.click(); }
    };

    const handleChange = (e) => {
        if ((Number(props.dataFileCounter.current) + Number(e.target.files.length)) > 5) {
            alert(`Up to 5 files are available`);
        } else {
            [...e.target.files].forEach((item, i) => {
                if (CheckValidity(item, props.dataTransferList)) {
                    props.setDataTransferList((list) => { return [...list, { file: item }] });
                    props.dataFileCounter.current++;
                }
            })
        }
        e.target.value = '';
    };

    const matches = useMediaQuery('(max-width: 320px)');

    return (
        <React.Fragment>
            <button className='b-uploadpdf' onClick={handleButtonClick}>
                {matches ? '' : 'Upload PDF'} <FileUploadIcon sx={{ color: '#2856A0' }} />
            </button>
            <input
                ref={props.fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleChange}
                style={{ display: "none" }} />
        </React.Fragment>
    );
}

export default UploadPDF;