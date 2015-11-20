import React from "react";
import ReactDom from "react-dom";
import T3Game from "./T3Game";

ReactDom.render(<T3Game/>, document.getElementById("container"));

//var ar = [
//  [0,1,0],
//  [0,0,0],
//  [0,1,0]
//];
//
//var arrr =  [0,1,0];
//function fn(arr) {
//let hasVal = false;
//
//    arr.forEach((ar) => {
//      hasVal = ar.some((el) => el === 1)
//    });
//  return hasVal;
//}
//
//console.log(fn(ar));
