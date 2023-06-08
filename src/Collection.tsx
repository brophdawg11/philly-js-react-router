import {
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useLocation,
} from "react-router-dom";
import { getProductsInCollection } from "./api";

const PAGE_SIZE = 4;

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response(null, { status: 404 });
  }

  let url = new URL(request.url);
  let page = parseInt(url.searchParams.get("page") || "1", 10);
  let order = url.searchParams.get("order");

  // Fetch data
  let collection = await getProductsInCollection(
    request.signal,
    params.handle!
  );

  // Sort products and pick active page
  let startIndex = (page - 1) * PAGE_SIZE;
  let sortedProducts = [...collection.products];
  sortedProducts.sort(
    (a, b) => a.title.localeCompare(b.title) * (order === "desc" ? -1 : 1)
  );
  let products = sortedProducts.slice(startIndex, startIndex + PAGE_SIZE);
  let totalPages = Math.ceil(collection.products.length / PAGE_SIZE);

  // Generate prev/next links
  let prevParams = new URLSearchParams();
  if (page > 2) prevParams.append("page", String(page - 1));
  if (order) prevParams.append("order", order);
  let prevPageHref =
    page === 1 ? null : `${url.pathname}?${prevParams.toString()}`;

  let nextParams = new URLSearchParams();
  if (page < totalPages) nextParams.append("page", String(page + 1));
  if (order) nextParams.append("order", order);
  let nextPageHref =
    page >= totalPages ? null : `${url.pathname}?${nextParams.toString()}`;

  return {
    title: collection.title,
    products,
    currentPage: page,
    totalPages,
    prevPageHref,
    nextPageHref,
  };
}

export default function Collection() {
  let data = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <div className="collection">
      <div className="meta">
        <h2>{data.title}</h2>

        <div className="sort">
          Sort &nbsp;
          <Link to="?order=asc">⬆️</Link>
          &nbsp;
          <Link to="?order=desc">⬇️</Link>
        </div>

        <div className="pagination">
          {data.prevPageHref ? (
            <Link to={data.prevPageHref}>⏪</Link>
          ) : (
            <span>⏪</span>
          )}
          &nbsp; Page {data.currentPage} of {data.totalPages} &nbsp;
          {data.nextPageHref ? (
            <Link to={data.nextPageHref}>⏩</Link>
          ) : (
            <span>⏩</span>
          )}
        </div>
      </div>

      <div className="grid">
        {data.products.map((product) => (
          <div key={product.id} className="item">
            <Link to={`/product/${product.handle}`}>
              <img
                src={`${product.featuredImage.url}&width=640&height=800&crop=center`}
              />
              <h3>{product.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
