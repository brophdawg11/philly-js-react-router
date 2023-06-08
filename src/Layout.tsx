import {
  Link,
  LoaderFunctionArgs,
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { getCart, getCollections, getUser } from "./api";

export async function loader({ request }: LoaderFunctionArgs) {
  const collections = await getCollections(request.signal);
  const cart = await getCart();
  const user = await getUser();
  return {
    collections,
    cart,
    user,
  };
}

export default function Layout() {
  let data = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  let logoutFetcher = useFetcher();
  let navigation = useNavigation();

  return (
    <div className="layout">
      {navigation.state !== "idle" || logoutFetcher.state !== "idle" ? (
        <span className="global-spinner spin">🔄</span>
      ) : null}

      <header>
        <div className="topnav">
          <div className="user">
            {data.user ? (
              <>
                <span>Welcome, {data.user.username}</span>&nbsp; (
                <logoutFetcher.Form method="post" action="/api/logout">
                  <button type="submit">Logout</button>
                </logoutFetcher.Form>
                )
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
          <h1>
            <Link to="/">🍀 Demo Store 🍀</Link>
          </h1>
          <div className="cart">🛍 {data.cart.items.length}</div>
        </div>

        <nav>
          {data.collections.map((c) => (
            <Link key={c.id} to={`/collection/${c.handle}`}>
              {c.title}
            </Link>
          ))}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
