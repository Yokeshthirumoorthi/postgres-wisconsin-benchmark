/**
 * Project Constants
 */
const TUP_COUNT = 50; // Number of tuples in result relation


/**
 * HELPER FUNCTIONS / UTIL FUNCTIONS 
 */

// Given an array, randomly shuffle the position of elements of the array 
// Ref : https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
    return array;
}
 
//generate a range of integers  
const range = (tupCount) => [...Array(tupCount).keys()];
//simple mod function for integers
const mod = (range, divisor) => [...range].map(x => x % divisor);
//Produces an array of 'x' chars
const getxChars = (length) => [...Array(length)].map(x => 'x');
//Generates the significant string
const generateUniqueString = (_) => {
    const SIGNIFICANT_CHARS_LENGTH = 7;
    const X_CHARS_LENGTH = 45;
    const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const xChars = getxChars(X_CHARS_LENGTH);
    return [...Array(SIGNIFICANT_CHARS_LENGTH)].map(i=>chars[Math.random()*chars.length|0]).concat(xChars).join``;
};
//mod function for string
const cyclicStrings = (range, divisor, strings) => {
    const X_CHARS_LENGTH = 48;
    const xChars = getxChars(X_CHARS_LENGTH);
    return range.map(i => strings[i % divisor].concat(xChars.join``));
}; 


/**
 * GENERATE DATA
 */

// candidate key, unique, random order
const unique1 = shuffle(range(TUP_COUNT));
// primary key, unique, sequential
const unique2 = range(TUP_COUNT);
// (unique1 mod 2), random order
const two = mod(unique1, 2);
// (unique1 mod 4), random order
const four = mod(unique1, 4);
// (unique1 mod 10), random order
const ten = mod(unique1, 10);
// (unique1 mod 20), random order
const twenty = mod(unique1, 20);
// (unique1 mod 100), random order
const onePercent = mod(unique1, 100);
// (unique1 mod 10), random order
const tenPercent = mod(unique1, 10);
// (unique1 mod 5), random order
const twentyPercent = mod(unique1, 5);
// (unique1 mod 2), random order
const fiftyPercent = mod(unique1, 2);
const unique3 = shuffle(range(TUP_COUNT));
// (onePercent * 2)
const evenOnePercent = onePercent.map(x => x * 2);
// (onePercent * 2)+1
const oddOnePercent = onePercent.map(x => (x * 2) + 1);
// candidate key
const stringu1 = unique2.map(generateUniqueString);
// candidate key
const stringu2 = [...stringu1].sort();
const string4 = cyclicStrings(unique2, 4, ["AAAA", "HHHH", "OOOO", "VVVV"]);

// colection of all tuples
const dataset = {
    unique1, 
    unique2,
    two,
    four,
    ten,
    twenty,
    onePercent,
    tenPercent,
    twentyPercent,
    fiftyPercent,
    unique3,
    evenOnePercent,
    oddOnePercent,
    stringu1, 
    stringu2, 
    string4
};

module.exports = {dataset}