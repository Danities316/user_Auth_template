import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Photo from "./photo";

function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarURL] = useState(null);

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      let { data, err } = await supabase
        .form("profiles")
        .select("username, website, avatar_url")
        .eq("id", user_id)
        .single();

      if (err) {
        console.log(err);
      } else if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarURL(data.avatar_url);
      }
      setLoading(false);
    }
    getProfile();
  }, [session]);

  const updateProfile = async (e) => {
    e.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url,
      updated_at: new Date(),
    };

    let { err } = await supabase.from("profiles").upsert(updates);

    if (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={updateProfile} className="form-widget">
        <Photo
          url={avatar_url}
          size={150}
          onUpload={(event, url) => {
            setAvatarURL(url);
            updateProfile(event);
          }}
        />
      </form>
      <form className="form-widget" onSubmit={updateProfile}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session.user.email} disabled />
        </div>
        <div>
          <label htmlFor="username">Name</label>
          <input
            id="username"
            type="text"
            required
            value= ""
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="website"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <button
            className="button block primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </div>
        <div>
          <button
            className="button block"
            type="button"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </form>
    </>
  );
}

export default Account;
