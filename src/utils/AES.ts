import CryptoJS from 'crypto-js';

// 定义密钥和IV（初始化向量）
const key = CryptoJS.enc.Utf8.parse("1234567890123456");

// 加密函数
export function encryptAES(message) {
    // 使用AES加密
    const encrypted = CryptoJS.AES.encrypt(message, key, {
        mode: CryptoJS.mode.ECB, // 使用ECB模式进行解密
        padding: CryptoJS.pad.Pkcs7 // 使用Pkcs7填充
    });

    // 返回加密后的密文
    return encrypted.toString();
}

// 解密函数
export function decryptAES(ciphertext) {
    // 解密时需要相同的密钥和IV
    const decrypted = CryptoJS.AES.decrypt(ciphertext.toString(), key, {
        mode: CryptoJS.mode.ECB, // 使用ECB模式进行解密
        padding: CryptoJS.pad.Pkcs7 // 使用Pkcs7填充
    });

    // 将解密后的数据转换成Utf8字符串
    return decrypted.toString(CryptoJS.enc.Utf8);
}
