import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
} from "react-router-dom";
import { loginUser, getUser } from "./api";

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();

  let user = await loginUser(formData.get("username") as string);

  if (!user) {
    return { message: "Invalid login attempt, please try again" };
  }

  return redirect("/");
}

export async function loader() {
  let user = await getUser();
  if (user) {
    return redirect("/");
  }
  return null;
}

export default function Product() {
  let actionData = useActionData() as Exclude<
    Awaited<ReturnType<typeof action>>,
    Response
  >;

  return (
    <div className="login">
      <h2>Login</h2>

      <Form method="post">
        <label>
          Username:
          <input name="username" />
        </label>
        <button type="submit">Login</button>
      </Form>

      {actionData?.message ? (
        <p className="error">{actionData.message}</p>
      ) : null}
    </div>
  );
}
