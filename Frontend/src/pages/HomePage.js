import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Home from '../components/home/Home';

export default function HomePage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Something went wrong, Please try again');
    const [successfull, isSuccessfull] = useState(false);

    const fileChangeHandler = (e)=>{
        setError(false);
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
    }
        

    const fileSubmitHandler = async (e) => {
        try {
            // setError(false);
            if(!selectedFile){
                console.log('file not attached');
                setErrorMessage('Please attach at least one file');
                setError(true);
            }

            if(!error){
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
            }else{
                console.log('error occured');
                e.preventDefault();
            }
        } catch (error) {
            console.log("error is ", error);
            setError(true);
        }
    }

    return (
        <Home 
            fileChangeHandler={fileChangeHandler}
            fileSubmitHandler={fileSubmitHandler}
            error={error}
            errorMessage={errorMessage}
            successfull={successfull}
        />
    )
}
