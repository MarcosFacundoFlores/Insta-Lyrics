

export default async function handler(req, res) {
  const mbid = req.query.mbid
  if (!mbid) return res.status(400).json({ error: 'Missing mbid parameter' })

  try {
    const recordingRes = await fetch(`https://musicbrainz.org/ws/2/recording/${mbid}?inc=releases&fmt=json`, {
      headers: { 'User-Agent': 'InstaLyricsApp/1.0' },
    })
    const recordingData = await recordingRes.json()
    const release = recordingData.releases?.[0]

    if (!release?.id) {
      return res.status(404).json({ error: 'No release found for this recording' })
    }

    // Buscar carátula del release
    const coverRes = await fetch(`https://coverartarchive.org/release/${release.id}`)
    const coverData = await coverRes.json()
    const image = coverData.images?.[0]?.image

    if (image) {
      return res.status(200).json({ image })
    } else {
      return res.status(404).json({ error: 'No cover image found' })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
