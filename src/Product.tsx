import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  useActionData,
  useLoaderData,
} from "react-router-dom";
import { getProductWithVariants, addToCart } from "./api";

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();

  await addToCart({
    id: formData.get("id") as string,
    handle: formData.get("handle") as string,
    options: Array.from(formData.entries())
      .filter(([name]) => !["id", "handle"].includes(name))
      .map(([name, value]) => [name, value as string]),
  });

  return null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response(null, { status: 404 });
  }
  let product = await getProductWithVariants(params.handle);
  console.log("product", product);
  return {
    product,
  };
}

export default function Product() {
  let data = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  let actionData = useActionData() as Exclude<
    Awaited<ReturnType<typeof action>>,
    Response
  >;

  return (
    <div className="product">
      <div key="product" className="container">
        <div className="info">
          <h2>{data.product.title}</h2>

          <p>{data.product.description}</p>

          <Form method="post" replace>
            <input type="hidden" name="id" defaultValue={data.product.id} />
            <input
              type="hidden"
              name="handle"
              defaultValue={data.product.handle}
            />
            {data.product.options.map((option) => (
              <fieldset key={option.name}>
                {option.name}
                {option.values.map((value, index) => (
                  <label key={value}>
                    <input
                      type="radio"
                      required
                      name={option.name.toLowerCase().replace(" ", "-")}
                      value={value}
                      defaultChecked={index === 0}
                    />
                    {/* TODO: change to links */}
                    {value}
                  </label>
                ))}
              </fieldset>
            ))}

            {actionData?.error ? (
              <p className="error">{actionData.error}</p>
            ) : null}

            <button type="submit">Add to Cart</button>
          </Form>
        </div>

        <div>
          <div className="images">
            <img
              src={`${data.product.featuredImage.url}&width=640&height=800&crop=center`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
