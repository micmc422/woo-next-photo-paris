import { isEmpty } from "lodash";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import nextI18nextConfig from "../../next-i18next.config";
import client, { clientEng } from "../../src/components/ApolloClient";
import getMenu from "../../src/get-menu-fallback";
import {
  PRODUCT_BY_TAG_SLUG,
  PRODUCT_TAG_SLUGS,
} from "../../src/queries/product-by-tag";
import parse from "html-react-parser";
import Layout from "../../src/components/Layout";
import { motion } from "framer-motion";
import ShopLayout from "../../src/components/ShopLayout";
import DisplayProducts from "../../src/components/sections/DisplayProducts";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
const fetch = require("@vercel/fetch-retry")(require("node-fetch"));

const fetcher = (url) => fetch(url).then((r) => r.json());

const Tags = (props) => {
  const router = useRouter();
  const { query, locale } = router;
  const {
    footer,
    tagName,
    products,
    pageInfoStatic,
    menu,
    seoHead,
    tagList,
    catBase,
    seoSchema,
  } = props;

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [pageInfo, setPageInfo] = useState(pageInfoStatic);
  // delete query.tags;
  //delete query.category;
  delete query.lang;
  const formattedQuery = new URLSearchParams(query).toString();
  // const catInFilterred = cat?.filter(({ slug }) => slug === query?.categoryIn);
  //const categoryIn = catInFilterred?.length > 0 && catInFilterred[0].name;
  const { data, error } = useSWR(
    formattedQuery !== ""
      ? `/api/products/?locale=${locale}&${formattedQuery}`
      : null,
    fetcher
  );
  const isLoading = !data && !error && formattedQuery !== "";
  useEffect(() => {
    if (data?.products?.nodes?.length > 0) {
      setPageInfo(data?.products?.pageInfo || {});
      setFilteredProducts(data?.products?.nodes);
    } else {
      setPageInfo(pageInfoStatic);
      setFilteredProducts(products);
    }
  }, [formattedQuery, data?.products, products]);
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const seoData = seoHead && parse(seoHead);

  return (
    <Layout menu={menu} footer={footer}>
      <Head>
        {seoData ? seoData : ""}{" "}
        <script type="application/ld+json">{`${seoSchema}`}</script>
      </Head>
      <div className="container px-4 mx-auto my-8">
        {tagName ? (
          <motion.h1
            key={tagName}
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="mb-5 text-4xl font-black uppercase lg:text-8xl md:text-6xl sm:text-4xl"
          >
            {tagName}
          </motion.h1>
        ) : (
          ""
        )}
        <ShopLayout
          categories={catBase}
          catBase={catBase}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          tagList={tagList}
        >
          <div className="relative grid w-full grid-cols-2 gap-4 mx-auto overflow-hidden sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            <DisplayProducts
              isLoading={isLoading}
              filteredProducts={filteredProducts}
            />
          </div>
        </ShopLayout>
      </div>
    </Layout>
  );
};

export default Tags;

export async function getStaticProps({ params: { tags }, locale }) {
  const apolloCli = locale === "fr" ? client : clientEng;
  // console.log({ category });
  const queryPath = `/etiquette/${tags[tags.length - 1]}/`;
  const queryMenuPath = `/etiquette/${tags[0]}/`;
  // console.log({ queryPath, queryMenuPath });
  const { data } = await apolloCli.query({
    query: PRODUCT_BY_TAG_SLUG,
    variables: {
      uri: queryPath,
      uriMenu: queryMenuPath,
    },
  });

  const menu = (await getMenu(locale)) || [];

  return {
    props: {
      // data, //TODO delete after test
      footer: data?.getFooter,
      menu,
      catBase: data?.catBase?.nodes || [],
      tagName: data?.productTag?.name || "",
      pageInfoStatic: data?.productTag?.products?.pageInfo || {},
      products: data?.productTag?.products?.nodes || [],
      tagList: data?.tagList?.nodes || [],
      seoHead: data?.productTag?.seo?.fullHead || "",
      seoSchema: data?.productTag?.seo?.schema?.raw || "",
      ...(await serverSideTranslations(
        locale,
        ["shop", "footer"],
        nextI18nextConfig
      )),
    },
    revalidate: 86400,
  };
}

export async function getStaticPaths({}) {
  const apolloCli = client;
  const apolloCliEng = clientEng;
  const { data } = await apolloCli.query({
    query: PRODUCT_TAG_SLUGS,
  });

  const dataEn = await apolloCliEng.query({
    query: PRODUCT_TAG_SLUGS,
  });

  const pathsData = [];

  data?.productTags?.nodes &&
    data?.productTags?.nodes.map((productTag) => {
      if (!isEmpty(productTag?.uri)) {
        const tags = productTag?.uri
          .replace("https://photo.paris", "")
          .split("/")
          .filter((e) => e !== "" && !e.includes("?lang="))
          .slice(1, 99);
        if (tags.length > 0) {
          pathsData.push({
            params: {
              tags: [...tags],
            },
          });
        }
      }
    });
  dataEn?.data?.productTags?.nodes &&
    dataEn?.data?.productTags?.nodes.map((productTag) => {
      if (!isEmpty(productTag?.uri)) {
        const tags = productTag?.uri
          .replace("https://photo.paris", "")
          .split("/")
          .filter(
            (e) => e !== "" && !e.includes("?lang=") && !e.includes("?en")
          )
          .slice(1, 99);
        if (tags.length > 1) {
          pathsData.push({
            params: {
              tags: [...tags],
              locale: "en",
            },
          });
        }
      }
    });
  return {
    paths: pathsData,
    fallback: true,
  };
}
