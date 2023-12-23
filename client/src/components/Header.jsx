import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("search", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get("search");
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [window.location.search]);
  return (
    <header className="bg-slate-500 shadow-md">
      <div className="flex justify-between items-center max-w-8xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-xl sm:text-3xl flex flex-wrap gap-1">
            <span className=" text-slate-300">Naz</span>
            <span className=" text-slate-700">State</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center mx-300"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-34 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-6 font-bold">
          <Link to="/">
            {" "}
            <li className="hidden sm:inline text-slate-100 hover:underline cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            {" "}
            <li className="hidden sm:inline text-slate-100 hover:underline cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="Profile"
              ></img>
            ) : (
              <li className=" text-slate-100 hover:underline cursor-pointer">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
