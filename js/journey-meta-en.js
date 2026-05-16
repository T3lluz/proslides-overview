/* English metadata for flow diagram nodes */
window.JOURNEY_NODE_META_EN = {
  visit: {
    title: 'User visits app',
    desc: 'Entry point for all users.',
    meta: { URL: '/', Komponent: 'Landing' },
    active: true
  },
  has: {
    title: 'Has account?',
    desc: 'Register or sign in.',
    meta: { Nei: 'register', Ja: 'login' }
  },
  register: {
    title: 'Register',
    desc: 'New user with email and password.',
    meta: { Endepunkt: 'POST /api/v1/auth/register' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/auth_controller.rb'
  },
  valid: {
    title: 'Valid input?',
    desc: 'Server-side validation.',
    meta: { Nei: 'error', Ja: 'JWT' }
  },
  val_err: {
    title: 'Show validation errors',
    desc: 'Field errors shown in UI.',
    meta: { Handling: 'Loop' }
  },
  login_m: {
    title: 'Sign-in method',
    desc: 'Email/password or OAuth.',
    meta: { 'E-post': 'login', OAuth: 'callback' }
  },
  post_login: {
    title: 'POST /auth/login',
    desc: 'Returns JWT on valid login.',
    meta: { Endepunkt: 'POST /api/v1/auth/login' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/auth_controller.rb'
  },
  creds: {
    title: 'Credentials OK?',
    desc: 'bcrypt verification.',
    meta: { Nei: 'error', Ja: 'JWT' }
  },
  oauth: {
    title: 'GET /auth/:provider/callback',
    desc: 'OAuth via Google/GitHub.',
    meta: { Endepunkt: 'GET /api/v1/auth/:provider/callback' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/config/initializers/omniauth.rb'
  },
  oauth_ok: {
    title: 'OAuth OK?',
    desc: 'Links provider+uid.',
    meta: { Nei: 'error', Ja: 'JWT' }
  },
  auth_err: {
    title: 'Show error',
    desc: 'Login/OAuth error.',
    meta: { Handling: 'Loop' }
  },
  jwt: {
    title: 'JWT issued',
    desc: 'Bearer token in localStorage.',
    meta: { Lagring: 'localStorage' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/services/json_web_token.rb'
  },
  dashboard: {
    title: 'Dashboard',
    desc: 'Main hub after sign-in.',
    meta: { API: 'GET /api/v1/presentations' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/tree/main/frontend/src'
  },
  action: {
    title: 'Action?',
    desc: 'Delete, create or edit.',
    meta: { Delete: 'DELETE', Create: 'POST', Edit: 'editor' }
  },
  delete: {
    title: 'Delete',
    desc: 'Deletes presentation.',
    meta: { Endepunkt: 'DELETE /api/v1/presentations/:id' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/presentations_controller.rb'
  },
  create: {
    title: 'Create',
    desc: 'New presentation + slides.',
    meta: { Endepunkt: 'POST /api/v1/presentations' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/presentations_controller.rb'
  },
  editor: {
    title: 'Open editor',
    desc: 'PresentationEditor.',
    meta: { Endepunkt: 'GET /api/v1/presentations/:id' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/tree/main/frontend/src/features/editor'
  },
  patch: {
    title: 'Edit slides',
    desc: 'Save and return to dashboard.',
    meta: { Endepunkt: 'PATCH /api/v1/presentations/:id' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/tree/main/frontend/src/features/editor'
  },
  profil: {
    title: 'Profile?',
    desc: 'Name or password.',
    meta: { Profil: 'PATCH profile', Passord: 'PATCH password' }
  },
  prof_name: {
    title: 'Update name',
    desc: 'Display name.',
    meta: { Endepunkt: 'PATCH /api/v1/auth/profile' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/auth_controller.rb'
  },
  prof_pw: {
    title: 'Change password',
    desc: 'New password hash.',
    meta: { Endepunkt: 'PATCH /api/v1/auth/password' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/auth_controller.rb'
  },
  logout: {
    title: 'Sign out',
    desc: 'Token removed.',
    meta: { Endepunkt: 'POST /api/v1/auth/logout' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/auth_controller.rb'
  },
  go_live: {
    title: 'Go live',
    desc: 'Session + LIVE code.',
    meta: { Endepunkt: 'POST /api/v1/presentations/:id/start' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/presentations_controller.rb'
  },
  start: {
    title: 'Start live session',
    desc: 'PresentationSession created.',
    meta: { Modell: 'PresentationSession' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/models/presentation_session.rb'
  },
  lobby_p: {
    title: 'Session lobby',
    desc: 'Waiting for participants — participant_joined.',
    meta: { Komponent: 'SessionLobby.tsx' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/frontend/src/features/live/SessionLobby.tsx'
  },
  pres_start: {
    title: 'Presenter starts',
    desc: 'LivePresentationHost.',
    meta: { Komponent: 'LivePresentationHost.tsx' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/frontend/src/features/live/LivePresentationHost.tsx'
  },
  navigate: {
    title: 'Navigate slides',
    desc: 'WebSocket broadcast slide_change.',
    meta: { Event: 'slide_change' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/channels/presentation_channel.rb'
  },
  poll: {
    title: 'Activate poll?',
    desc: 'Poll on active slide.',
    meta: { Ja: 'vote → results', Nei: 'continue' }
  },
  vote: {
    title: 'Participant votes',
    desc: 'PollResponse.',
    meta: { Endepunkt: 'POST /api/v1/polls/:id/vote' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/polls_controller.rb'
  },
  results: {
    title: 'Live results',
    desc: 'poll_results to audience.',
    meta: { Endepunkt: 'GET /api/v1/polls/:id/results' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/polls_controller.rb'
  },
  end_sess: {
    title: 'End session',
    desc: 'Manual end.',
    meta: { Endepunkt: 'POST /api/v1/presentations/:id/end_session' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/presentations_controller.rb'
  },
  cleanup: {
    title: 'Session cleanup',
    desc: 'Guests deleted, is_live = false.',
    meta: { Status: 'is_live = false' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/presentations_controller.rb'
  },
  broadcast_end: {
    title: 'Broadcast session_ended',
    desc: 'All receive event via ActionCable.',
    meta: { Event: 'session_ended' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/channels/presentation_channel.rb'
  },
  term_login: {
    title: 'Back to sign-in',
    desc: 'After logout or ended session.',
    meta: { Token: 'Removed' }
  },
  part_open: {
    title: 'Participant opens app',
    desc: 'Join page for audience.',
    meta: { Komponent: 'JoinPage.tsx' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/frontend/src/features/live/JoinPage.tsx'
  },
  part_auth: {
    title: 'Auth status?',
    desc: 'Guest or signed-in user.',
    meta: { Gjest: 'guest_join', Innlogget: 'join_by_code' }
  },
  guest: {
    title: 'Guest: join code',
    desc: 'Creates guest + JWT.',
    meta: { Endepunkt: 'POST /api/v1/sessions/guest_join' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/sessions_controller.rb'
  },
  user_join: {
    title: 'Signed in: join',
    desc: 'Existing user joins session.',
    meta: { Endepunkt: 'POST /api/v1/sessions/join_by_code' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/controllers/api/v1/sessions_controller.rb'
  },
  lobby_a: {
    title: 'Session lobby (participant)',
    desc: 'Receives slide_change and poll_results.',
    meta: { Komponent: 'LivePresentationAudience' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/frontend/src/features/live/LivePresentationAudience.tsx'
  },
  part_joined: {
    title: 'Broadcast participant_joined',
    desc: 'Notifies presenter lobby.',
    meta: { Event: 'participant_joined' },
    href: 'https://github.com/Baitedr/Bachelor_Gruppe1/blob/main/backend/app/channels/presentation_channel.rb'
  },
  part_out: {
    title: 'Participant disconnected',
    desc: 'On session_ended.',
    meta: { Event: 'session_ended' }
  }
};
