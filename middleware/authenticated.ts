export default function ({ store, redirect, route }: any) {
  if (store.state.user.address === "" && route.path !== "/signin") {
    return redirect("/signin");
  }
}
