export default function ({ store, redirect, route }: any) {
  if (route.path !== "/signin") {
    localStorage.setItem("@previous_path", route.path);
  }
  if (store.state.user.address === "" && route.path !== "/signin") {
    return redirect("/signin");
  }
  if (route.path === "/") {
    return redirect("/locks");
  }
}
