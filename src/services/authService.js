import CryptoJS from 'crypto-js';

class AuthService {
  static secretKey = "$#@$1@1#4%"; // Use a strong secret key

  // Generate a hash of the original data
  static generateHash(data) {
    return CryptoJS.SHA256(data).toString();
  }

  // Encrypt and store user information and API key in localStorage
  static setUserInfo(user, apiKey) {
    const userInfo = {
      user,
      apiKey,
    };

    // Convert userInfo object to a string
    const userInfoString = JSON.stringify(userInfo);

    // Encrypt the userInfo string
    const encryptedData = CryptoJS.AES.encrypt(
      userInfoString,
      this.secretKey
    ).toString();

    // Generate a hash for integrity verification
    const dataHash = this.generateHash(userInfoString);

    // Store both encrypted data and the hash in localStorage
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        encryptedData,
        dataHash,
      })
    );
  }

  static updateUserInfo(newUserData) {
    const storedData = localStorage.getItem("userInfo");
    if (!storedData) return null;

    try {
      const { encryptedData, dataHash } = JSON.parse(storedData);

      // Decrypt the stored data
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      // Verify the integrity of the data
      const verifyHash = this.generateHash(decryptedData);
      if (verifyHash !== dataHash) {
        throw new Error("Data integrity check failed!");
      }

      // Parse the decrypted data
      const parsedData = JSON.parse(decryptedData);

      // Update the user data
      parsedData.user = { ...parsedData.user, ...newUserData };

      // Convert updated data back to a string
      const updatedDataString = JSON.stringify(parsedData);

      // Encrypt the updated data
      const updatedEncryptedData = CryptoJS.AES.encrypt(
        updatedDataString,
        this.secretKey
      ).toString();

      // Generate a new hash for integrity verification
      const updatedDataHash = this.generateHash(updatedDataString);

      // Store the updated encrypted data and hash in localStorage
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          encryptedData: updatedEncryptedData,
          dataHash: updatedDataHash,
        })
      );

      return true; // Successfully updated
    } catch (error) {
      console.error("Error updating user info:", error);
      return false;
    }
  }

  // Decrypt and retrieve user information from localStorage
  static getUserInfo() {
    const storedData = localStorage.getItem("userInfo");
    if (!storedData) return null;

    try {
      // Parse the stored data
      const { encryptedData, dataHash } = JSON.parse(storedData);

      // Decrypt the data
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      // Verify the integrity of the data
      const verifyHash = this.generateHash(decryptedData);
      if (verifyHash !== dataHash) {
        throw new Error("Data integrity check failed!");
      }

      // Return the parsed user data
      return JSON.parse(decryptedData).user || null;
    } catch (error) {
      console.error("Decryption or integrity check error:", error);
      return null;
    }
  }

  // Retrieve the user's role
  static getUserRole() {
    const user = this.getUserInfo();
    if (!user) return null;

    // Check if the user is an admin and has a nested staff type
    if (user.staff && user.staff.type) {
      return user.staff.type;
    }

    // If not an admin, return the type directly for staff
    return user.type || null;
  }

  // Decrypt and get the API key from localStorage
  static getApiKey() {
    const storedData = localStorage.getItem("userInfo");
    if (!storedData) return null;

    try {
      const { encryptedData, dataHash } = JSON.parse(storedData);
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      // Verify the integrity of the data
      const verifyHash = this.generateHash(decryptedData);
      if (verifyHash !== dataHash) {
        throw new Error("Data integrity check failed!");
      }

      // Return the parsed API key
      return JSON.parse(decryptedData).apiKey || null;
    } catch (error) {
      console.error("Decryption or integrity check error:", error);
      return null;
    }
  }

  // Check if the user is authenticated
  static isLoggedIn() {
    return !!this.getUserInfo();
  }

  // Clear user information and API key from localStorage
  static clearAuth() {
    localStorage.removeItem("userInfo");
  }
}

export default AuthService;
