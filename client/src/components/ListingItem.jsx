import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { motion } from "framer-motion";

const ListingItem = ({ listing }) => {
  return (
    <motion.div layout animate={{opacity:1,transition:{duration:0.5}}} initial={{opacity:0}} exit={{opacity:0}} className="bg-white shadow-md hover:shadow-lg translate-shadow overflow-hidden rounded-lg w-full md:w-[320px]">
      <Link
        to={`/listing/${listing._id}`}
      >
        <img
          src={listing.imageUrls[0]}
          alt="listing"
          className="h-[320px] md:h-[220px] w-full object-cover rounded-lg hover:scale-105 translate-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-xl font-bold text-slate-800 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-2">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-md text-gray-700 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-md text-grey-700 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-600 mt-2 font-bold">
            ${" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}{" "}
            {listing.type === "rent" && "/ month"}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="text-sm font-bold">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="text-sm font-bold">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} bathrooms`
                : `${listing.bathrooms} bathroom`}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ListingItem;
