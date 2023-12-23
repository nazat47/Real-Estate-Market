import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutUserFailure,
  logoutUserStart,
  logoutUserSuccess,
} from "../redux/user/UserSlice";
import { useDispatch } from "react-redux";
// firebase storage
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write:if
//       request.resource.size<2*1024*1024 &&
//       request.resource.contentType.matches('image/.*')
//     }
//   }
// }
const Profile = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [filePerc, setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListError, setShowListError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    console.log(formData);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`https://real-estate-market-backend.onrender.com/api/v1/user/updateuser/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.msg) {
        dispatch(updateUserFailure(data.msg));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDelete = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/v1/user/deleteuser/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.msg) {
        dispatch(deleteUserFailure(data.msg));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleLogout = async () => {
    try {
      dispatch(logoutUserStart());
      const res = await fetch("/api/v1/auth/logout");
      const data = await res.json();
      if (data.msg) {
        dispatch(logoutUserFailure(data.msg));
        return;
      }
      dispatch(logoutUserSuccess());
    } catch (error) {
      dispatch(logoutUserFailure(error.message));
    }
  };
  const handleShowListing = async () => {
    try {
      setShowListError(false);
      const res = await fetch(`/api/v1/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.msg) {
        setShowListError(true);
      }
      setUserListing(data);
    } catch (error) {
      setShowListError(true);
    }
  };
  const handleDeleteListing=async(id)=>{
    try {
      const res=await fetch(`/api/v1/listing/${id}`,{
        method:"DELETE"
      })
      const data=await res.json();
      setUserListing(prev=>prev.filter(list=>list._id!==id))
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center m-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        ></input>
        <img
          src={formData.avatar || currentUser.avatar}
          alt="User"
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        ></img>
        <p className="text-sm self-center">
          {fileError ? (
            <span className="text-red-700">
              Error image upload ( must be less then 2MB )
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            !fileError && (
              <span className="text-green-700">Successfully uploaded</span>
            )
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.password}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-800 text-white font-bold rounded-lg p-3 uppercase hover:bg-slate-900 "
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 font-bold text-white p-3 rounded-lg uppercase text-center hover:bg-green-800"
          to="/createlisting"
        >
          Create Listings
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-900 cursor-pointer font-bold"
          onClick={handleDelete}
        >
          Delete Account
        </span>
        <span
          className="text-red-900 cursor-pointer font-bold"
          onClick={handleLogout}
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-50">{error ? error : ""}</p>
      <p className="text-green-700 mt-50">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
      <button
        onClick={handleShowListing}
        className="text-green-700 w-full font-bold mt-3 p-2 border border-green-700 rounded-lg"
      >
        Show Listings
      </button>
      {showListError && <p>Something went wrong</p>}
      {userListing && userListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-slate-800 mt-7 text-2xl font-semibold">Your Listings</h1>

          {userListing.map((list) => {
            return (
              <div
                key={list._id}
                className="border gap-4 rounded-lg p-3 flex justify-between items-center"
              >
                <Link to={`/listing/${list._id}`}>
                  <img
                    src={list.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-cover rounded-lg"
                  ></img>
                </Link>
                <Link
                  className="flex-1 hover:underline truncate"
                  to={`/listing/${list._id}`}
                >
                  <p className="text-slate-800 font-bold">{list.name}</p>
                </Link>
                <div className="flex gap-3">
                  <Link to={`/updatelisting/${list._id}`}>
                  <button className="text-blue-900 font-semibold uppercase">
                    Edit
                  </button>
                  </Link>
                  <button onClick={()=>handleDeleteListing(list._id)} className="text-red-700 font-semibold uppercase">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
