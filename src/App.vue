<template>
    <v-app :style="cssProps" :lang="getSelectedLang">
        <v-content v-if="isAppDataLoaded">
                <router-view id="cont"/>
        </v-content>
    </v-app>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
        name: 'App',

        // @TODO We may not need this watch and sslsubjectdnHeader anymore. Didn't delete it yet because it requires more testing to make sure nothing will be broken.
        watch: {
            sslsubjectdnHeader: function (newList, oldList) {
            // we have to wait until the request /applicationData has finished. This is called on start up by the Translation Plugin .
            // Once the sslsubjectdnHeader is set, we know that the call has returned, and the user has a certificate and is logged in.
            // we can send him to the next page
              /*       console.log("in app.vue. this.$route",this.$route);

                     if (typeof this.$route.query.assessment !== "undefined") {
                            this.$router.push('/summary?assessment='+ this.$route.query.assessment);
                    }else if (window.location.search.length > 0 && window.location.search.indexOf("?token=") !== -1) {
                            let tokenUrlParam = window.location.search;
                            window.location.replace(window.location.origin + window.location.pathname + "#/summary" + tokenUrlParam);
                    }else if(this.$route.path === '/auto-login/'){
                        // not used yet, the auto-login still has it's own login mechanism
                         //this.$router.push('/auto-login');
                    }else if(this.$route.name === 'LoginPage'){
                         this.$router.push('/home');
                    } else {
                       // The ue has probably hit 'f5' and the page has reloaded. We leave the user on the page where he is
                    }*/
            }

        },

        computed: {
            ...mapGetters({
                sslsubjectdnHeader: 'TranslationStore/getSslsubjectdnHeader',
                isAppDataLoaded: 'TranslationStore/getIsAppDataLoaded',
                getAppPropertyValue: 'TranslationStore/getAppPropertyValue',
                getSelectedLang: 'TranslationStore/getSelectedLang'
            }),

            /* add custom color from server*/
            cssProps() {

                // if (this.isAppDataLoaded) {

                this.$vuetify.theme.primary = this.getAppPropertyValue('GUI_THEME_COLOR');

                let cssPropsObj = {};
                cssPropsObj['--primary-color'] = this.getAppPropertyValue('GUI_THEME_COLOR');

                if (this.getAppPropertyValue('GUI_THEME_FONT')) {
                    cssPropsObj['font-family'] = this.getAppPropertyValue('GUI_THEME_FONT');
                }

                return cssPropsObj;

                // }
            }
        },

        created() {
            if ('-ms-scroll-limit' in document.documentElement.style
                && '-ms-ime-align' in document.documentElement.style) { // detect it's IE11
                window.addEventListener("hashchange", (event) => {
                    let currentPath = window.location.hash.slice(1);
                    if (this.$route.path !== currentPath) {
                        this.$router.push(currentPath);
                    }
                }, false);
            }
        }
    }

</script>

<style lang="scss">

</style>
