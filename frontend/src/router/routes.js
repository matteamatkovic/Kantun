import MainLayout from '../layouts/MainLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [
  // javni dio aplikacije - naslovna, popis/detalji događanja, kalendar,
  // prijava/registracija, plus favoriti i moje rezervacije koji traže prijavu
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'pocetna',
        component: () => import('../pages/IndexPage.vue')
      },
      {
        path: 'dogadanja',
        name: 'dogadanja',
        component: () => import('../pages/EventsPage.vue')
      },
      {
        path: 'dogadanja/:idOrSlug',
        name: 'event-detalji',
        component: () => import('../pages/EventDetailsPage.vue')
      },
      {
        path: 'kalendar',
        name: 'kalendar',
        component: () => import('../pages/CalendarPage.vue')
      },
      {
        path: 'favoriti',
        name: 'favoriti',
        component: () => import('../pages/FavoritesPage.vue'),
        meta: { zahtijevaPrijavu: true }
      },
      {
        path: 'moje-rezervacije',
        name: 'moje-rezervacije',
        component: () => import('../pages/MyReservationsPage.vue'),
        meta: { zahtijevaPrijavu: true }
      },
      {
        path: 'prijava',
        name: 'prijava',
        component: () => import('../pages/LoginPage.vue')
      },
      {
        path: 'registracija',
        name: 'registracija',
        component: () => import('../pages/RegisterPage.vue')
      }
    ]
  },

  // admin dio - meta na roditelju vrijedi za sva djeca pa ne treba
  // ponavljati zahtijevaPrijavu/zahtijevaAdmina na svakoj ruti posebno
  {
    path: '/admin',
    component: AdminLayout,
    meta: { zahtijevaPrijavu: true, zahtijevaAdmina: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../pages/admin/AdminDashboardPage.vue')
      },
      {
        path: 'dogadanja',
        name: 'admin-dogadanja',
        component: () => import('../pages/admin/AdminEventsPage.vue')
      },
      {
        path: 'kategorije',
        name: 'admin-kategorije',
        component: () => import('../pages/admin/AdminCategoriesPage.vue')
      },
      {
        path: 'rezervacije',
        name: 'admin-rezervacije',
        component: () => import('../pages/admin/AdminReservationsPage.vue')
      }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
]

export default routes
