// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import routes from './config/routes.js';
import store from './config/store.js';
import VueRouter from 'vue-router';
import vueResource from 'vue-resource';
import VueI18n from 'vue-i18n';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import util from './assets/js/util.js';
import 'swiper/dist/css/swiper.css';
import './assets/icons/iconfont.css';
import App from './App.vue';
import Api from './config/api';
import $ from '@js/jquery.min.js';
var moment = require('moment');
var momentTimezone = require('moment-timezone');

import ViewUI from 'view-design';
import enUS from 'view-design/dist/locale/en-US';
import zhCN from 'view-design/dist/locale/zh-CN';
import zhTW from 'view-design/dist/locale/zh-TW';
import jaJP from 'view-design/dist/locale/ja-JP';
import koKR from 'view-design/dist/locale/ko-KR';
import deDE from 'view-design/dist/locale/de-DE';
import frFR from 'view-design/dist/locale/fr-FR';
import itIT from 'view-design/dist/locale/it-IT';
import esES from 'view-design/dist/locale/es-ES';
import ruRU from 'view-design/dist/locale/ru-RU';
import hiIN from 'view-design/dist/locale/hi-IN';

import  en from './assets/lang/en.js';
import  cn from './assets/lang/cn.js';
import  hk from './assets/lang/hk.js';
import  jp from './assets/lang/jp.js';
import  ko from './assets/lang/ko.js';
import  de from './assets/lang/de.js';
import  fr from './assets/lang/fr.js';
import  it from './assets/lang/it.js';
import  es from './assets/lang/es.js';
import  ru from './assets/lang/ru.js';
import  hi from './assets/lang/hi.js';

import { Swipe, SwipeItem } from 'vant'
import 'vant/lib/swipe/style'
import 'vant/lib/swipe-item/style'
Vue.use(iView).use(Swipe).use(SwipeItem)
Vue.use(VueClipboard);
Vue.use(VueRouter);
Vue.use(vueResource);
Vue.use(VueI18n);

const i18n = new VueI18n({
	locale: 'en_US',
	messages: {
		'zh_CN': Object.assign( zhCN, cn),
		'en_US': Object.assign( enUS, en),
		'zh_HK': Object.assign( zhTW, hk),
		'ja_JP': Object.assign( jaJP, jp),
		'ko_KR': Object.assign( koKR, ko),
		'de_DE': Object.assign( deDE, de),
		'fr_FR': Object.assign( frFR, fr),
		'it_IT': Object.assign( itIT, it),
		'es_ES': Object.assign( esES, es),
		'ru_RU': Object.assign( ruRU, ru),
		'hi_IN': Object.assign( hiIN, hi),
	},
	silentTranslationWarn: true
});

Vue.use(ViewUI, { i18n: (key, value) => i18n.t(key, value) });

// Vue.prototype.rootHost = "https://www.bizzan.pro"; //BIZZAN
// Vue.prototype.host = "https://api.bizzan.pro"; //BIZZAN

Vue.prototype.rootHost = "http://1.94.53.61:19544"; //BIZZAN
Vue.prototype.host = "http://1.94.53.61:19544"; //BIZZAN

Vue.prototype.api = Api;
Vue.http.options.credentials = true;
Vue.http.options.emulateJSON = true;
Vue.http.options.headers = {
    'Content-Type': 'application/x-www-form-urlencoded;application/json;charset=UTF-8',
    //'Content-Type': 'application/json;charset=utf-8'
};

const router = new VueRouter({
    mode: 'hash',
    routes
});

iView.LoadingBar.config({
    color: '#F90',
    failedColor: '#f0ad4e',
    height: 2
});

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach((to,from,next) => {
    window.scrollTo(0,0);
    iView.LoadingBar.finish();
});



Vue.http.interceptors.push((request, next) => {
    //登录成功后将后台返回的TOKEN在本地存下来,每次请求从sessionStorage中拿到存储的TOKEN值
    request.headers.set('x-auth-token', localStorage.getItem('TOKEN'));
	let lang = localStorage.getItem('LANGUAGE');
	if(lang!=null){
        lang = lang.substr(1);
        lang = lang.substr(0,lang.length-1);
    }
	request.headers.set('lang', lang);

    next((response) => {
        //登录极验证时需获取后台返回的TOKEN值
        var xAuthToken = response.headers.get('x-auth-token');
        if (xAuthToken != null && xAuthToken != '') {
            localStorage.setItem('TOKEN', xAuthToken);
        }

        if (response.data.code == '4000' || response.data.code == '3000') {
            store.commit('setMember', null);
            router.push('/login');
            return false;
        }
        return response;
    });
});

Vue.config.productionTip = false;

Vue.filter('timeFormat', function(tick) {
    return moment(tick).format("HH:mm:ss");
});

Vue.filter('dateFormat', function(tick) {
    return moment(tick).format("YYYY-MM-DD HH:mm:ss");
});

Vue.filter('toFixed', function(number, scale) {
    return new Number(number).toFixed(scale);
});

Vue.filter('toPercent', function(point) {
    var str = Number(point * 100).toFixed(1);
    str += "%";
    return str;
});

function toFloor(number, scale = 8) {
    if (new Number(number) == 0) {
        return 0;
    }
    var __str = number + "";
    if (__str.indexOf('e') > -1 || __str.indexOf('E') > -1) {
        var __num = new Number(number).toFixed(scale + 1),
            __str = __num + "";
        return __str.substring(0, __str.length - 1);
    } else if (__str.indexOf(".") > -1) {
        if (scale == 0) {
            return __str.substring(0, __str.indexOf("."));
        }
        return __str.substring(0, __str.indexOf(".") + scale + 1);
    } else {
        return __str;
    }
}
Vue.filter('toFloor', (number, scale) => {
    return toFloor(number, scale);
});
Vue.prototype.toFloor = toFloor;

Vue.prototype.getTimezone4K = function(){
		var curlang = this.$store.getters.lang;
		if(curlang=="en_US"){
			return "America/Los_Angeles";
		}
		if(curlang=="ja_JP"){
			return "Asia/Tokyo";
		}
		if(curlang=="ko_KR"){
			return "Asia/Seoul";
		}
		if(curlang=="de_DE"){
			return "Europe/Berlin";
		}
		if(curlang=="fr_FR"){
			return "Europe/Paris";
		}
		if(curlang=="it_IT"){
			return "Europe/Rome";
		}
		if(curlang=="es_ES"){
			return "Europe/Madrid";
		}
		if(curlang=="zh_HK"){
			return "Asia/Hong_Kong";
		}
		if(curlang=="zh_CN"){
			return "Asia/Shanghai";
		}
		if(curlang=="hi_IN"){
			return "Asia/India";
		}
		if(curlang=="ru_RU"){
			return "Europe/Russia";
		}
		return curlang;
};
Vue.prototype.getLang4K = function(){
		var curlang = this.$store.getters.lang;
		if(curlang=="en_US"){
			return "en";
		}
		if(curlang=="ja_JP"){
			return "ja";
		}
		if(curlang=="ko_KR"){
			return "ko";
		}
		if(curlang=="de_DE"){
			return "de_DE";
		}
		if(curlang=="fr_FR"){
			return "fr";
		}
		if(curlang=="it_IT"){
			return "it";
		}
		if(curlang=="es_ES"){
			return "es";
		}
		if(curlang=="zh_HK"){
			return "zh_TW";
		}
		if(curlang=="zh_CN"){
			return "zh";
		}
		if(curlang=="hi_IN"){
			return "hi";
		}
		if(curlang=="ru_RU"){
			return "ru";
		}
		return curlang;
};
Vue.prototype.timeFormat=function(tick) {
      return momentTimezone(tick).tz(this.getTimezone4K()).format("HH:mm:ss");
    };
Vue.prototype.dateFormat=function(tick) {
      return momentTimezone(tick).tz(this.getTimezone4K()).format("YYYY-MM-DD HH:mm:ss");
    };
Vue.prototype.dateFormatHM=function(tick) {
      return momentTimezone(tick).tz(this.getTimezone4K()).format("YYYY-MM-DD HH:mm");
    };
Vue.prototype.dateFormatFromString=function(tick){
	var timestamp = momentTimezone(tick).tz('Asia/Shanghai').valueOf();
	return momentTimezone(timestamp).tz(this.getTimezone4K()).format("YYYY-MM-DD HH:mm:ss");
};
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    template: '<App/>',
    components: { App }
});
