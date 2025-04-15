export type PlaylistDTO = {
  name: string;
};

export type DiffPlaylists = {
  playlistId: number;
  musicFlag: boolean;
};

export type DiffPlaylistsDTO = {
  playlists: DiffPlaylists[];
};

export type PutPlaylistDTO = {
  name: string;
};
