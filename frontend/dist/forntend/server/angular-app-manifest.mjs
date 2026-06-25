
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/dashboard",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/register"
  },
  {
    "renderMode": 2,
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/recursos"
  },
  {
    "renderMode": 2,
    "route": "/reservas"
  },
  {
    "renderMode": 2,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 24601, hash: 'febd0672c56d82158865ca7b2e928bc29fcaabf8742db8ab934c4ac2448823b7', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17054, hash: '2d6fd0eef094df01e4083fb74ffd373e70f86b751f19affcf4362c37e742c251', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'recursos/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/recursos_index_html.mjs').then(m => m.default)},
    'reservas/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/reservas_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 28155, hash: '857d43df28a4bd1267614935ebf6a77ec07cd9ecaec25ae815ad5e970a714dbb', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 28403, hash: 'a8922eb6811aeeb109a340e6478501fe7280749b9ea6657fdffc15a3ae7f9d2e', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'styles-OYFW422M.css': {size: 8100, hash: 'Qv7leKZnN3g', text: () => import('./assets-chunks/styles-OYFW422M_css.mjs').then(m => m.default)}
  },
};
