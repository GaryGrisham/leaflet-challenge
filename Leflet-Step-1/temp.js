function funFunction(func, value){
    return func(value)
}

function plusTwo(num) {
    return num + 2
}

var temp = funFunction(plusTwo, 10);
console.log(temp);