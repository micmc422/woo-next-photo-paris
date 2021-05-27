import Layout from "../../src/components/Layout";
import { useRouter } from "next/router";
import client, { clientEng } from "../../src/components/ApolloClient";
import AddToCartButton from "../../src/components/cart/AddToCartButton";
import {
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_SLUGS,
} from "../../src/queries/product-by-slug";
import { isEmpty, uniqueId } from "lodash";
import RateBlock from "../../src/components/single-product/RateBlock";
import ColorSizeBlock from "../../src/components/single-product/ColorSizeBlock";
import ImageContainer from "../../src/components/single-product/ImageProduct";
import Link from "next/link";
import BlocPrix from "../../src/components/single-product/price/BlocPrix";
import { useEffect, useState } from "react";
import ContentParser from "../../src/components/ContentParser";
import getMenu from "../../src/get-menu-fallback";
import Head from "next/head";
import parse from "html-react-parser";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ProductCard from "../../src/components/Product";
import { Bouton } from "../../src/components/themeComponents";

export default function Product(props) {
  const { product, menu } = props;
  const tmp = product?.variations?.nodes.slice();
  const orderredVariations = tmp?.sort(
    (a, b) => +a?.price?.replace(",00€", "") - +b?.price?.replace(",00€", "")
  );

  const seoData = product?.seo?.fullHead && parse(product?.seo?.fullHead);
  const seoSchema = product?.seo?.schema?.raw;
  const router = useRouter();
  const [activeVariations, setActiveVariations] = useState(
    orderredVariations ? orderredVariations[0] : null
  );
  const fullUpsellList = [
    ...product?.upsell?.nodes,
    ...product?.related?.nodes,
  ].slice(0, 4);
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  useEffect(() => {});
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <Layout menu={menu}>
      <Head>
        {seoData ? seoData : ""}
        <script type="application/ld+json">{`${seoSchema}`}</script>
      </Head>
      <section className="px-5 py-4 mx-auto text-gray-600 body-font md:py-24">
        <div className="">
          <div className="flex flex-wrap mx-auto lg:w-4/5">
            <ImageContainer
              imgarray={[...product.galleryImages.nodes, product?.image]}
              slug={product.slug}
            />
            <div className="flex flex-col justify-center w-full mt-6 lg:w-1/2 lg:pl-10 lg:py-6 lg:mt-0">
              <div className="flex flex-row flex-wrap space-x-2 text-sm tracking-widest text-gray-300">
                {product?.productCategories?.nodes.map(
                  ({ name, description, uri }) => {
                    return (
                      <Link
                        href={`${uri.replace("https://photo.paris", "")}`}
                        passHref
                        key={uniqueId()}
                      >
                        <a className="uppercase transition-colors hover:text-gray-400">
                          {name}
                        </a>
                      </Link>
                    );
                  }
                )}
              </div>
              <div className="flex flex-row flex-wrap space-x-2 text-xs tracking-widest text-brand-500 title-font">
                {product?.productTags?.nodes.map(
                  ({ name, description, uri }) => {
                    return (
                      <Link
                        href={`${uri.replace("https://photo.paris", "")}`}
                        passHref
                        key={uniqueId()}
                      >
                        <a className="transition-colors hover:text-brand-800">
                          {name}
                        </a>
                      </Link>
                    );
                  }
                )}
              </div>
              <h1 className="my-1 text-3xl font-black text-gray-900 md:text-5xl lg:text-6xl title-font">
                {product.name}
              </h1>
              <RateBlock
                rating={product?.reviews?.averageRating}
                reviewCount={product?.reviewCount}
              />
              <div
                className="leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: product?.shortDescription,
                }}
              />
              {product.variations && (
                <ColorSizeBlock
                  setActiveVariations={setActiveVariations}
                  variations={orderredVariations}
                  activeVariations={activeVariations}
                  productName={product.name}
                />
              )}
              <div className="flex">
                <div className="flex px-6 py-2 ml-auto">
                  {" "}
                  <AddToCartButton
                    product={product}
                    variation={activeVariations}
                  >
                    <BlocPrix
                      price={product.price}
                      activeVariations={activeVariations}
                    />
                  </AddToCartButton>
                  <button className="inline-flex items-center justify-center w-10 h-10 p-0 ml-4 text-gray-500 bg-gray-200 border-0 rounded-full">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-screen-md pb-8 mx-auto">
        <Bouton>
          <div className="text-4xl md:text-8xl">à découvrir</div>
        </Bouton>
      </div>
      <div className="grid max-w-screen-lg grid-cols-2 gap-4 px-4 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        <Upsell products={fullUpsellList} />
      </div>
      {product ? (
        <div className="container flex flex-col px-4 mx-auto mb-32 single-product xl:px-0">
          <ContentParser data={product.description}></ContentParser>

          {false && (
            <div
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
              className="container mx-auto mb-5 product-description"
            />
          )}
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
}

const Upsell = ({ products }) => {
  return (
    products &&
    products.map((product) => <ProductCard product={product} noName />)
  );
};

export async function getStaticProps(context) {
  const {
    params: { slug },
    locale,
  } = context;

  const apolloCli = locale === "fr" ? client : clientEng;
  const menu = (await getMenu(locale)) || [];
  const { data } = await apolloCli.query({
    query: PRODUCT_BY_SLUG_QUERY,
    variables: { slug },
  });

  return {
    props: {
      menu,
      product: data?.product || {},
      ...(await serverSideTranslations(locale, ["common", "footer", "shop"])),
    },
    revalidate: 86400,
  };
}

export async function getStaticPaths() {
  const apolloCli = client;
  const apolloCliEng = clientEng;
  const { data } = await apolloCli.query({
    query: PRODUCT_SLUGS,
  });
  const { dataEn } = await apolloCliEng.query({
    query: PRODUCT_SLUGS,
  });

  const pathsData = [];

  data?.products?.nodes &&
    data?.products?.nodes.map(({ slug }) => {
      if (!isEmpty(slug)) {
        pathsData.push({
          params: {
            slug: slug.toString(),
          },
          locale: "fr",
        });
      }
    });
  dataEn?.products?.nodes &&
    dataEn?.products?.nodes.map(({ slug }) => {
      if (!isEmpty(slug)) {
        pathsData.push({
          params: {
            slug: slug.toString(),
          },
          locale: "en",
        });
      }
    });

  return {
    paths: pathsData,
    fallback: true,
  };
}
