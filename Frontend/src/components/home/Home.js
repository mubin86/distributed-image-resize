import React from 'react'


export default function Home(props) {
    let errorMessage= <span className="help-block">
        <strong className="text-danger font-weight-bold">{props.errorMessage}</strong>
        </span>;

    let successMessage= <span className="help-block">
    <strong className="text-success font-weight-bold">Image successfully uploaded</strong>
    </span>;

    return (
        <div className="container">
                    <div className="card border-light mb-3 mt-5" style={{ boxShadow: '0 5px 10px 2px rgba(195,192,192,.5)' }}>
                        <div className="card-header">
                            <h3 style={{ color: '#555', textAlign: 'center' }}>Upload Your Image</h3>
                            <p className="text-muted" style={{ textAlign: 'center' }}>You can select multiple images</p>
                        </div>
                        <div className="card-body">
                            <div className="row justify-content-center">
                                <input id="inp" type="file" multiple onChange={props.fileChangeHandler}/>
                                <div className="mt-5" style={{textAlign: 'center'}}>
                                    <button type="submit" className="btn btn-outline-secondary btn-block" onClick={props.fileSubmitHandler}>Upload!</button>
                                </div>
                            </div>
                            {
                                <div className="text-center mt-3"> 
                                    {
                                        props.error ? errorMessage : null
                                    }
                                    {
                                        props.successfull ? successMessage : null
                                    }
                                </div>
                            }
                            
                        </div>
                    </div>
            </div>
    )
}

