import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";
import { motion } from "framer-motion";

const variant = {
  hidden: {
    y: 3000,
    opacity: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 2,
      staggerChildren: 0.5,
    },
  },
};

const Home = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [sellListing, setSellListing] = useState([]);
  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch(
          `${REACT_APP_BASE_URL}/api/v1/listing/get/all?offer=true&limit=4`
        );
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListing();
    const fetchRentListing = async () => {
      try {
        const res = await fetch(
          `${REACT_APP_BASE_URL}/api/v1/listing/get/all?type=rent&limit=4`
        );
        const data = await res.json();
        setRentListing(data);
        fetchSellListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSellListing = async () => {
      try {
        const res = await fetch(
          `${REACT_APP_BASE_URL}/api/v1/listing/get/all?type=sell&limit=4`
        );
        const data = await res.json();
        setSellListing(data);
      } catch (error) {
        console.log(error);
      }
    };
  }, []);
  return (
    <div className="">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-10">
        <h1 className="text-slate-700 font-bold text-3xl md:text-5xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span> <br />
          place with ease
        </h1>
        <div className="text-gray-600 text-sm md:text-m font-semibold">
          NazState is the best and easy way to find your next perfect place to
          live.
          <br />
          We have wide range of properties for you to choose from.
        </div>
        <Link
          className="text-sm md:text-m text-blue-600 font-bold hover:underline"
          to="/search"
        >
          Let's get started..
        </Link>
      </div>
      <div className="">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          autoplay={true}
          pagination={{ clickable: true }}
        >
          {offerListing &&
            offerListing.length > 0 &&
            offerListing.map((list) => (
              <SwiperSlide key={list._id}>
                <div
                  // style={{
                  //   background: `url(${list.imageUrls[0]}) center no-repeat`,
                  //   backgroundSize: "cover",
                  // }}
                  className="h-[450px] w-full"
                >
                  <img
                    className="object-strech h-full w-full"
                    src={list.imageUrls[0]}
                    alt="List"
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <motion.div
        variants={variant}
        initial="hidden"
        animate="visible"
        className="max-w-screen mx-10 p-3 flex flex-col gap-8 my-10"
      >
        <motion.div variants={variant}>
          {offerListing && offerListing.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-bold text-slate-700">
                  Recent Offers
                </h2>
                <Link
                  className="text-sm font-semibold text-blue-800 hover:underline"
                  to="/search?offer=true"
                >
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListing.map((list) => (
                  <ListingItem listing={list} key={list._id} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
        <motion.div variants={variant}>
          {rentListing && rentListing.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-bold text-slate-700">For Rent</h2>
                <Link
                  className="text-sm font-semibold text-blue-800 hover:underline"
                  to="/search?type=rent"
                >
                  Show more places for rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListing.map((list) => (
                  <ListingItem listing={list} key={list._id} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
        <motion.div variants={variant}>
          {sellListing && sellListing.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-bold text-slate-700">For Sell</h2>
                <Link
                  className="text-sm font-semibold text-blue-800 hover:underline"
                  to="/search?type=sell"
                >
                  Show more places for sell
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {sellListing.map((list) => (
                  <ListingItem listing={list} key={list._id} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
