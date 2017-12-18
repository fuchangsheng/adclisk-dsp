function Number2Locale(val,point){
    // let string =  Number(val).toLocaleString();
    // let index = string.indexOf('.');
    // if(index == -1 || point==undefined){
    //     return string;
    // }
    // try {
    //     point = Number(point);
    // }catch (err){
    //     return string;
    // }
    // let end = 0;
    // if(point ==0 || point < 0){
    //     end = index;
    // }else{ 
    //     end = index + point  + 1;
    // }
    // string = string.substr(0,end);
    // return string;
    let str1 = Number(val).toFixed(point);
    let str2 = Number(str1).toLocaleString();
    return str2;
}


export {Number2Locale}