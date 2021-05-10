import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CategorieList from "./widget/CategorieList";
import FilterSection from "./widget/FilterSection";
import SideBarSticky from "./widget/SideBarSticky";

const ShopLayout = ({ children, categories, pageInfo, className }) => {
  const [pageLength, setPageLength] = useState(24);
  return (
    <div className={`flex flex-row lg:space-x-2 ${className ? className : ""}`}>
      <SideBarSticky>
        <FilterSection className="w-48 m-auto" categories={categories} />
      </SideBarSticky>
      <div className="container max-w-screen-lg mx-auto">
        <AnimateSharedLayout>{children}</AnimateSharedLayout>
        <Pagination pageInfo={pageInfo} pageLength={pageLength} />
      </div>
      <SideBarSticky>
        <CategorieList
          className="w-48 m-auto text-right"
          navCatData={categories}
        />
      </SideBarSticky>
    </div>
  );
};
const Pagination = ({ pageInfo = {}, pageLength }) => {
  const { hasNextPage, hasPreviousPage } = pageInfo;
  const router = useRouter();
  return (
    <div className={`flex flex-row justify-around`}>
      <button></button>
      {hasPreviousPage && (
        <button
          onClick={() =>
            replaceQuery(pageInfo.startCursor, "before", router, pageLength)
          }
        >
          précédent
        </button>
      )}
      {hasNextPage && (
        <button
          onClick={() =>
            replaceQuery(pageInfo.endCursor, "after", router, pageLength)
          }
        >
          suivant
        </button>
      )}
    </div>
  );
};
const replaceQuery = (name, key, router, pageLength) => {
  const { query } = router;
  let theQuery = query;
  theQuery[key] = name;
  if (key === "after") {
    delete theQuery["first"];
    delete theQuery["before"];
    delete theQuery["last"];
  }
  if (key === "before") {
    theQuery["last"] = pageLength;
    delete theQuery["after"];
    delete theQuery["first"];
  }
  const options = { scroll: false };
  const formattedQuery = new URLSearchParams(theQuery).toString();
  router.push(
    {
      pathname: router.asPath.split("?")[0],
      query: formattedQuery,
    },
    null,
    options
  );
};
export default ShopLayout;