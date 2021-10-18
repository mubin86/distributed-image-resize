const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

if(isMainThread){
    const worker = new Worker("./worker_threads/threadController.js");

    //send data from main thread to the worker thread
    let largeTextOrImage = `{
        "name": "mubin",
        "peple": "yoo"
    }`;
    worker.postMessage(largeTextOrImage);

    worker.on('message', (data)=>{
        console.log("data from child is ", data);
    })


    worker.on('error', (error)=>{
        console.log("got error"); 
        //if we dont handle the error then it wiill automaticLLY  go to the exit listener
    })


    // worker.on('exit', (exit)=>{
    //     console.log("got exit")
    // })

}else{
    console.log("we are not on main thread")
}