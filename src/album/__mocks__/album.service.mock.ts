export const fakeApiResponse = {
  id: 1,
  title: 'test album',
  cover_xl: 'cover.jpg',
  nb_tracks: 10,
  artist: {
    id: 2,
    name: 'test artist',
    picture_xl: 'artist.jpg',
  },
  tracks: {
    data: [
      {
        id: 100,
        title: 'test song',
        duration: 120,
        preview: 'preview.mp3',
        album: { cover_xl: 'song_cover.jpg' },
      },
    ],
  },
};

export const mockApiResponse = {
  data: [
    {
      artist: { name: 'test artist' },
      cover_xl: 'cover.jpg',
      id: 1,
      title: 'test album',
    },
  ],
};

// エラーオブジェクトをモック化する
export const mockErrorResponse = new Error('API失敗');

export const mockResponse = [
  {
    artist: { name: 'test artist' },
    cover_xl: 'cover.jpg',
    id: 1,
    title: 'test album',
  },
];
