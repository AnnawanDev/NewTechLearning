//config.js

requirejs.config({
    config: {
        '/js/home.js': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            coursesURLString: "/courses",
            courseOverviewLandingpage: "/overview",
            getRecentlyAddedCoursesAPI: "/api/selectMostRecentAddedClasses"

        },
        '/js/courses.js': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            getCoursesAPI: "/api/getCourses",
            coursesURLString: "/courses",
            courseOverviewLandingpage: "/overview",
            getCategoriesAPI: "/api/getListOfAvailableCategories"
        },
        '/js/createAccount.js':{
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            createAccountAPI: "/api/createUser"
        },

        '/js/login.js': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            loginAPI: "/api/login"
        },

        '/js/logout.js': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            logoutAPI: "/api/logout"
        },

        'courseEnrollment': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            getStudentsEnrolledAPI: "/api/getStudentsInClasses/",
            getStudentsNotEnrolledAPI: "/api/getStudentsNotInClass/"
        }
    },
    baseUrl: '/js',
    paths: {
        domReady: "//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady",
        home: 'home.js',
        courses: 'courses.js',
        createAccount: 'createAccount.js',
        login: 'login.js',
        logout: 'logout.js'
    }
})

