import '../style/result.css';
import React, { useState, useRef } from 'react';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BlackButton from '../component/blackbutton';
import Loader from './loader';
import Axios from 'axios';

function Result(props) {
    const email = useRef('');
    const [emailError, setEmailError] = useState("Enter your email to receive");
    const downloadClick = useRef(null);
    // const pdfLink = useRef('/Bit-to-Bit_meetingMins_Week12.pdf');
    // const pdfLink = useRef("https://documentservices.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf");
    const [downloaded, setDownloaded] = useState(false);
    const [loading, setLoading] = useState(false);
    console.log(props)
    const handleDownloadClick = (e) => {
        if (downloaded) {
            alert('The file is already downloaded');
        } else {
            downloadClick.current.click();
            Axios({
                method: 'GET',
                url: `/api/delete/${props.response.url}`
            })
            setDownloaded((prev) => (prev || true));
        }
    }

    const handleSendClick = (e) => {
        console.log(email.current)
        if (downloaded) {
            alert('The file is already downloaded');
        } else {
            const emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
            if (!emailRegex.test(email.current)) {
                console.log(!emailRegex.test(email.current));
                setEmailError(() => 'Invalid E-mail');
            } else {
                setEmailError(() => "Valid E-mail");
                // TODO: send email to server
                Axios({
                    method: 'POST',
                    url: `/api/sendEmail`,
                    data: JSON.stringify({
                        file: props.response.url,
                        email: email.current
                    }),
                    headers: {'Content-Type': 'application/json'}
                })
                setDownloaded((prev) => (prev || true));
            }
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        email.current = e.target.value;
    }

    return (
        <div className={loading ? 'result-loading' : ''}>
            {loading ? <Loader /> : <div></div>}
            <div className="Result-body">
                <div style={{ marginTop: "50px" }}>
                    <svg id="completion" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 101">
                        <g id="cirkel">
                            <g id="Mask">
                                <path id="path-1_1_" className="st1" d="M49 21c22.1 0 40 17.9 40 40s-17.9 40-40 40S9 83.1 9 61s17.9-40 40-40z" />
                            </g>
                        </g>
                        <path id="check" className="st2" d="M31.3 64.3c-1.2-1.5-3.4-1.9-4.9-.7-1.5 1.2-1.9 3.4-.7 4.9l7.8 10.4c1.3 1.7 3.8 1.9 5.3.4L71.1 47c1.4-1.4 1.4-3.6 0-5s-3.6-1.4-5 0L36.7 71.5l-5.4-7.2z" />
                    </svg>
                </div>
                <a
                    style={{ display: "none" }}
                    ref={downloadClick}
                    href={props.response.url}
                    download>
                    Download Button Hidden
                </a>
                <div className='send-result'>
                    <div className='download' onClick={handleDownloadClick}>
                        <BlackButton name={'Download'} icon={<FileDownloadIcon sx={{ color: 'white' }} />} />
                    </div>
                    <hr className='hr' />
                    <div className='email'>
                        <div style={{ height: "100%" }}>
                            <TextField
                                ref={email}
                                id="email" type="email" label="E-mail"
                                size="small"
                                helperText={emailError}
                                error={(emailError == 'Invalid E-mail')}
                                onChange={handleChange}>
                            </TextField>
                        </div>
                        <div onClick={handleSendClick}>
                            <BlackButton name={'Send to Email'} icon={<SendIcon sx={{ color: 'white' }} />} />
                        </div>
                    </div>
                </div>
                <div className='b-explain'>* All files uploaded to the server will be permanently deleted after download.</div>
                {
                    downloaded
                        ? <div>
                            <div className='b-explain'>The file downloaded successfully!</div>
                            <div className='b-explain'>(Summarized file also deleted in the server.)</div>
                        </div>
                        : <div className='result-inner'><iframe style={{ width: '100%', height: '100%' }} src={props.response.url + '#toolbar=0'} /></div>
                }
            </div >
        </div>
    );
}

export default Result;