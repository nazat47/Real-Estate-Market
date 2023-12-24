import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { motion, AnimatePresence } from "framer-motion";

const Search = () => {
  const REACT_APP_BASE_URL=process.env.REACT_APP_BASE_URL
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    search: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get("search");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchFromUrl ||
      furnishedFromUrl ||
      parkingFromUrl ||
      offerFromUrl ||
      orderFromUrl ||
      typeFromUrl ||
      sortFromUrl
    ) {
      setSideBarData({
        search: searchFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }
    const fetchData = async () => {
      const searchQuery = urlParams.toString();
      setLoading(true);
      setShowMore(false);
      const res = await fetch(`${REACT_APP_BASE_URL}/api/v1/listing/get/all?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setLoading(false);
      setListings(data);
    };
    fetchData();
  }, [window.location.search]);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }
    if (e.target.id === "search") {
      setSideBarData({ ...sideBarData, search: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0];
      const order = e.target.value.split("_")[1];
      setSideBarData({
        ...sideBarData,
        sort,
        order,
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("search", sideBarData.search);
    urlParams.set("type", sideBarData.type);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const onShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`${REACT_APP_BASE_URL}/api/v1/listing/get/all?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-2 p-6 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-3 ">
            <label className="whitespace-wrap  font-bold">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search"
              className="border rounded-lg p-3 w-full"
              value={sideBarData.search}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-bold">Type : </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sideBarData.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={sideBarData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                checked={sideBarData.type === "sell"}
                onChange={handleChange}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sideBarData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-bold">Amenities : </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sideBarData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-bold">Sort</label>
            <select
              id="sort_order"
              className="border rounded-lg p-3 hover:bg-slate-100"
              defaultValue={"createdAt_desc"}
              onChange={handleChange}
            >
              <option value="regularPrice_asc">Price low to high</option>
              <option value="regularPrice_desc">Price high to low</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-800 text-white rounded-lg p-3 uppercase hover:bg-slate-900">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold border-b w-full p-3 text-slate-700 mt-5">
          Listing Results :{" "}
        </h1>
       
          {!loading && listings.length === 0 && (
            <p className="text-2xl text-slate-700 font-semibold">
              No listing found!
            </p>
          )}
          {loading && (
            <p className="text-xl text-center text-slate-800 w-full">
              Loading...
            </p>
          )}
           <motion.div layout 
          className="p-7 flex flex-wrap gap-5"
        >
          {!loading && listings && (
            <AnimatePresence>
              {listings.map((list) => {
                return <ListingItem listing={list} key={list._id} />;
              })}
            </AnimatePresence>
          )}
        </motion.div>
        {showMore && (
          <button
            onClick={onShowMore}
            className="text-slate-800 p-5 w-full rounded-lg text-center font-bold cursor-pointer hover:underline"
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
