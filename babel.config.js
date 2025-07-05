module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "blacklist": null,
      "whitelist": [
        "CLOUDINARY_CLOUD_NAME", 
        "CLOUDINARY_UPLOAD_PRESET",
        "BASE_URL"
      ],
      "safe": true,
      "allowUndefined": false
    }]
  ]
};
