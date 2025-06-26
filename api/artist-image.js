import 'dotenv/config'

export default async function handler(req, res) {
  const mbid = req.query.mbid;

  if (!mbid) {
    return res.status(400).json({ error: "Missing mbid parameter" });
  }

  try {
    const mbUrl = `https://musicbrainz.org/ws/2/artist/${mbid}?inc=url-rels&fmt=json`;
    const mbRes = await fetch(mbUrl, {
      headers: {
        "User-Agent": "InstaLyricsApp/1.0 (contacto@tudominio.com)",
      },
    });

    if (!mbRes.ok) throw new Error("MusicBrainz fetch failed");

    const mbData = await mbRes.json();
    const relations = mbData.relations || [];
    const image = await resolveImageFromRelations(
      mbData.relations || [],
      mbData.name
    );

    if (image) return res.status(200).json({ image });
    return res.status(404).json({ error: "Image not found" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function resolveImageFromRelations(relations, artistName) {
  // 1. Wikidata → P18
  const wikidata = relations.find((r) => r.type === "wikidata");
  if (wikidata?.url?.resource) {
    const id = wikidata.url.resource.split("/").pop();
    try {
      const res = await fetch(
        `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`
      );
      const data = await res.json();
      const filename =
        data.entities[id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
      if (filename) {
        // Redirección para obtener la URL real
        const redirectUrl = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(
          filename
        )}`;
        const redirectRes = await fetch(redirectUrl, { redirect: "follow" });
        if (redirectRes.ok) {
          return redirectRes.url;
        }
      }
    } catch (e) {
      console.warn("Wikidata error", e);
    }
  }

  // 2. Wikipedia
  const wikipedia = relations.find((r) => r.type === "wikipedia");
  if (wikipedia?.url?.resource) {
    const title = wikipedia.url.resource.split("/").pop();
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
      );
      const data = await res.json();
      if (data?.thumbnail?.source) return data.thumbnail.source;
    } catch (e) {
      console.warn("Wikipedia error", e);
    }
  }

  // 3. type: image
  const imageRel = relations.find((r) => r.type === "image");
  if (imageRel?.url?.resource?.includes("commons.wikimedia.org/wiki/File:")) {
    const filename = imageRel.url.resource.split("/").pop();
    return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(
      filename
    )}`;
  }

  // 4. type: LastFM
  try {
    const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
    const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(
      artistName
    )}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("LastFM fetch failed");
    const data = await res.json();

    const albums = data?.topalbums?.album;
    if (!albums || albums.length === 0) return null;

    const album = albums[0];
    const imageObj = album.image.find((img) => img.size === "extralarge") ||
                     album.image.find((img) => img.size === "large");

    if (imageObj && imageObj["#text"]) return imageObj["#text"];
  } catch (e) {
    console.warn("LastFM error", e);
  }


  return null;
}
