#!/usr/bin/env python3
"""Flytdiagram — spaced layout, anchor-based edges, synced node geometry."""
from pathlib import Path

W, H = 1680, 1520
GH = "https://github.com/Baitedr/Bachelor_Gruppe1"
GUTTER_L, GUTTER_R = 16, W - 16
NODE_H = 56
STACK = 74  # center-to-center for stacked rects (NODE_H + 18 gap)

# Group bounds (x, y, w, h) — labels sit in top padding
GROUPS = {
    "auth": (20, 20, 1020, 548),
    "dash": (20, 582, 1020, 548),
    "live": (1050, 582, 610, 548),
    "part": (20, 1148, 740, 360),
}


def rect_node(x, y, w, h, title, subs, desc, meta, href=None, extra=""):
    href_attr = f' data-node-href="{href}"' if href else ""
    sub_lines = "".join(
        f'<text class="diagram-node-sub" x="{x + 12}" y="{y + 36 + i * 15}">{s}</text>'
        for i, s in enumerate(subs)
    )
    return f'''                  <g class="diagram-node{extra}" data-node-title="{title}"{href_attr}
                     data-node-desc="{desc}"
                     data-node-meta='{meta}'>
                    <rect class="diagram-node-bg" x="{x}" y="{y}" width="{w}" height="{h}" rx="10"/>
                    <text class="diagram-node-title" x="{x + 12}" y="{y + 22}">{title}</text>
{sub_lines}
                  </g>'''


def diamond(cx, cy, half, title, desc, meta, extra=""):
    pts = f"{cx},{cy - half} {cx + half},{cy} {cx},{cy + half} {cx - half},{cy}"
    return f'''                  <g class="diagram-node diagram-node-decision{extra}" data-node-title="{title}"
                     data-node-desc="{desc}"
                     data-node-meta='{meta}'>
                    <polygon class="diagram-node-bg" points="{pts}"/>
                    <text class="diagram-node-title diagram-node-title-center" x="{cx}" y="{cy + 4}">{title}</text>
                  </g>'''


def terminal(cx, cy, rx, ry, title, desc, meta, href=None, extra=""):
    href_attr = f' data-node-href="{href}"' if href else ""
    return f'''                  <g class="diagram-node diagram-node-terminal{extra}" data-node-title="{title}"{href_attr}
                     data-node-desc="{desc}"
                     data-node-meta='{meta}'>
                    <ellipse class="diagram-node-bg" cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/>
                    <text class="diagram-node-title diagram-node-title-center" x="{cx}" y="{cy + 4}">{title}</text>
                  </g>'''


class Box:
    __slots__ = ("x", "y", "w", "h", "cx", "cy")

    def __init__(self, x, y, w, h):
        self.x, self.y, self.w, self.h = x, y, w, h
        self.cx, self.cy = x + w / 2, y + h / 2

    def port(self, side):
        if side == "t":
            return (self.cx, self.y)
        if side == "b":
            return (self.cx, self.y + self.h)
        if side == "l":
            return (self.x, self.cy)
        if side == "r":
            return (self.x + self.w, self.cy)
        return (self.cx, self.cy)


class DBox:
    __slots__ = ("cx", "cy", "half")

    def __init__(self, cx, cy, half):
        self.cx, self.cy, self.half = cx, cy, half

    def port(self, side):
        if side == "t":
            return (self.cx, self.cy - self.half)
        if side == "b":
            return (self.cx, self.cy + self.half)
        if side == "l":
            return (self.cx - self.half, self.cy)
        if side == "r":
            return (self.cx + self.half, self.cy)
        return (self.cx, self.cy)


class EBox:
    __slots__ = ("cx", "cy", "rx", "ry")

    def __init__(self, cx, cy, rx, ry):
        self.cx, self.cy, self.rx, self.ry = cx, cy, rx, ry

    def port(self, side):
        if side == "t":
            return (self.cx, self.cy - self.ry)
        if side == "b":
            return (self.cx, self.cy + self.ry)
        if side == "l":
            return (self.cx - self.rx, self.cy)
        if side == "r":
            return (self.cx + self.rx, self.cy)
        return (self.cx, self.cy)


def route(a, b, start_side, end_side, bus_x=None, bus_y=None):
    p1 = a.port(start_side)
    p2 = b.port(end_side)
    pts = [p1]
    if bus_x is not None:
        pts.append((bus_x, p1[1]))
        pts.append((bus_x, p2[1]))
    elif bus_y is not None:
        pts.append((p1[0], bus_y))
        pts.append((p2[0], bus_y))
    elif start_side in ("l", "r") and end_side in ("l", "r"):
        mid_x = (p1[0] + p2[0]) / 2
        pts.append((mid_x, p1[1]))
        pts.append((mid_x, p2[1]))
    elif start_side in ("t", "b") and end_side in ("t", "b"):
        mid_y = (p1[1] + p2[1]) / 2
        pts.append((p1[0], mid_y))
        pts.append((p2[0], mid_y))
    else:
        if start_side in ("b", "t"):
            pts.append((p1[0], p2[1]))
        else:
            pts.append((p2[0], p1[1]))
    pts.append(p2)
    clean = [pts[0]]
    for p in pts[1:]:
        if p != clean[-1]:
            clean.append(p)
    if len(clean) < 2:
        return ""
    return "M" + " L".join(f"{x} {y}" for x, y in clean)


def edge_g(paths):
    lines = "\n".join(f'                    <path d="{p}"/>' for p in paths)
    return f'''                  <g class="diagram-edge" stroke-linecap="round" marker-end="url(#arr-journey)">
{lines}
                  </g>'''


def edge_ws_g(paths):
    lines = "\n".join(f'                    <path d="{p}"/>' for p in paths)
    return f'''                  <g class="diagram-edge diagram-edge-ws" stroke-linecap="round" marker-end="url(#arr-journey)">
{lines}
                  </g>'''


def lbl(x, y, t, anchor=None):
    cls = ' class="diagram-edge-label diagram-edge-label-end"' if anchor == "end" else ""
    anch = f' text-anchor="{anchor}"' if anchor else ""
    return f'                  <text{cls} x="{x}" y="{y}"{anch}>{t}</text>'


def lbl_bus(bus_x, y1, y2, text):
    return lbl(bus_x - 10, (y1 + y2) / 2 + 4, text, anchor="end")


def lbl_mid(x1, y1, x2, y2, text, dx=0, dy=0):
    return lbl((x1 + x2) / 2 + dx, (y1 + y2) / 2 + dy, text)


# --- Layout (single source of truth) ---
N = {}
# Auth
N["visit"] = EBox(540, 76, 108, 22)
N["has_account"] = DBox(540, 156, 54)
N["register"] = Box(48, 236, 200, NODE_H)
N["valid"] = DBox(148, 368, 50)
N["val_err"] = Box(48, 428, 200, 52)
N["login_m"] = DBox(448, 236, 52)
N["post_login"] = Box(388, 316, 228, NODE_H)
N["creds"] = DBox(502, 444, 50)
N["oauth"] = Box(800, 316, 248, NODE_H)
N["oauth_ok"] = DBox(924, 444, 50)
N["auth_err"] = Box(572, 428, 200, 52)
N["jwt"] = Box(500, 512, 268, NODE_H)

# Dashboard
N["dashboard"] = Box(520, 608, 248, NODE_H)
N["action"] = DBox(168, 768, 50)
BUS_CRUD = 148
N["delete"] = Box(48, 844, 200, NODE_H)
N["create"] = Box(48, 844 + STACK, 200, NODE_H)
N["editor"] = Box(48, 844 + STACK * 2, 200, NODE_H)
N["patch"] = Box(48, 844 + STACK * 3, 200, NODE_H)
N["profil"] = DBox(712, 788, 50)
N["prof_name"] = Box(468, 876, 200, NODE_H)
N["prof_pw"] = Box(848, 876, 200, NODE_H)
N["logout"] = Box(968, 608, 188, NODE_H)
N["go_live"] = Box(968, 688, 208, NODE_H)

# Live presenter
N["start"] = Box(1120, 648, 228, NODE_H)
N["lobby_p"] = Box(1120, 648 + STACK, 228, NODE_H)
N["pres_start"] = Box(1120, 648 + STACK * 2, 228, NODE_H)
N["navigate"] = Box(1120, 648 + STACK * 3, 228, NODE_H)
N["poll"] = DBox(1280, 1000, 50)
N["vote"] = Box(1400, 968, 208, NODE_H)
N["results"] = Box(1400, 968 + STACK, 208, NODE_H)
N["end_sess"] = Box(880, 968, 228, NODE_H)
N["cleanup"] = Box(880, 968 + STACK, 248, 58)
N["broadcast_end"] = Box(880, 968 + STACK + 64, 248, NODE_H)
N["term_login"] = EBox(1340, 1088, 128, 22)

# Participant
N["part_open"] = EBox(228, 1188, 100, 20)
N["part_auth"] = DBox(228, 1256, 46)
N["guest"] = Box(56, 1336, 176, NODE_H)
N["user_join"] = Box(288, 1336, 200, NODE_H)
N["lobby_a"] = Box(168, 1428, 216, NODE_H)
N["part_joined"] = Box(448, 1404, 224, NODE_H)
N["part_out"] = EBox(228, 1480, 108, 20)

BUS_JWT = 498
BUS_RET = 600
BUS_PART = 1480
BUS_LOBBY_WS = 748

flow_paths = [p for p in [
    route(N["visit"], N["has_account"], "b", "t"),
    route(N["has_account"], N["register"], "l", "t"),
    route(N["has_account"], N["login_m"], "r", "t"),
    route(N["register"], N["valid"], "b", "t"),
    route(N["valid"], N["val_err"], "l", "t"),
    route(N["val_err"], N["register"], "l", "b", bus_x=GUTTER_L),
    route(N["valid"], N["jwt"], "r", "t", bus_y=BUS_JWT),
    route(N["login_m"], N["post_login"], "b", "t"),
    route(N["login_m"], N["oauth"], "r", "l"),
    route(N["post_login"], N["creds"], "b", "t"),
    route(N["creds"], N["auth_err"], "l", "r"),
    route(N["creds"], N["jwt"], "r", "t", bus_y=BUS_JWT),
    route(N["oauth"], N["oauth_ok"], "b", "t"),
    route(N["oauth_ok"], N["auth_err"], "l", "r"),
    route(N["oauth_ok"], N["jwt"], "l", "t", bus_y=BUS_JWT),
    route(N["auth_err"], N["login_m"], "t", "b", bus_x=GUTTER_R),
    route(N["jwt"], N["dashboard"], "b", "t", bus_y=582),

    route(N["dashboard"], N["action"], "l", "r"),
    route(N["action"], N["delete"], "b", "t", bus_x=BUS_CRUD),
    route(N["action"], N["create"], "b", "t", bus_x=BUS_CRUD),
    route(N["action"], N["editor"], "b", "t", bus_x=BUS_CRUD),
    route(N["editor"], N["patch"], "b", "t"),
    route(N["delete"], N["dashboard"], "l", "l", bus_y=BUS_RET),
    route(N["patch"], N["dashboard"], "l", "l", bus_y=BUS_RET),
    route(N["dashboard"], N["profil"], "b", "t"),
    route(N["profil"], N["prof_name"], "l", "t"),
    route(N["profil"], N["prof_pw"], "r", "t"),
    route(N["prof_name"], N["dashboard"], "b", "t", bus_y=BUS_RET),
    route(N["prof_pw"], N["dashboard"], "b", "t", bus_y=BUS_RET),
    route(N["dashboard"], N["logout"], "r", "l"),
    route(N["dashboard"], N["go_live"], "r", "l"),
    route(N["logout"], N["term_login"], "r", "r", bus_y=628),
    route(N["go_live"], N["start"], "r", "l"),

    route(N["start"], N["lobby_p"], "b", "t"),
    route(N["lobby_p"], N["pres_start"], "b", "t"),
    route(N["pres_start"], N["navigate"], "b", "t"),
    route(N["navigate"], N["poll"], "b", "t"),
    route(N["poll"], N["vote"], "r", "l"),
    route(N["vote"], N["results"], "b", "t"),
    route(N["results"], N["navigate"], "l", "r", bus_y=940),
    route(N["poll"], N["navigate"], "l", "r"),
    route(N["navigate"], N["end_sess"], "b", "t", bus_x=994),
    route(N["end_sess"], N["cleanup"], "b", "t"),
    route(N["cleanup"], N["broadcast_end"], "b", "t"),
    route(N["broadcast_end"], N["term_login"], "r", "l", bus_y=1068),

    route(N["part_open"], N["part_auth"], "b", "t"),
    route(N["part_auth"], N["guest"], "l", "t"),
    route(N["part_auth"], N["user_join"], "r", "t"),
    route(N["guest"], N["lobby_a"], "b", "t", bus_x=228),
    route(N["user_join"], N["lobby_a"], "b", "t", bus_x=388),
    route(N["guest"], N["part_joined"], "r", "l"),
    route(N["user_join"], N["part_joined"], "r", "l"),
    route(N["lobby_a"], N["part_out"], "b", "t"),
] if p]

ws_paths = [p for p in [
    route(N["navigate"], N["lobby_a"], "b", "t", bus_y=BUS_PART),
    route(N["results"], N["lobby_a"], "b", "t", bus_x=1620),
    route(N["broadcast_end"], N["part_out"], "l", "r", bus_y=1450),
    route(N["part_joined"], N["lobby_p"], "r", "l", bus_y=BUS_LOBBY_WS),
] if p]

# Edge labels aligned to paths / branches
a_bot = N["action"].port("b")[1]
labels_html = "\n".join([
    lbl_mid(520, 156, 48, 236, "Nei", dx=-28, dy=-6),
    lbl_mid(540, 156, 448, 236, "Ja", dx=0, dy=-6),
    lbl(108, 368, "Nei", anchor="end"),
    lbl(220, 368, "Ja"),
    lbl_mid(502, 444, 572, 428, "Nei", dx=-12, dy=0),
    lbl_mid(502, 444, 500, 512, "Ja", dx=12, dy=0),
    lbl_mid(924, 444, 572, 428, "Nei", dx=-12, dy=0),
    lbl_mid(924, 444, 500, 512, "Ja", dx=24, dy=0),
    lbl_bus(BUS_CRUD, a_bot, N["delete"].port("t")[1], "Delete"),
    lbl_bus(BUS_CRUD, a_bot, N["create"].port("t")[1], "Create"),
    lbl_bus(BUS_CRUD, a_bot, N["editor"].port("t")[1], "Edit"),
    lbl_mid(N["profil"].cx, N["profil"].cy, N["prof_name"].cx, N["prof_name"].cy, "Profil", dy=-10),
    lbl_mid(N["profil"].cx, N["profil"].cy, N["prof_pw"].cx, N["prof_pw"].cy, "Passord", dy=-10),
    lbl(N["poll"].cx + 58, N["poll"].cy - 8, "Ja"),
    lbl(N["poll"].cx - 72, N["poll"].cy + 4, "Nei", anchor="end"),
    lbl_mid(N["part_auth"].cx, N["part_auth"].cy, N["guest"].cx, N["guest"].cy, "Gjest", dy=-10),
    lbl_mid(N["part_auth"].cx, N["part_auth"].cy, N["user_join"].cx, N["user_join"].cy, "Innlogget", dy=-10),
    lbl(1180, 1468, "slide_change"),
    lbl(1540, 1468, "poll_results"),
    lbl(560, 1450, "session_ended"),
    lbl(780, 1380, "participant_joined"),
])

nodes = [
    terminal(540, 76, 108, 22, "Bruker besøker app",
        "Inngangspunkt for alle brukere.",
        '{"URL":"/","Komponent":"Landing"}', extra=" is-active"),
    diamond(540, 156, 54, "Har konto?",
        "Registrering eller innlogging.",
        '{"Nei":"register","Ja":"login"}'),
    rect_node(48, 236, 200, NODE_H, "Registrer", ["POST /auth/register"],
        "Ny bruker med e-post og passord.",
        '{"Endepunkt":"POST /api/v1/auth/register"}', f"{GH}/blob/main/backend/app/controllers/api/v1/auth_controller.rb"),
    diamond(148, 368, 50, "Gyldig input?",
        "Validering på server.", '{"Nei":"feil","Ja":"JWT"}'),
    rect_node(48, 428, 200, 52, "Vis valideringsfeil", ["Tilbake til skjema"],
        "Feltfeil vises i UI.", '{"Handling":"Loop"}'),
    diamond(448, 236, 52, "Innloggingsmetode",
        "E-post/passord eller OAuth.", '{"E-post":"login","OAuth":"callback"}'),
    rect_node(388, 316, 228, NODE_H, "POST /auth/login", ["E-post + passord"],
        "Returnerer JWT ved gyldig login.",
        '{"Endepunkt":"POST /api/v1/auth/login"}', f"{GH}/blob/main/backend/app/controllers/api/v1/auth_controller.rb"),
    diamond(502, 444, 50, "Credentials OK?",
        "bcrypt-verifisering.", '{"Nei":"feil","Ja":"JWT"}'),
    rect_node(800, 316, 248, NODE_H, "GET /auth/:provider/callback", ["OmniAuth"],
        "OAuth via Google/GitHub.",
        '{"Endepunkt":"GET /api/v1/auth/:provider/callback"}', f"{GH}/blob/main/backend/config/initializers/omniauth.rb"),
    diamond(924, 444, 50, "OAuth OK?",
        "Kobler provider+uid.", '{"Nei":"feil","Ja":"JWT"}'),
    rect_node(572, 428, 200, 52, "Vis feil", ["Tilbake til innlogging"],
        "Feil ved login/OAuth.", '{"Handling":"Loop"}'),
    rect_node(500, 512, 268, NODE_H, "JWT utstedt", ["Lagret client-side"],
        "Bearer-token i localStorage.",
        '{"Lagring":"localStorage"}', f"{GH}/blob/main/backend/app/services/json_web_token.rb"),
    rect_node(520, 608, 248, NODE_H, "Dashboard", ["Liste presentasjoner"],
        "Hovedhub etter innlogging.",
        '{"API":"GET /api/v1/presentations"}', f"{GH}/tree/main/frontend/src"),
    diamond(168, 768, 50, "Handling?",
        "Slett, opprett eller rediger.", '{"Delete":"DELETE","Create":"POST","Edit":"editor"}'),
    rect_node(48, 844, 200, NODE_H, "Slett", ["DELETE …/:id"],
        "Sletter presentasjon.", '{"Endepunkt":"DELETE /api/v1/presentations/:id"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/presentations_controller.rb"),
    rect_node(48, 918, 200, NODE_H, "Opprett", ["POST …/presentations"],
        "Ny presentasjon + slides.", '{"Endepunkt":"POST /api/v1/presentations"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/presentations_controller.rb"),
    rect_node(48, 992, 200, NODE_H, "Åpne editor", ["GET …/:id"],
        "PresentationEditor.", '{"Endepunkt":"GET /api/v1/presentations/:id"}',
        f"{GH}/tree/main/frontend/src/features/editor"),
    rect_node(48, 1066, 200, NODE_H, "Rediger slides", ["PATCH …/:id"],
        "Lagre og tilbake til dashboard.", '{"Endepunkt":"PATCH /api/v1/presentations/:id"}',
        f"{GH}/tree/main/frontend/src/features/editor"),
    diamond(712, 788, 50, "Profil?",
        "Navn eller passord.", '{"Profil":"PATCH profile","Passord":"PATCH password"}'),
    rect_node(468, 876, 200, NODE_H, "Oppdater navn", ["PATCH /auth/profile"],
        "Visningsnavn.", '{"Endepunkt":"PATCH /api/v1/auth/profile"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/auth_controller.rb"),
    rect_node(848, 876, 200, NODE_H, "Endre passord", ["PATCH /auth/password"],
        "Nytt passordhash.", '{"Endepunkt":"PATCH /api/v1/auth/password"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/auth_controller.rb"),
    rect_node(968, 608, 188, NODE_H, "Logg ut", ["POST /auth/logout"],
        "Token fjernes.", '{"Endepunkt":"POST /api/v1/auth/logout"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/auth_controller.rb"),
    rect_node(968, 688, 208, NODE_H, "Gå live", ["POST …/:id/start"],
        "Session + LIVE-kode.", '{"Endepunkt":"POST /api/v1/presentations/:id/start"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/presentations_controller.rb"),
    rect_node(1120, 648, 228, NODE_H, "Start live-økt", ["join-kode"],
        "PresentationSession opprettes.", '{"Modell":"PresentationSession"}',
        f"{GH}/blob/main/backend/app/models/presentation_session.rb"),
    rect_node(1120, 722, 228, NODE_H, "Sesjonslobby", ["Venter på deltakere"],
        "participant_joined.", '{"Komponent":"SessionLobby.tsx"}',
        f"{GH}/blob/main/frontend/src/features/live/SessionLobby.tsx"),
    rect_node(1120, 796, 228, NODE_H, "Presentatør starter", ["Gå live"],
        "LivePresentationHost.", '{"Komponent":"LivePresentationHost.tsx"}',
        f"{GH}/blob/main/frontend/src/features/live/LivePresentationHost.tsx"),
    rect_node(1120, 870, 228, NODE_H, "Naviger slides", ["slide_change"],
        "WebSocket broadcast.", '{"Event":"slide_change"}',
        f"{GH}/blob/main/backend/app/channels/presentation_channel.rb"),
    diamond(1280, 1000, 50, "Aktiver poll?",
        "Poll på aktiv slide.", '{"Ja":"vote → results","Nei":"fortsett"}'),
    rect_node(1400, 968, 208, NODE_H, "Deltaker stemmer", ["POST …/vote"],
        "PollResponse.", '{"Endepunkt":"POST /api/v1/polls/:id/vote"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/polls_controller.rb"),
    rect_node(1400, 1042, 208, NODE_H, "Live-resultater", ["GET …/results"],
        "poll_results.", '{"Endepunkt":"GET /api/v1/polls/:id/results"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/polls_controller.rb"),
    rect_node(880, 968, 228, NODE_H, "Avslutt økt", ["POST …/end_session"],
        "Manuell avslutning.", '{"Endepunkt":"POST /api/v1/presentations/:id/end_session"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/presentations_controller.rb"),
    rect_node(880, 1042, 248, 58, "Sesjonsopprydding", ["ended_at · is_live=false"],
        "Gjester slettes.", '{"Status":"is_live = false"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/presentations_controller.rb"),
    rect_node(880, 1106, 248, NODE_H, "Broadcast session_ended", ["ActionCable"],
        "Alle mottar event.", '{"Event":"session_ended"}',
        f"{GH}/blob/main/backend/app/channels/presentation_channel.rb"),
    terminal(1340, 1088, 128, 22, "Tilbake til innlogging",
        "Etter logout eller avsluttet økt.", '{"Token":"Fjernet"}'),
    terminal(228, 1188, 100, 20, "Deltaker åpner app",
        "Join-side.", '{"Komponent":"JoinPage.tsx"}',
        f"{GH}/blob/main/frontend/src/features/live/JoinPage.tsx"),
    diamond(228, 1256, 46, "Auth-status?",
        "Gjest eller innlogget.", '{"Gjest":"guest_join"}'),
    rect_node(56, 1336, 176, NODE_H, "Gjest: join-kode", ["POST guest_join"],
        "Gjest + JWT.", '{"Endepunkt":"POST /api/v1/sessions/guest_join"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/sessions_controller.rb"),
    rect_node(288, 1336, 200, NODE_H, "Innlogget: bli med", ["join_by_code"],
        "Eksisterende bruker.", '{"Endepunkt":"POST sessions/join_by_code"}',
        f"{GH}/blob/main/backend/app/controllers/api/v1/sessions_controller.rb"),
    rect_node(168, 1428, 216, NODE_H, "Sesjonslobby (deltaker)", ["PresentationChannel"],
        "slide_change · poll_results.", '{"Komponent":"LivePresentationAudience"}',
        f"{GH}/blob/main/frontend/src/features/live/LivePresentationAudience.tsx"),
    rect_node(448, 1404, 224, NODE_H, "Broadcast participant_joined", ["ActionCable"],
        "Til presentatørlobby.", '{"Event":"participant_joined"}',
        f"{GH}/blob/main/backend/app/channels/presentation_channel.rb"),
    terminal(228, 1480, 108, 20, "Deltaker frakoblet",
        "Ved session_ended.", '{"Event":"session_ended"}'),
]


def group_rect(key, extra_cls=""):
    x, y, w, h = GROUPS[key]
    cls = "diagram-group" + (f" {extra_cls}" if extra_cls else "")
    return f'                  <rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="14"/>'


def group_label(key, title):
    x, y, _, _ = GROUPS[key]
    return f'                  <text class="diagram-group-label" x="{x + 20}" y="{y + 26}">{title}</text>'


groups = "\n".join([
    group_rect("auth"),
    group_label("auth", "Autentisering"),
    group_rect("dash"),
    group_label("dash", "Dashboard &amp; presentasjoner"),
    group_rect("live"),
    group_label("live", "Live-presentasjon (presentatør)"),
    group_rect("part", "diagram-group-solid"),
    group_label("part", "Deltakerflyt"),
])

PANEL = f'''            <!-- Panel: FLYTDIAGRAM -->
            <div class="arch-panel is-active" data-arch-panel="journey" role="tabpanel" aria-labelledby="tab-journey">
              <svg class="arch-svg arch-svg-journey" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="arr-journey" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L0,6 L9,3 z" fill="currentColor"/></marker>
                </defs>
                <g class="arch-viewport">

{groups}

{edge_g(flow_paths)}

{edge_ws_g(ws_paths)}

{chr(10).join(nodes)}

{labels_html}

                </g>
              </svg>
            </div>

'''


def replace_journey_panel(html: str, fragment: str) -> str:
    start = html.find('            <!-- Panel: FLYTDIAGRAM')
    if start == -1:
        start = html.find('            <!-- Panel: JOURNEY')
    if start == -1:
        raise SystemExit('Flytdiagram panel not found')
    end = html.find('            <!-- Panel: SYSTEM -->', start)
    if end == -1:
        raise SystemExit('System panel marker not found')
    return html[:start] + fragment + '\n' + html[end:]


def patch_index(html_path: Path) -> None:
    html = html_path.read_text(encoding='utf-8')
    html = replace_journey_panel(html, PANEL)
    html_path.write_text(html, encoding='utf-8')
    print(f'Patched {html_path} ({W}x{H}), {len(flow_paths)} flow edges, {len(ws_paths)} ws edges')


if __name__ == '__main__':
    patch_index(Path(__file__).resolve().parent.parent / 'index.html')
