import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/UserSlice";
import {useNavigate} from 'react-router-dom'

export const OAuth = () => {
    const navigate=useNavigate()
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const data = await fetch("https://real-estate-market-backend.onrender.com/api/v1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          image: result.user.photoURL,
        }),
      });
      const res = await data.json();

      dispatch(signInSuccess(res));
      navigate('/')
    } catch (error) {
      throw new Error("Something went wrong");
    }
  };
  return (
    <button
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:bg-red-800"
      onClick={handleGoogleClick}
    >
      Continue with google
    </button>
  );
};
