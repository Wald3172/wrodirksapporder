function passHash(input, secret) {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      output += String.fromCharCode(input.charCodeAt(i) ^ secret.charCodeAt(i % secret.length));
    }
    return output;
  }

module.exports = passHash;
  
  // const originalText = 'originadadaal';
  // const secretKey = 'secret49q4dq941a91c';
  // const encryptedText = encryptDecrypt(originalText, secretKey);
  // const decryptedText = encryptDecrypt(encryptedText, secretKey);
  
  // console.log(encryptedText); 
  // console.log(decryptedText); 