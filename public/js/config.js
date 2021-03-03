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

        '/js/courseEnrollment.js': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            getStudentsEnrolledAPI: "/api/getStudentsInClasses/",
            getStudentsNotEnrolledAPI: "/api/getStudentsNotInClass/"
        },

        '/js/categories.js':{
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            getCategoriesAPI: '/api/getListOfAllCategories/',
            addCategoryAPI: '/api/insertCategory/',
            deleteCategoryAPI: '/api/deleteCategory/',
            editCategoryAPI: '/api/updateCategory/'
        },

        '/js/languages.js':{
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            getLanguagesAPI: '/api/getListOfAllLanguages/',
            addLanguageAPI: '/api/insertLanguage/',
            deleteLanguageAPI: '/api/deleteLanguage/',
            editLanguageAPI: '/api/updateLanguage/'
        },

        '/js/adminCourses.js': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            getListOfAllCategoriesAPI: "/api/getListOfAllCategories/",
            getCategoryNameForCourseAPI: "/api/getCategoryNameForCourse/"

        },

        '/js/adminCourseModules.js': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            getModulesForCourseAPI: "/api/getModulesForCourse/",
            getModuleForCourseAndOrderAPI: "/api/getModuleHTMLForCourseAndOrder/",
            addCourseModuleAPI: "/api/addCourseModule/",
            deleteCourseModuleAPI: "/api/deleteCourseModule/"
        },

        '/js/adminUsers.js': {
            useLogging: true,
            baseURL: "http://localhost:14567",
            //baseURL:"http://flip3.engr.oregonstate.edu:14567",
            deleteUserAPI: "/api/deleteUser/",
            editUserAPI: "/api/editUser/",
            getUsersWithTypesAPI: "/api/getUsersWithTypesAPI",
            deleteUsersAPI: "/api/deleteUser/",
            getUserIDsAPI: "/api/getUserIds",
            getUsersWithTypesAPI: "/api/getUsersWithTypes",
            editUserAPI: "/api/editUser/"
        }
    },
    baseUrl: '/js',
    paths: {
        domReady: "//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady",
        home: 'home.js',
        courses: 'courses.js',
        createAccount: 'createAccount.js',
        login: 'login.js',
        logout: 'logout.js',
        courseEnrollment: 'courseEnrollment.js',
        adminCourses: 'adminCourses.js',
        adminUsers: 'adminUsers.js'
    }
})
