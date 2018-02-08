import Album from './Album.js'

/**
 * Container of an artist infromation.
 */
export default class Artist {
  /**
   * Initialize instance.
   *
   * @param {string} name Artist name.
   */
  constructor (name) {
    /**
     * Artist name.
     * @type {string}
     */
    this._name = name

    /**
     * Artist albums.
     * @type {Album[]}
     */
    this._albums = []

    /**
     * Path of the image file.
     * @type {string}
     */
    this._image = null
  }

  /**
   * Compare the artist.
   *
   * @param {Artist} a The first artist to compare.
   * @param {Artist} b The second artist to compare.
   *
   * @return {number} -1 = first is less than second, 0 = first equals second, first is greater than second.
   */
  static compare (a, b) {
    const nameA = a.name.toLowerCase().replace('the ', '')
    const nameB = b.name.toLowerCase().replace('the ', '')

    return (nameA === nameB ? 0 : (nameA < nameB ? -1 : 1))
  }

  /**
   * Create the artists from musics.
   *
   * @param {Music[]} musics Musics.
   *
   * @return {Artist[]} Artists.
   */
  static fromMusics (musics) {
    const artists = []
    musics.forEach((music) => {
      let artist = Artist.findByMusic(artists, music)
      if (!(artist)) {
        artist = new Artist(music.artist)
        artists.push(artist)
      }

      let album = Album.findByMusic(artist.albums, music)
      if (album) {
        album.add(music)
      } else {
        album = new Album(artist.name, music.album)
        album.add(music)
        artist.add(album)
      }
    })

    return artists.sort(Artist.compare)
  }

  /**
   * Find the artist by music.
   *
   * @param {Artist[]} artists Artists.
   * @param {Music} music  Music.
   *
   * @return {Album} Success is artist, Otherwise null.
   */
  static findByMusic (artists, music) {
    let result = null
    artists.some((artist) => {
      if (music.artist === artist.name) {
        result = artist
        return true
      }

      return false
    })

    return result
  }

  /**
   * Get the artist albums.
   *
   * @return {Album[]} albums.
   */
  get albums () {
    return this._albums
  }

  /**
   * Get the artist name.
   *
   * @return {string} name.
   */
  get name () {
    return this._name
  }

  /**
   * Get the artist image.
   *
   * @return {string} Path of the image file.
   */
  get image () {
    return this._image
  }

  /**
   * Add the album.
   *
   * @param {Album} album Album.
   *
   * @return {boolean} Success is true.
   */
  add (album) {
    if (album.artist !== this._name) {
      return false
    }

    this._albums.push(album)
    this._albums = this._albums.sort(Album.compare)

    this.updateImage()

    return true
  }

  /**
   * Remove the album
   *
   * @param {Album} album Album.
   *
   * @return {boolean} Success is true.
   */
  remove (album) {
    const albums = this._albums.filter((a) => {
      return (a.name !== album.name)
    })

    if (albums.length === this._albums.length) {
      return false
    }

    this._albums = albums
    this.updateImage()

    return true
  }

  /**
   * Update the album image.
   */
  updateImage () {
    const updated = this._albums.some((album) => {
      if (album.image) {
        this._image = album.image
        return true
      }

      return false
    })

    if (!(updated)) {
      this._image = null
    }
  }
}
