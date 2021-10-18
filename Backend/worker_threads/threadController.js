const {isMainThread, parentPort, workerData} = require('worker_threads');

if(!isMainThread){
    console.log("we are on a worker threAD");

    //receive data from main thread
    parentPort.on('message', (data)=> {
        const parsedJSON = JSON.parse(data);
        console.log("data from parent ", parsedJSON);

        //after proccessing data we can send back to the main thread
        parentPort.postMessage(parsedJSON); 
    }); 

    // //sending data to main thread
    // parentPort.postMessage('hello from child'); 

    //sending error
    // throw new Error('error occured');

    //termiantes the process
    // process.exit(1);
}