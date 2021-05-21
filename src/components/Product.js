import Link from "next/link";
import AddToCartButton from "../components/cart/AddToCartButton";
import clientConfig from "../../client-config";
import { isEmpty, uniqueId } from "lodash";
import Price from "./single-product/price";
import Image from "next/image";
import { useState } from "react";
import { Bouton } from "./themeComponents";
import { AnimatePresence, motion } from "framer-motion";
import ImageWithFallback from "./ImageFallBack";
import Skeleton from "react-loading-skeleton";

const productCardAnimationContainer = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};
const Product = (props) => {
  const { product, noName } = props;
  // console.log(product)
  return (
    // @TODO Need to handle Group products differently.
    <div className="w-full mb-5 product">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={productCardAnimationContainer}
      >
        <Link
          href={product.slug ? `/galerie-photo/${product.slug}` : "./"}
          passHref
        >
          <a className="relative block h-48 md:h-64">
            {!isEmpty(product.image) ? (
              <VignettePhoto product={product} />
            ) : !isEmpty(clientConfig.productImagePlaceholder) ? (
              <div className="relative overflow-hidden">
                <Skeleton height={250} width={250} />
              </div>
            ) : null}
          </a>
        </Link>
        {!noName && (
          <div className="text-center cursor-pointer product-info">
            <Link href={product.slug ? `/galerie-photo/${product.slug}` : "./"}>
              <h3 className="pb-2 mt-3 text-xl font-thin text-center text-gray-600 hover:text-gray-800">
                {product.name ? product.name : "Chargement..."}
              </h3>
            </Link>
            <div className="flex flex-row flex-wrap items-center justify-around space-x-2">
              {product.name && (
                <>
                  <AddToCartButton product={product}>
                    <div className="pt-2">
                      <Price
                        salesPrice={product?.price}
                        regularPrice={product?.regularPrice}
                      />
                    </div>
                  </AddToCartButton>
                  <div className="flex flex-row md:flex-col">
                    <div className="hidden m-auto my-1 cursor-pointer lg:block">
                      <Bouton
                        circleClass={"bg-brand-500 hover:ring-2"}
                        small={true}
                      >
                        <Link
                          href={
                            product.slug
                              ? `/galerie-photo/${product.slug}`
                              : "./"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </Link>
                      </Bouton>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const VignettePhoto = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const orientation = product.galleryImages?.nodes[0]
    ? product.galleryImages?.nodes[0].mediaDetails.width >
      product.galleryImages?.nodes[0].mediaDetails.height
      ? "cover"
      : "contain"
    : product.image?.mediaDetails &&
      product.image.mediaDetails.width > product.image.mediaDetails.height
    ? "cover"
    : "contain";
  const imageUrlPrimaire = product.galleryImages?.nodes[0]
    ? product.galleryImages?.nodes[0].mediaItemUrl
    : product.image?.sourceUrl;
  const imageUrlSecondaire = product.image?.sourceUrl;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered ? (
          <motion.div
            key={uniqueId(product.id)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ImageWithFallback
              src={imageUrlPrimaire}
              slug={product.slug}
              alt="Product image"
              layout="fill"
              objectfit={orientation}
            />
          </motion.div>
        ) : (
          <motion.div
            key={uniqueId(product.id + "-alt")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ImageWithFallback
              src={imageUrlSecondaire}
              slug={product.slug}
              alt="Product image"
              layout="fill"
              objectfit={orientation}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Product;
