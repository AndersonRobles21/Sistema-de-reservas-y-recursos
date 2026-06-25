
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
    'index.csr.html': {size: 8497, hash: '8daf1cc27a745d5648ad80a16ffa43bae33dd17261cb2c8ce28c6d0dd443e817', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 950, hash: '2f737a8ce5ee020a981de9fa90cf543136d8465c8b5a0af450376731b5fa7682', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'recursos/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/recursos_index_html.mjs').then(m => m.default)},
    'reservas/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/reservas_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 15673, hash: 'a0a8ce2bf33616b7d2e216be36027edc83c36922f5fbbc7426f54d817dcf8938', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 15813, hash: '627997f2bcc9ab8c498294ac8793182f1df860d67f955f7429237a410d911b26', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'styles-OYFW422M.css': {size: 8100, hash: 'Qv7leKZnN3g', text: () => import('./assets-chunks/styles-OYFW422M_css.mjs').then(m => m.default)}
  },
};
