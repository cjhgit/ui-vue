import Vue from 'vue'
import Router from 'vue-router'
//const About = resolve => require(['VIEW/about'], resolve);

//
import Error404 from '@/views/error404'
import Test from '@/views/tmp/Test' // 测试页面
import Demo from '@/views/tmp/Demo' // demo 页面
import Main from '@/views/home/base'

// 前台模块
import Home from '@/views/home/base'
import HomeIndex from '@/views/home/index'
import About from '@/views/home/About'
import Course from '@/views/home/Course'
import Totur from '@/views/home/Totur'
import Playground from '@/views/home/Playground'
import Order from '@/views/home/Order'
import Contact from '@/views/home/Contact'
import Login from '@/views/login'
// 前台文章模块
import ArticleList from '@/views/home/articleList'
import ArticleDetail from '@/views/home/articleDetail'

// 后台模块
import Admin from '@/views/admin/base'
import AdminIndex from '@/views/admin/index'
// 后台用户模块
import UserSetting from '@/views/user/userSetting'
import UserInfo from '@/views/user/userInfo'
// 后台文章模块
import AdminArticle from '@/views/admin/articleList'
import AdminArticleDetail from '@/views/admin/articleDetail'
import AdminArticleAdd from '@/views/admin/articleAdd'

import AdminCourse from '@/views/admin/courseList'

import AdminTotur from '@/views/admin/toturList'

import AdminOrder from '@/views/admin/orderList'

Vue.use(Router);

const User = {
    template: `
        <div>{{ $route.params.id }}
            <router-view></router-view>
        </div>
    `
};

const buttonPage = { template: '<div>按钮页面</div>' }
const UserHome = { template: '<div>Home</div>' }
const UserProfile = { template: '<div>Profile</div>' }
const UserPosts = { template: '<div>Posts</div>' }

const ComponentHome = { template: '<div>组件首页Home</div>' }

const Components = {
    template: `
        <div>{{ $route.params.id }}
            <router-view></router-view>
        </div>
    `
};

let routerMap = [
    {
        path: '/',
        component: Main,
        children: [
            {
                path: '',
                component: HomeIndex
            },
            {
                path: '/courses',
                component: Course
            },
            {
                path: '/courses/:id',
                component: Course,
                children: [
                   /* {
                        path: '',
                        component: Course
                    },*/
                    {
                        // 当 /user/:id/profile 匹配成功，
                        // UserProfile 会被渲染在 User 的 <router-view> 中
                        path: 'profile',
                        component: UserProfile
                    },
                    {
                        // 当 /user/:id/posts 匹配成功
                        // UserPosts 会被渲染在 User 的 <router-view> 中
                        path: 'posts',
                        component: UserPosts
                    }
                ]
            },
            {
                path: '/toturs',
                component: Totur
            },
            {
                path: '/playground',
                component: Playground
            },
            {
                path: '/Order',
                component: Order
            },
            {
                path: '/about',
                component: About
            },
            {
                path: '/contact',
                component: Contact
            },
            // 前台文章模块
            {
                path: '/articles',
                component: ArticleList,
            },
            {
                path: '/articles/:id',
                component: ArticleDetail
            },
            {
                path: '/404',
                component: Error404
            },

        ]
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/admin',
        component: Admin,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '',
                component: AdminIndex,
            },
            // 后台用户模块
            {
                path: 'info',
                component: UserInfo,
            },
            {
                path: 'setting',
                component: UserSetting,
            },
            // 后台文章模块
            {
                path: 'articles',
                component: AdminArticle,
            },
            {
                path: 'articles/add',
                component: AdminArticleAdd
            },
            {
                path: 'articles/:id',
                component: AdminArticleDetail
            },
            // 后台课程模块
            {
                path: 'courses',
                component: AdminCourse,
            },
            // 后台导师模块
            {
                path: 'toturs',
                component: AdminTotur,
            },
            // 后台预约模块
            {
                path: 'orders',
                component: AdminOrder,
            },

        ]
    },
    {
        path: '/admin/:branch',
        meta: {
            requiresAuth: true
        },
        component: Admin,
        children: [
            {
                path: '/',
                component: HomeIndex
            }
        ]
    },
    {
        path: '/components',
        component: Components,
    },
    {
        path: '/user/:id',
        component: User,
        children: [
            {
                path: '',
                component: UserHome
            },
            {
                // 当 /user/:id/profile 匹配成功，
                // UserProfile 会被渲染在 User 的 <router-view> 中
                path: 'profile',
                component: UserProfile
            },
            {
                // 当 /user/:id/posts 匹配成功
                // UserPosts 会被渲染在 User 的 <router-view> 中
                path: 'posts',
                component: UserPosts
            }
        ]
    },
    {
        path: '/demo',
        components: Demo
    },
    {
        path: '*',
        component: Error404
    }
];


if (process.env.NODE_ENV !== 'production') {
    const testRouter = [
        {
            path: '/test',
            component: Test
        },

    ]
    routerMap = routerMap.concat(testRouter)

    /*routerMap.push({
        path: '*',
        component: Error404
    })*/
}

if (process.env.NODE_ENV === 'production') {

}

let router = new Router({
    mode: 'history',
    hashbang: false,
    //history: true,
    routes: routerMap,
    linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {
    next();

    if (/login/.test(to.path)) {
        console.log(localStorage.token.length);
        console.log(localStorage.token)
        if (localStorage.token !== 'null') {
            router.push('/admin');
            console.log('跳转了')
        } else {
            console.log('继续')
            next();
        }
    } else if (to.matched.some(record => record.meta.requiresAuth)) {
        console.log('权限判断'+localStorage.token)
        window.redirect = encodeURIComponent(to.path)
        let redirect = encodeURIComponent(to.path)

        if (localStorage.token && localStorage.token !== 'null') {
            console.log('已获得权限')
            next();
        } else {
            router.push({ path: '/login', query: {redirect: redirect}});
        }
    } else{
        console.log('直接继续')
        next()
    }
});

export default router;
