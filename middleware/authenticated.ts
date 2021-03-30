export default function ({ store, redirect, route }: any) {
  if (route.path !== "/signin") {
    const path = route.path.replace(/\/$/, "");
    localStorage.setItem("@previous_path", path);
  }
  if (store.state.user.address === "" && route.path !== "/signin") {
    return redirect("/signin");
  }
  if (route.path === "/") {
    return redirect("/locks");
  }
}
