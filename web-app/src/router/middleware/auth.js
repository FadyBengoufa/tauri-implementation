export default async function auth({next, isAuthenticated}) {
  if(isAuthenticated) next();
  else {
    next({name: 'login'})
  }
}

export async function guest({next, isAuthenticated}) {
  if(isAuthenticated) {
    next({name: 'home'});
  }
  else next();
}
