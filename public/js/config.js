//config.js

requirejs.config({
    config: {
        'courses': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            getCoursesAPI: "/api/getCourses",
        },
        'createAccount':{
            baseURL: "http://localhost:14567",
            createAccountAPI: "/api/createUser"
        },

        'login': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            loginAPI: "/api/login"
        },
        
        'logout': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            logoutAPI: "/api/logout"
        }
    },
    baseUrl: '/js',
    paths: {
        courses: 'courses.js',
        createAccount: 'createAccount.js',
        login: 'login.js',
        logout: 'logout.js',
        domReady: "//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady"
    }
})