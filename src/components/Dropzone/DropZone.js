import '../../assets/styles/components/DropZone/DropZone.scss';
import React, { useState, useEffect, useRef } from 'react';

const DropZone = ({ funcDrop }) => {


    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [validFiles, setValidFiles] = useState([]);

    const fileInputRef = useRef();

    useEffect(() => {
        let filteredArray = selectedFiles.reduce((file, current) => {
            const x = file.find(item => item.name === current.name);
            if (!x) {
                return file.concat([current]);
            } else {
                return file;
            }

        }, []);
        setValidFiles([...filteredArray]);

        funcDrop(filteredArray);
    }, [selectedFiles]);



    const dragOver = (e) => {
        e.preventDefault();
    }

    const dragEnter = (e) => {
        e.preventDefault();
    }

    const dragLeave = (e) => {
        e.preventDefault();
    }

    const fileDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
        console.log(files);
    }

    const handleFiles = (files) => {
        for (let i = 0; i < files.length; i++) {
            if (validateFile(files[i])) {
                // add to an array so we can display the name of file
                setSelectedFiles(prevArray => [...prevArray, files[i]]);

            } else {
                // add a new property called invalid
                files[i]['invalid'] = true;

                // add to the same array so we can display the name of the file
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
                // set error message
                setErrorMessage('File type not permitted');
            }
        }
    }

    const filesSelected = () => {
        if (fileInputRef.current.files.length) {
            handleFiles(fileInputRef.current.files);
        }
    }

    const fileSize = (size) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }



    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
        if (validTypes.indexOf(file.type) === -1) {
            return false;
        }
        return true;
    }

    const removeFile = (name) => {
        // find the index of the item
        // remove the item from array

        const validFileIndex = validFiles.findIndex(e => e.name === name);
        validFiles.splice(validFileIndex, 1);
        // update validFiles array
        setValidFiles([...validFiles]);
        const selectedFileIndex = selectedFiles.findIndex(e => e.name === name);
        selectedFiles.splice(selectedFileIndex, 1);
        // update selectedFiles array
        setSelectedFiles([...selectedFiles]);
    }

    const fileInputClicked = () => {
        fileInputRef.current.click();
    }


    return (
        <>
            <div className="container" onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}>
                <div className="drop-container" onClick={fileInputClicked}
                >

                    <div className="drop-message">
                        <input
                            ref={fileInputRef}
                            className="file-input"
                            type="file"
                            multiple
                            onChange={filesSelected}
                        />
                        <div className="upload-icon"></div>
                        Arrastrar y soltar la imagen
</div>
                </div>

                <div className="row  mb-4">
                    {
                        validFiles.map((data, i) =>
                            <div className="columnFotos mr-4">
                                <div>
                                    

                                </div>
                            </div>
                        )
                    }
                </div>



            </div>
        </>
    )
}

/*   <div className="file-type-logo"></div>
<img src={URL.createObjectURL(data)} id="fotosTiendaPendientes" className='text-center' />
                                    <h5 className="textoPendiente"
                                    >Pendiente <br /> aprobación</h5>
                                    <button className="top-right" onClick={() => removeFile(data.name)}>x</button>
                                    <div className="file-type">{fileType(data.name)}</div>
                                    <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                                    <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                                                                    <div className="file-remove" onClick={() => removeFile(data.name)}>X</div>

                                    */


export default DropZone;