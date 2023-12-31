import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/autoplay";
import { useSelector } from "react-redux";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
const Listing = () => {
  const REACT_APP_BASE_URL=process.env.REACT_APP_BASE_URL
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${REACT_APP_BASE_URL}/api/v1/listing/${params.id}`);
        const data = await res.json();
        if (data.msg) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);
  return (
    <div>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            autoplay={true}
            pagination={{ clickable: true }}
          >
            {listing.imageUrls.map((img) => {
              return (
                <SwiperSlide key={img}>
                  <div
                    className="h-[550px]"
                  >
                    <img className="object-cover h-full w-full" src={img} alt="list" />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="absolute top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          <div className="flex flex-col max-w-4xl mx-20 p-3 my-5 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${""}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              /month
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-lg">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} Discount
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-bold text-black">Description - </span>{" "}
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 md:gap-6">
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bathrooms`
                  : `${listing.bathrooms} bathroom`}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? `Parking` : `No Parking`}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? `Furnished` : `Not Furnished`}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-800 text-white rounded-lg uppercase hover:bg-slate-900 p-3"
              >
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Listing;
