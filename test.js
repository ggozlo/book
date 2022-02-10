// let prob = 'local'
// exports.prob = 'exports'
// global.prob = 'global'
// let obj = {
//     prob : 'object',
//     func : func
// }

// function func() {
//      console.log(this.prob)
// }

// console.log(prob)       // local
// console.log(this.prob)  // exports
// func()                  // global
// obj.func()              // object


const qqq= new Promise((resolve) => {
    setTimeout(()=> {resolve(100)}, 
    1000);
})
.then((num)=> {
    console.log(num);
});

console.log(qqq);



