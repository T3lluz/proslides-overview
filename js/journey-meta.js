/* Metadata for flytdiagram-noder — brukes av journey-mermaid.js og detaljpanelet */
window.JOURNEY_NODE_META = {
  visit: {
    title: 'Bruker besøker app',
    desc: 'Inngangspunkt for alle brukere.',
    meta: { URL: '/', Komponent: 'Landing' },
    active: true
  },
  has: {
    title: 'Har konto?',
    desc: 'Registrering eller innlogging.',
    meta: { Nei: 'register', Ja: 'login' }
  },
  register: {
    title: 'Registrer',
    desc: 'Ny bruker med e-post og passord.',
    meta: { Endepunkt: 'POST /api/v1/auth/register' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/auth_controller.rb'
  },
  valid: {
    title: 'Gyldig input?',
    desc: 'Validering på server.',
    meta: { Nei: 'feil', Ja: 'JWT' }
  },
  val_err: {
    title: 'Vis valideringsfeil',
    desc: 'Feltfeil vises i UI.',
    meta: { Handling: 'Loop' }
  },
  login_m: {
    title: 'Innloggingsmetode',
    desc: 'E-post/passord eller OAuth.',
    meta: { 'E-post': 'login', OAuth: 'callback' }
  },
  post_login: {
    title: 'POST /auth/login',
    desc: 'Returnerer JWT ved gyldig login.',
    meta: { Endepunkt: 'POST /api/v1/auth/login' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/auth_controller.rb'
  },
  creds: {
    title: 'Credentials OK?',
    desc: 'bcrypt-verifisering.',
    meta: { Nei: 'feil', Ja: 'JWT' }
  },
  oauth: {
    title: 'GET /auth/:provider/callback',
    desc: 'OAuth via Google/GitHub.',
    meta: { Endepunkt: 'GET /api/v1/auth/:provider/callback' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/config/initializers/omniauth.rb'
  },
  oauth_ok: {
    title: 'OAuth OK?',
    desc: 'Kobler provider+uid.',
    meta: { Nei: 'feil', Ja: 'JWT' }
  },
  auth_err: {
    title: 'Vis feil',
    desc: 'Feil ved login/OAuth.',
    meta: { Handling: 'Loop' }
  },
  jwt: {
    title: 'JWT utstedt',
    desc: 'Bearer-token i localStorage.',
    meta: { Lagring: 'localStorage' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/services/json_web_token.rb'
  },
  dashboard: {
    title: 'Dashboard',
    desc: 'Hovedhub etter innlogging.',
    meta: { API: 'GET /api/v1/presentations' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/tree/main/frontend/src'
  },
  action: {
    title: 'Handling?',
    desc: 'Slett, opprett eller rediger.',
    meta: { Delete: 'DELETE', Create: 'POST', Edit: 'editor' }
  },
  delete: {
    title: 'Slett',
    desc: 'Sletter presentasjon.',
    meta: { Endepunkt: 'DELETE /api/v1/presentations/:id' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/presentations_controller.rb'
  },
  create: {
    title: 'Opprett',
    desc: 'Ny presentasjon + slides.',
    meta: { Endepunkt: 'POST /api/v1/presentations' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/presentations_controller.rb'
  },
  editor: {
    title: 'Åpne editor',
    desc: 'PresentationEditor.',
    meta: { Endepunkt: 'GET /api/v1/presentations/:id' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/tree/main/frontend/src/features/editor'
  },
  patch: {
    title: 'Rediger slides',
    desc: 'Lagre og tilbake til dashboard.',
    meta: { Endepunkt: 'PATCH /api/v1/presentations/:id' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/tree/main/frontend/src/features/editor'
  },
  profil: {
    title: 'Profil?',
    desc: 'Navn eller passord.',
    meta: { Profil: 'PATCH profile', Passord: 'PATCH password' }
  },
  prof_name: {
    title: 'Oppdater navn',
    desc: 'Visningsnavn.',
    meta: { Endepunkt: 'PATCH /api/v1/auth/profile' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/auth_controller.rb'
  },
  prof_pw: {
    title: 'Endre passord',
    desc: 'Nytt passordhash.',
    meta: { Endepunkt: 'PATCH /api/v1/auth/password' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/auth_controller.rb'
  },
  logout: {
    title: 'Logg ut',
    desc: 'Token fjernes.',
    meta: { Endepunkt: 'POST /api/v1/auth/logout' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/auth_controller.rb'
  },
  go_live: {
    title: 'Gå live',
    desc: 'Session + LIVE-kode.',
    meta: { Endepunkt: 'POST /api/v1/presentations/:id/start' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/presentations_controller.rb'
  },
  start: {
    title: 'Start live-økt',
    desc: 'PresentationSession opprettes.',
    meta: { Modell: 'PresentationSession' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/models/presentation_session.rb'
  },
  lobby_p: {
    title: 'Sesjonslobby',
    desc: 'Venter på deltakere — participant_joined.',
    meta: { Komponent: 'SessionLobby.tsx' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/frontend/src/features/live/SessionLobby.tsx'
  },
  pres_start: {
    title: 'Presentatør starter',
    desc: 'LivePresentationHost.',
    meta: { Komponent: 'LivePresentationHost.tsx' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/frontend/src/features/live/LivePresentationHost.tsx'
  },
  navigate: {
    title: 'Naviger slides',
    desc: 'WebSocket broadcast slide_change.',
    meta: { Event: 'slide_change' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/channels/presentation_channel.rb'
  },
  poll: {
    title: 'Aktiver poll?',
    desc: 'Poll på aktiv slide.',
    meta: { Ja: 'vote → results', Nei: 'fortsett' }
  },
  vote: {
    title: 'Deltaker stemmer',
    desc: 'PollResponse.',
    meta: { Endepunkt: 'POST /api/v1/polls/:id/vote' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/polls_controller.rb'
  },
  results: {
    title: 'Live-resultater',
    desc: 'poll_results til publikum.',
    meta: { Endepunkt: 'GET /api/v1/polls/:id/results' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/polls_controller.rb'
  },
  end_sess: {
    title: 'Avslutt økt',
    desc: 'Manuell avslutning.',
    meta: { Endepunkt: 'POST /api/v1/presentations/:id/end_session' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/presentations_controller.rb'
  },
  cleanup: {
    title: 'Sesjonsopprydding',
    desc: 'Gjester slettes, is_live = false.',
    meta: { Status: 'is_live = false' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/presentations_controller.rb'
  },
  broadcast_end: {
    title: 'Broadcast session_ended',
    desc: 'Alle mottar event via ActionCable.',
    meta: { Event: 'session_ended' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/channels/presentation_channel.rb'
  },
  term_login: {
    title: 'Tilbake til innlogging',
    desc: 'Etter logout eller avsluttet økt.',
    meta: { Token: 'Fjernet' }
  },
  part_open: {
    title: 'Deltaker åpner app',
    desc: 'Join-side for publikum.',
    meta: { Komponent: 'JoinPage.tsx' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/frontend/src/features/live/JoinPage.tsx'
  },
  part_auth: {
    title: 'Auth-status?',
    desc: 'Gjest eller innlogget bruker.',
    meta: { Gjest: 'guest_join', Innlogget: 'join_by_code' }
  },
  guest: {
    title: 'Gjest: join-kode',
    desc: 'Oppretter gjest + JWT.',
    meta: { Endepunkt: 'POST /api/v1/sessions/guest_join' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/sessions_controller.rb'
  },
  user_join: {
    title: 'Innlogget: bli med',
    desc: 'Eksisterende bruker kobler til økt.',
    meta: { Endepunkt: 'POST /api/v1/sessions/join_by_code' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/sessions_controller.rb'
  },
  lobby_a: {
    title: 'Sesjonslobby (deltaker)',
    desc: 'Mottar slide_change og poll_results.',
    meta: { Komponent: 'LivePresentationAudience' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/frontend/src/features/live/LivePresentationAudience.tsx'
  },
  part_joined: {
    title: 'Broadcast participant_joined',
    desc: 'Varsler presentatørlobby.',
    meta: { Event: 'participant_joined' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/channels/presentation_channel.rb'
  },
  part_out: {
    title: 'Deltaker frakoblet',
    desc: 'Ved session_ended.',
    meta: { Event: 'session_ended' }
  }
};
