
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import VeeValidate from 'vee-validate';
import App from './App';
//import AppV2 from './AppV2';
import store from './common/store';
import router from './common/router/router';

import Vue2TouchEvents from 'vue2-touch-events';

import UtilitiesPlugin from './common/plugins/UtilitiesPlugin';
import TranslationPlugin from './common/plugins/TranslationPlugin';
import AjaxHelperPlugin from './common/plugins/AjaxHelperPlugin';
import PfChatbotPlugin from "./common/plugins/pathfinder/PfChatbotPlugin";
import PfChatbotChooseMainSymptomPlugin from "./common/plugins/pathfinder/PfChatbotChooseMainSymptomPlugin";
import SvgPlugin from "./common/plugins/svg/SvgPlugin"

/* load global app style */
require('./assets/styles/scss/global.scss');

Vue.config.productionTip = false;

Vue.use(Vuetify, {
    theme: {
        //   primary: '#A43A45',
        // secondary: colors.red.lighten4, // #FFCDD2
        // accent: colors.indigo.base // #3F51B5
    }
});
Vue.use(VeeValidate);
Vue.use(Vue2TouchEvents);

Vue.use(UtilitiesPlugin, {router, store});
Vue.use(TranslationPlugin, {router, store});
Vue.use(AjaxHelperPlugin, {router, store});
Vue.use(PfChatbotPlugin, {router, store});
Vue.use(PfChatbotChooseMainSymptomPlugin, {router, store});
Vue.use(SvgPlugin, {router, store});

// ----- Create Vue instance -----

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router: router,
    store: store,
    components: { App },
    template: '<App/>'
    // components: { AppV2 },
    // template: '<AppV2/>'
});



router.beforeEach((to, from, next) => {


    // console.log("TO:", to, " | FROM:", from);


    if (from.name === 'PF_GeneralQuestionsPage' && to.name ==='PF_StartQuestionsPage') {
        router.app.$store.commit("PfAssessmentStartStore/setBackFromGeneral", true);
    } else {
        router.app.$store.commit("PfAssessmentStartStore/setBackFromGeneral", false);
    }

    if (from.name === 'PF_ChatbotAssessmentSharePage' && to.name ==='PF_ChatBotEvaluationPage') {

        let setRouteCookie = (name,value, days) => {
            let expires = "";
            let date = new Date();
            if (days) {
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "")  + expires +"; path=/";
        }

        setRouteCookie('showAssessmentAlert', "no", 366);
    } else {

    }

    // let setCookie = (name, value, days) => {
    //     let expires;
    //     let date = new Date();
    //
    //     if (days !== null) {
    //         if (typeof days === "undefined") {
    //             days = 1;
    //         }
    //
    //         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    //         expires = "; expires=" + date.toUTCString();
    //     }
    //     else {
    //         expires = "";
    //     }
    //
    //     document.cookie = name + "=" + (value || "")   + expires + "; path=/";
    // };
    //
    // let getCookie = function (name) {
    //     let value = "; " + document.cookie;
    //     let parts = value.split("; " + name + "=");
    //     if (parts.length === 2) {
    //         return parts.pop().split(";").shift();
    //     }
    //     else {
    //         return null;
    //     }
    // };

    if (to.name === "HomePage") {
        // Handle HOME button destination
        let sessionStorageHomeRouteName = sessionStorage.getItem("smass-home-route");
        if (sessionStorageHomeRouteName !== null) {
            next({
                name: sessionStorageHomeRouteName
            });

            if (sessionStorageHomeRouteName === "PF_ChatBotPage") {

                // @TODO | TEMPORARY workaround that makes Home button to work while developing "page refresh" and "edit answers" features.
                sessionStorage.removeItem("crtChatbotSection");
                // @TODO | End TEMPORARY workaround.

                window.location.reload();
            }

            return;
        }
    }

    if (router.app.$store.getters["UserStore/getCurrentAppType"] === router.app.$store.getters["UserStore/getAppTypes"].PF_CHATBOT_STUDY) {

        if (to.name !== "PF_ChatBotPage" && to.name !== "BlankPage") {
            if (router.app.$store.getters["UserStore/getIsUserLoggedIn"] === true) {
                next({
                    name: 'PF_ChatBotPage'
                });
            }
            else {
                next({
                    name: 'BlankPage'
                });
            }
        }
        else {
            next();
        }
    }
    else if (router.app.$store.getters["UserStore/getCurrentAppType"] === router.app.$store.getters["UserStore/getAppTypes"].PF_CHATBOT) {
        if ( router.app.$store.getters["UserStore/getIsUserLoggedIn"] && to.path === '/' ) {
            next({
                name: 'PF_ChatBotPage'
            });
        }
        else {
            next();
        }
    }

    else if(router.app.$store.getters["UserStore/getCurrentAppType"] === router.app.$store.getters["UserStore/getAppTypes"].PF_CHATBOT_PUBLIC) {

        let chatbotRoutesForAuthUsers = [
            "PF_ChatBotPage",
            "PF_AssessmentPage",
            "BlankPage",
            "PF_ChatBotEvaluationPage",
            "PF_ChatbotAssessmentSharePage",
            "RegulatoryPage"
        ];

        if (!chatbotRoutesForAuthUsers.includes(to.name)) {

            if (router.app.$store.getters["UserStore/getIsUserLoggedIn"] === true) {
                // @TODO | This block of code MUST be refactorized. Each "if" statement should have one "next()" only.
                // @TODO | These multiple next()'s cause some unwanted multiple redirects.
                next({
                    name: 'RegulatoryPage'
                });
                next({
                    name: 'PF_ChatBotEvaluationPage',
                });
                next({
                    name: 'PF_ChatBotPage',
                })
            }
            else {
                console.log('User Not Logged In ...');
                /*next({
                    name: 'BlankPage'
                });*/
                window.location.replace(window.location.origin + window.location.pathname);
            }
        }
        else {
            next();
        }
    }
    else {
        if ( router.app.$store.getters["UserStore/getUsername"] !== '' && to.path === '/' ) {

            // if (typeof to.query.msitat !== "undefined") {
            //
            //     let nextUrl = '/assessment-list?msitat=' + to.query.msitat;
            //     if (typeof to.query.assessment !== "undefined") {
            //         nextUrl += '&assessment=' + to.query.assessment;
            //         if (typeof to.query.version !== "undefined") {
            //             nextUrl += '&version='+ to.query.version;
            //         }
            //     }
            //     next({
            //         path: nextUrl
            //     });
            // }
            // else if (typeof to.query.assessment !== "undefined") {
            if (typeof to.query.assessment !== "undefined") {

                if (typeof to.query.version !== "undefined") {
                    next({
                        path: '/summary?assessment='+ to.query.assessment+ '&version='+ to.query.version
                    });
                }
                else {
                    next({
                        path: '/summary?assessment='+ to.query.assessment
                    });
                }
            }
            else {
                next({
                    path: '/home'
                });
            }
        } else {
            next();
        }
    }


});
