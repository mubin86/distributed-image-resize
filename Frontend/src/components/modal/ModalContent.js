
import React from 'react';

export default function ModalContent(props) {
    return (
            <div className="row justify-content-center">
                    <div className="card">
                        <h2 style={{ color: 'green' }} className="weight600 mt-3- mb-4 text-center color-red">Select one option from the following</h2>
                            <ul className="list-group">
                                {props.imageResizeData.map(item => {
                                    return(                       
                                        <li className="d-flex justify-content-around list-group-item weight300" key={item.width} onClick={() => props.imageResizeHandler(item.id)}>
                                            <div>
                                                Height({item.width})
                                            </div> 
                                            <div>
                                                Width({item.height})
                                            </div>
                                        </li>) 
                                })}
                            </ul>
                    </div>
                </div>
    )
}
