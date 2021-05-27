import { motion, useAnimation } from "framer-motion";
import { uniqueId } from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";

const animationVariants = {
  loaded: { opacity: 1 },
  notLoaded: { opacity: 0 },
};

const ImageProduct = ({
  slug,
  sourceUrl,
  mediaItemUrl,
  mediaDetails: { height, width },
}) => {
  const [loaded, setLoaded] = useState(false);
  const animationControls = useAnimation();
  useEffect(() => {
    if (loaded) {
      animationControls.start("loaded");
    }
  }, [loaded]);

  return (
    <motion.div
      initial={"notLoaded"}
      animate={animationControls}
      variants={animationVariants}
      transition={{ ease: "easeOut", duration: 1 }}
      className="relative"
    >
      <Image
        className="object-cover object-center w-full rounded lg:w-4/5"
        src={sourceUrl ? sourceUrl : mediaItemUrl}
        alt="Product Image"
        height={height}
        width={width}
        onLoad={(event) => {
          const target = event.target;
          if (target.src.indexOf("data:image/gif;base64") < 0) {
            setLoaded(true);
          }
        }}
      />
    </motion.div>
  );
};
const ImageContainer = ({ imgarray }) => {
  const [selected, setSelected] = useState(0);
  return (
    <div className="w-full lg:w-1/2">
      <div className="relative">
        {imgarray.map(
          (item, i) =>
            selected === i && <ImageProduct {...item} key={item.id} />
        )}
      </div>
      <Vignettes imgarray={imgarray} setSelected={setSelected} />
    </div>
  );
};

const Vignettes = ({ imgarray, setSelected }) => {
  // console.log(imgarray);
  return (
    <div
      className={`h-24 relative flex flex-row w-2/3 mx-auto space-x-2 items-center justify-center`}
    >
      {imgarray.map(
        (
          { id, sourceUrl, mediaItemUrl, mediaDetails: { height, width } },
          i
        ) => {
          const [loaded, setLoaded] = useState(false);
          const animationControls = useAnimation();
          useEffect(() => {
            if (loaded) {
              animationControls.start("loaded");
            }
          }, [loaded]);

          return (
            <div
              // initial={"notLoaded"}
              //  animate={animationControls}
              // variants={animationVariants}
              // transition={{ ease: "easeOut", duration: 1 }}
              className={` w-24 h-24 relative rounded-md transition overflow-hidden ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setSelected(i)}
              key={uniqueId(id)}
            >
              <Image
                className=""
                src={sourceUrl ? sourceUrl : mediaItemUrl}
                alt="Product Image"
                layout="fill"
                objectFit="cover"
                objectPosition=" center center"
                // height={height}
                //  width={width}
                onLoad={(event) => {
                  const target = event.target;
                  if (target.src.indexOf("data:image/gif;base64") < 0) {
                    setLoaded(true);
                  }
                }}
              />
            </div>
          );
        }
      )}
    </div>
  );
};
export default ImageContainer;
