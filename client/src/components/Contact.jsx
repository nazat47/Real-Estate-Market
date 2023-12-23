import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [emailData, setEmailData] = useState({
    message: "",
    from: "",
  });
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/v1/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [listing.userRef]);
  const handleEmail = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/v1/user/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });
    const data = await res.json();
    if (data) {
      setMsg("Email sent");
    }
  };
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p className="text-lg">
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for
            <span className="font-semibold"> {listing.name}</span>
          </p>
          <input
            type="text"
            id="from"
            placeholder="Enter your email"
            onChange={(e) =>
              setEmailData({ ...emailData, from: e.target.value })
            }
          ></input>
          <textarea
            name="message"
            id="message"
            rows={2}
            value={emailData.message}
            onChange={(e) =>
              setEmailData({ ...emailData, message: e.target.value })
            }
            placeholder="Enter you message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>
          {/* <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 
            uppercase rounded-lg hover:bg-slate-900"
          > */}
          <button
            onClick={handleEmail}
            className="bg-slate-700 text-white text-center p-3 
            uppercase rounded-lg hover:bg-slate-900"
          >
            Send Message
          </button>
          {msg && <p className="text-green-800">Email sent</p>}
          {/* </Link> */}
        </div>
      )}
    </div>
  );
};

export default Contact;
