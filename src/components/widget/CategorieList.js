import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";
import { TitreWidget } from "../themeComponents";

const animationParent = {
  initial: { scaleY: 0.1, height: 0 },
  isVisible: {
    scaleY: 1,
    height: "auto",
    transition: {
      staggerChildren: 0.1,
    },
  },
  isHidden: { scaleY: 0.1, height: 0 },
};
const animationChild = {
  initial: { opacity: 0, x: 75 },
  isVisible: { opacity: 1, x: 0 },
  isHidden: { opacity: 0, x: 75 },
};
const CategorieList = ({ navCatData, className }) => {
  const [check, setCheck] = useState(true);
  // ...

  return (
    <div className={`${className ? className : ""}`}>
      <TitreWidget onClick={() => setCheck((prevCheck) => !prevCheck)}>
        Catégories
      </TitreWidget>
      <AnimatePresence exitBeforeEnter>
        {check && (
          <motion.div
            initial="initial"
            animate="isVisible"
            exit="isHidden"
            variants={animationParent}
            className={`flex flex-col overflow-hidden relative`}
          >
            {navCatData?.length && <SideNavRoot navCatData={navCatData} />}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="border-2 border-gray-600 w-36"></div>
    </div>
  );
};

const SideNavRoot = ({ navCatData }) => {
  return navCatData.map((item) => (
    <motion.div variants={animationChild}>
      <NavRootItem {...item}></NavRootItem>
    </motion.div>
  ));
};

const NavRootItem = ({ name, slug, id, children }) => {
  return (
    <Link href={`/categorie/${slug}`} key={id} passHref>
      <a className={`p-1 block`}>{name}</a>
    </Link>
  );
};

export default CategorieList;
