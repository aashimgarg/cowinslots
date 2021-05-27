let word_With_Numbers = "@rainaArteev 180013";
let word_Without_Numbers = word_With_Numbers.replace(/\D/g, "");

console.log(typeof word_Without_Numbers);

let regex = new RegExp("^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$");
let isValid = regex.test(word_Without_Numbers);
console.log(isValid);
