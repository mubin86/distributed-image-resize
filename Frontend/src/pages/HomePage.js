import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import Home from '../components/home/Home';
import ModalContent from '../components/modal/ModalContent';
import '../components/modal/ModalContent.css'
Modal.setAppElement('#root');

export default function HomePage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Something went wrong, Please try again');
    const [successfull, isSuccessfull] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [resizeValue, setResizeValue] = useState(null);

    const history = useHistory();

    const imageResizeData = [
        {id: 1, width: 300, height: 300},
        {id: 2, width: 600, height: 600}, //****configure some other resize option && width and height will be taken as input
        {id: 3, width: 900, height: 900},
    ];

    const imageResizeHandler = (id) => {
        let selectedItem = imageResizeData.filter(item => item.id === id);
        console.log("selectedItem is ", selectedItem);
        setModalIsOpen(false);
        setResizeValue(selectedItem);
    }

    const fileChangeHandler = (e)=>{
        setError(false);
        isSuccessfull(false);
        console.log("file is ", e.target.files);
        let files = [...e.target.files];
        console.log("file length is ", files.length);
        for ( let i = 0; i < files.length; i++ ) {
            console.log("file i is ", files[i].type);
            let type = files[i].type;
            if(type != "image/jpeg" && type != "image/jpg" && type != "image/png"){
                setErrorMessage('File format is not supported');
                setError(true);
            }
        }
        setSelectedFile(files);
        setModalIsOpen(true);
    }
        

    const fileSubmitHandler = async (e) => {
        try {
            // isSuccessfull(false);
            // setError(false);
            if(!selectedFile){
                console.log('file not attached');
                setError(true); 
                setErrorMessage('Please attach at least one file');
                return;
            }
            if(!resizeValue){
                console.log('image resize option is not selected');
                setError(true);
                setErrorMessage('Resize option is not selected');
                return;
            }
            if(!error){
                console.log("api calling");
                const fd = new FormData();
                for ( let i = 0; i < selectedFile.length; i++ ) {
                    fd.append('images', selectedFile[i], selectedFile[i].name);
                }
                let res = await axios.post('http://localhost:3001/api/image-upload', fd, {
                        onUploadProgress: progressEvent =>{
                            console.log("Upload progress " + Math.round((progressEvent.loaded / progressEvent.total) * 100) + '%');
                        }
                    }
                );
                console.log("res is ", res.data);
                isSuccessfull(true);
                setSelectedFile(null);

                //********sqs api will be called
            }else{
                console.log('error occured');
                e.preventDefault();
            }
        } catch (error) {
            console.log("error is ", error);
            setError(true);
        }
    }

        // if(successfull){
        //     history.push('/')
        // }else{

            return (
                <React.Fragment>
                <Modal isOpen={modalIsOpen} className="mymodal" overlayClassName="myoverlay"  onRequestClose={() => setModalIsOpen(false)}>
                    <ModalContent
                        imageResizeData={imageResizeData}
                        imageResizeHandler={imageResizeHandler}
                    />
                </Modal>
                <Home 
                    fileChangeHandler={fileChangeHandler}
                    fileSubmitHandler={fileSubmitHandler}
                    error={error}
                    errorMessage={errorMessage}
                    successfull={successfull}
                />
                </React.Fragment>
            )
        }

