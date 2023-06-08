/* eslint-disable @typescript-eslint/no-explicit-any */

import { gql, GraphQLClient } from "graphql-request";

export type Image = {
  id: string;
  url: string;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image;
};

export type CollectionWithProducts = Collection & {
  products: Product[];
};

export type Option = {
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: Image;
  options: Option[];
};

export type Variant = {
  id: string;
  title: string;
  image: Image;
  price: {
    amount: number;
    currencyCode: string;
  };
  selectedOptions: {
    name: string;
    value: string;
  };
};

export type ProductWithVariants = Product & {
  variants: Variant[];
};

const graphQLClient = new GraphQLClient("https://mock.shop/api", {
  method: `GET`,
  // jsonSerializer: {
  //   parse: JSON.parse,
  //   stringify: JSON.stringify,
  // },
});

export async function getCollections(num = 10): Promise<Collection[]> {
  const data = (await graphQLClient.request(
    gql`
      query getCollections($num: Int!) {
        collections(first: $num) {
          edges {
            cursor
            node {
              id
              handle
              title
              description
              image {
                id
                url
              }
            }
          }
        }
      }
    `,
    { num }
  )) as any;
  return data.collections.edges.map((edge: any) => ({
    id: edge.node.id,
    handle: edge.node.handle,
    title: edge.node.title,
    description: edge.node.description,
    image: edge.node.image,
  }));
}

export async function getProductsInCollection(
  handle: string,
  num = 20
): Promise<CollectionWithProducts> {
  const data = (await graphQLClient.request(
    gql`
      query getProductsInCollection($handle: String!, $num: Int!) {
        collection(handle: $handle) {
          id
          handle
          title
          description
          image {
            id
            url
          }
          products(first: $num) {
            edges {
              node {
                id
                handle
                title
                description
                featuredImage {
                  id
                  url
                }
              }
            }
          }
        }
      }
    `,
    { handle, num }
  )) as any;

  const collection: CollectionWithProducts = {
    id: data.collection.id,
    handle: data.collection.handle,
    title: data.collection.title,
    description: data.collection.description,
    image: data.collection.image,
    products: data.collection.products.edges.map((edge: any) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      description: edge.node.description,
      featuredImage: edge.node.featuredImage,
      options: edge.node.options,
    })),
  };

  return collection;
}

export async function getProductWithVariants(
  handle: string,
  num = 3
): Promise<ProductWithVariants> {
  const data = (await graphQLClient.request(
    gql`
      query getProduct($handle: String!, $num: Int!) {
        product(handle: $handle) {
          id
          handle
          title
          description
          featuredImage {
            id
            url
          }
          options {
            name
            values
          }
          variants(first: $num) {
            edges {
              cursor
              node {
                id
                title
                image {
                  url
                }
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    `,
    { handle, num }
  )) as any;

  return {
    id: data.product.id,
    handle: data.product.handle,
    title: data.product.title,
    description: data.product.description,
    featuredImage: data.product.featuredImage,
    options: data.product.options,
    variants: data.product.variants.edges.map((edge: any) => ({
      id: edge.node.id,
      image: edge.node.image,
      price: edge.node.price,
      title: edge.node.title,
      selectedOptions: edge.node.selectedOptions,
    })),
  };
}

type CartItem = {
  id: string;
  handle: string;
  options: [string, string][];
};

type Cart = {
  items: CartItem[];
};

export async function getCart(): Promise<Cart> {
  await new Promise((r) => setTimeout(r, 500));
  let str = localStorage.getItem("cart");
  return str ? JSON.parse(str) : { items: [] };
}

export async function addToCart(item: CartItem): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
  let str = localStorage.getItem("cart");
  let cart = str ? JSON.parse(str) : { items: [] };
  cart.items.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
}

type User = {
  username: string;
};

export async function getUser(): Promise<User | null> {
  await new Promise((r) => setTimeout(r, 500));
  let str = localStorage.getItem("user");
  return str ? JSON.parse(str) : null;
}

export async function loginUser(username: string): Promise<User | null> {
  await new Promise((r) => setTimeout(r, 500));
  if (username !== "matt") {
    return null;
  }

  let user = { username };
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export async function logoutUser(): Promise<null> {
  await new Promise((r) => setTimeout(r, 500));
  localStorage.removeItem("user");
  return null;
}
