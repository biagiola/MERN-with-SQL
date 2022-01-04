function polindromo(_arg) {
  let arg;

  if(typeof(_arg) === 'number') {
    console.log('arg is int')
    arg = _arg.toString()
  } else {
    arg = _arg
  }

  let longuitud = arg.length - 1
  
  for (let index = 0; index < arg.length; index++) {
    if(arg[index] === arg[longuitud]) {
      console.log('entro')
      longuitud--
    } else {
      return false
    }

    return true
  }
}

let result = polindromo('aniina');
//let result = polindromo(121);

console.log('result', result)