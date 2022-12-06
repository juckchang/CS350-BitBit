import '../style/main.css';
import { FaHourglass } from "react-icons/fa";
import React, { useRef, useState } from 'react';
import SelectType from '../component/selecttype';
import UploadPDF from '../component/uploadpdf';
import CreatePDF from '../component/createpdf.js'
import DragDropList from '../component/dragdroplist';
import Loader from './loader';
import Result from './result'

function Main() {
  const fileInputRef = useRef(null)
  const [dataTransferList, setDataTransferList] = useState([])
  const serialNumber = useRef(0)
  const selectType = useRef(null)
  const [loading, setLoading] = useState(0)
  const dataFileCounter = useRef(0)
  const [response, setResponse] = useState({'url': ''})

  console.log('main', dataFileCounter);

  if (loading != 2) {
    return (
      <div>
        {loading == 1 ? <Loader /> : <div></div>}
        <div className='App-body'>
          <div className='b-subtitle'><i>Upload your PDF files, then we will create summarized PDF file for you!</i></div>
          <CreatePDF setResponse={setResponse} serialNumber={serialNumber} selectType={selectType} loading={loading} setLoading={setLoading} dataTransferList={dataTransferList} />
          <div className='b-outer-two-buttons'>
            <div className='b-selecttype'><SelectType selectType={selectType} /></div>
            <UploadPDF fileInputRef={fileInputRef} dataFileCounter={dataFileCounter} dataTransferList={dataTransferList} setDataTransferList={setDataTransferList} />
          </div>
          <div className='b-dragdrop'>
            <DragDropList fileInputRef={fileInputRef} dataFileCounter={dataFileCounter} dataTransferList={dataTransferList} setDataTransferList={setDataTransferList} />
          </div>
          <div className='b-explain'>* All files uploaded to the server will be permanently deleted after download.</div>
        </div>
      </div>
    );
  } else {
    return (
      <Result response={response} />
    );
  }
}

export default Main;
