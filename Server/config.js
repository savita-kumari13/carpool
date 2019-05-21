module.exports = {
    port: 5570,
    DB: 'mongodb://localhost:27017/PoolCarDb',
    app_host: 'http://192.168.137.1:5570',
    // app_host: 'http://192.168.43.100:5570',
    secretKey : 'yfbrbW%^%W^47665fhgfTZHDZRSDHF',
    uploadFolder: './upload/profile_photo',
    profile: 'user_default_profile_photo.jpg',
    gmail: {
        email: 'saa1310vi@gmail.com',
        password: 'myaccount@',
    },
    smoking: {
        DONT_KNOW: "Don't know",
        NO_SMOKING: "No smoking in the car please",
        YES_SMOKING: "Smoking is OK"
    },
    pets: {
        DONT_KNOW: "Don't know",
        NO_PETS: "No pets",
        PETS_WELCOME: "Pets welcome. Woof!"
    },
    chattiness: {
        DONT_KNOW: "I talk depending on my mood",
        QUIT_TYPE: "I'm the quiet type",
        LOVE_TO_CHAT: "I love to chat"
    },
    music: {
        DONT_KNOW: "Don't know",
        SILENCE: "Silence is golden",
        ALL_ABOUT_PLAYLIST: "It's all about the playlist"
    },
    status: {
        PENDING: "Pending",
        ON_GOING: "On going",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled"
    }
}