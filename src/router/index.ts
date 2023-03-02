import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import GameView from '../views/GameView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'GameView',
    component: GameView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
