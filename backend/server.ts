import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { pool } from "./db.js";
import { auth } from "express-openid-connect";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));

const config = {
  authRequired: false,
  //auth0Logout: true,
  idpLogout: false,
  auth0Logout: false,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(auth(config));

app.get("/auth-status", (req, res) => {
  res.json({
    authenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user ?? null,
  });
});

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.oidc.isAuthenticated()) {
    return sendError(res, 401, "Unauthorized", "Potrebna je prijava.");
  }
  next();
}

app.get("/api/profil", requireAuth, (req, res) => {
  return sendOK(res, "Fetched user profile", req.oidc.user);
});

app.get("/odjava", (req, res) => {
  res.oidc.logout({
    returnTo: process.env.BASE_URL || "http://localhost:4455",
  });
});

type ApiResponse<T> = {
  status: string;
  message: string;
  response: T | null;
};

function sendOK<T>(res: Response, message: string, data: T, code = 200) {
  const out: ApiResponse<T> = { status: "OK", message, response: data };
  return res.status(code).type("application/json").json(out);
}

function sendError(
  res: Response,
  code: number,
  status: string,
  message: string
) {
  const out: ApiResponse<null> = { status, message, response: null };
  return res.status(code).type("application/json").json(out);
}

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

function parseId(idRaw: string) {
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

app.get(
  "/db-check",
  asyncHandler(async (req, res) => {
    const result = await pool.query("SELECT NOW()");
    return sendOK(res, "DB connection OK", { time: result.rows[0].now });
  })
);

// GET filmova
app.get(
  "/api/filmovi",
  asyncHandler(async (req, res) => {
    const { search, zanr, godina } = req.query;

    // jednostavni filteri (nije obavezno, ali korisno)
    let sql = `SELECT
      film_id, naziv, godina, zanr, zemlja, trajanje_min,
      redatelj_ime, redatelj_prezime, budzet_mil_usd,
      prosjecna_ocjena, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb
      FROM film`;
    const params: any[] = [];
    const where: string[] = [];

    if (typeof search === "string" && search.trim() !== "") {
      params.push(`%${search.toLowerCase()}%`);
      where.push(`LOWER(naziv) ILIKE $${params.length}`);
    }
    if (typeof zanr === "string" && zanr.trim() !== "") {
      params.push(zanr);
      where.push(`zanr = $${params.length}`);
    }
    if (typeof godina === "string" && godina.trim() !== "") {
      const g = Number(godina);
      if (!Number.isInteger(g))
        return sendError(
          res,
          400,
          "Bad Request",
          "Parametar 'godina' mora biti cijeli broj."
        );
      params.push(g);
      where.push(`godina = $${params.length}`);
    }

    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY film_id";

    const result = await pool.query(sql, params);
    return sendOK(res, "Fetched movies collection", result.rows);
  })
);

// GET pojedinačni film po ID-u
/* app.get(
  "/api/filmovi/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return sendError(res, 400, "Bad Request", "Neispravan ID filma.");

    const result = await pool.query(
      `SELECT
        film_id, naziv, godina, zanr, zemlja, trajanje_min,
        redatelj_ime, redatelj_prezime, budzet_mil_usd,
        prosjecna_ocjena, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb
      FROM film WHERE film_id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return sendError(
        res,
        404,
        "Not Found",
        "Film s traženim ID-jem ne postoji."
      );
    }

    return sendOK(res, "Fetched movie resource", result.rows[0]);
  })
); */
app.get(
  "/api/filmovi/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return sendError(res, 400, "Bad Request", "Neispravan ID filma.");

    const result = await pool.query(
      `SELECT
        film_id, naziv, godina, zanr, zemlja, trajanje_min,
        redatelj_ime, redatelj_prezime, budzet_mil_usd,
        prosjecna_ocjena, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb
      FROM film WHERE film_id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return sendError(
        res,
        404,
        "Not Found",
        "Film s traženim ID-jem ne postoji."
      );
    }

    const f = result.rows[0];

    const jsonld = {
      "@context": {
        "@vocab": "https://schema.org/",
        naziv: "name",
        godina: "datePublished",
        zanr: "genre",
        trajanje_min: "duration",
        redatelj_ime: "director.givenName",
        redatelj_prezime: "director.familyName",
      },
      "@type": "Movie",

      film_id: f.film_id,
      naziv: f.naziv,
      godina: f.godina,
      zanr: f.zanr,
      zemlja: f.zemlja,
      trajanje_min: f.trajanje_min ? `PT${f.trajanje_min}M` : null, // ISO 8601 duration (npr PT169M)

      director: {
        "@type": "Person",
        givenName: f.redatelj_ime,
        familyName: f.redatelj_prezime,
      },

      budzet_mil_usd: f.budzet_mil_usd,
      prosjecna_ocjena: f.prosjecna_ocjena,
      ocjena_imdb: f.ocjena_imdb,
      ocjena_rotten_tomatoes: f.ocjena_rotten_tomatoes,
      ocjena_tmdb: f.ocjena_tmdb,
    };

    res.setHeader("Content-Type", "application/ld+json; charset=utf-8");
    return res.status(200).json(jsonld);
  })
);

// dodatni GET #1: glumci za film
app.get(
  "/api/filmovi/:id/glumci",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return sendError(res, 400, "Bad Request", "Neispravan ID filma.");

    const exists = await pool.query("SELECT 1 FROM film WHERE film_id = $1", [
      id,
    ]);
    if (exists.rowCount === 0)
      return sendError(
        res,
        404,
        "Not Found",
        "Film s traženim ID-jem ne postoji."
      );

    const result = await pool.query(
      `SELECT
        g.glumac_id, g.ime, g.prezime, fg.uloga,
        g.spol, g.datum_rodenja, g.drzava_podrijetla,
        g.aktivan_od, g.broj_nagrada, g.nagrada_oscar,
        g.nagrada_golden_globe, g.nagrada_bafta
      FROM film_glumac fg
      JOIN glumac g ON g.glumac_id = fg.glumac_id
      WHERE fg.film_id = $1
      ORDER BY g.glumac_id`,
      [id]
    );

    return sendOK(res, "Fetched actors for movie", result.rows);
  })
);

// dodatni GET #2: kolekcija glumaca
app.get(
  "/api/glumci",
  asyncHandler(async (req, res) => {
    const { search } = req.query;

    let sql = `SELECT
      glumac_id, ime, prezime, spol, datum_rodenja,
      drzava_podrijetla, aktivan_od, broj_nagrada,
      nagrada_oscar, nagrada_golden_globe, nagrada_bafta
    FROM glumac`;
    const params: any[] = [];
    if (typeof search === "string" && search.trim() !== "") {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` WHERE LOWER(ime) ILIKE $1 OR LOWER(prezime) ILIKE $1 OR LOWER(drzava_podrijetla) ILIKE $1`;
    }
    sql += " ORDER BY glumac_id";

    const result = await pool.query(sql, params);
    return sendOK(res, "Fetched actors collection", result.rows);
  })
);

// dodatni GET #3: statistika po žanru
app.get(
  "/api/statistika/zanrovi",
  asyncHandler(async (req, res) => {
    const result = await pool.query(
      `SELECT
         TRIM(z) AS zanr,
         COUNT(*)::int AS broj_filmova
       FROM film f
       CROSS JOIN LATERAL regexp_split_to_table(COALESCE(f.zanr, ''), '\\s*,\\s*|\\s*/\\s*') AS z
       WHERE TRIM(z) <> ''
       GROUP BY TRIM(z)
       ORDER BY broj_filmova DESC, zanr ASC`
    );

    return sendOK(res, "Fetched genre statistics", result.rows);
  })
);

// POST film
app.post(
  "/api/filmovi",
  asyncHandler(async (req, res) => {
    const b = req.body ?? {};

    // minimalna validacija
    if (!b.naziv || typeof b.naziv !== "string" || b.naziv.trim() === "") {
      return sendError(res, 400, "Bad Request", "Polje 'naziv' je obavezno.");
    }
    if (b.godina === undefined || !Number.isInteger(Number(b.godina))) {
      return sendError(
        res,
        400,
        "Bad Request",
        "Polje 'godina' je obavezno i mora biti cijeli broj."
      );
    }

    const payload = {
      naziv: b.naziv.trim(),
      godina: Number(b.godina),
      zanr: b.zanr ?? null,
      zemlja: b.zemlja ?? null,
      trajanje_min:
        b.trajanje_min !== undefined ? Number(b.trajanje_min) : null,
      redatelj_ime: b.redatelj_ime ?? null,
      redatelj_prezime: b.redatelj_prezime ?? null,
      budzet_mil_usd:
        b.budzet_mil_usd !== undefined ? Number(b.budzet_mil_usd) : null,
      prosjecna_ocjena:
        b.prosjecna_ocjena !== undefined ? Number(b.prosjecna_ocjena) : null,
      ocjena_imdb: b.ocjena_imdb !== undefined ? Number(b.ocjena_imdb) : null,
      ocjena_rotten_tomatoes:
        b.ocjena_rotten_tomatoes !== undefined
          ? Number(b.ocjena_rotten_tomatoes)
          : null,
      ocjena_tmdb: b.ocjena_tmdb !== undefined ? Number(b.ocjena_tmdb) : null,
    };

    const result = await pool.query(
      `INSERT INTO film
      (naziv, godina, zanr, zemlja, trajanje_min, redatelj_ime, redatelj_prezime,
       budzet_mil_usd, prosjecna_ocjena, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING
        film_id, naziv, godina, zanr, zemlja, trajanje_min,
        redatelj_ime, redatelj_prezime, budzet_mil_usd,
        prosjecna_ocjena, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb`,
      [
        payload.naziv,
        payload.godina,
        payload.zanr,
        payload.zemlja,
        payload.trajanje_min,
        payload.redatelj_ime,
        payload.redatelj_prezime,
        payload.budzet_mil_usd,
        payload.prosjecna_ocjena,
        payload.ocjena_imdb,
        payload.ocjena_rotten_tomatoes,
        payload.ocjena_tmdb,
      ]
    );

    return sendOK(res, "Created movie resource", result.rows[0], 201);
  })
);

//POST glumac
app.post(
  "/api/filmovi/:id/glumci",
  asyncHandler(async (req, res) => {
    const filmId = parseId(req.params.id);
    if (!filmId)
      return sendError(res, 400, "Bad Request", "Neispravan ID filma.");

    const b = req.body ?? {};
    if (
      !b.ime ||
      !b.prezime ||
      typeof b.ime !== "string" ||
      typeof b.prezime !== "string"
    ) {
      return sendError(
        res,
        400,
        "Bad Request",
        "Polja 'ime' i 'prezime' su obavezna."
      );
    }

    const ime = b.ime.trim();
    const prezime = b.prezime.trim();
    const uloga =
      b.uloga !== undefined && String(b.uloga).trim() !== ""
        ? String(b.uloga).trim()
        : null;

    const filmExists = await pool.query(
      "SELECT 1 FROM film WHERE film_id = $1",
      [filmId]
    );
    if (filmExists.rowCount === 0)
      return sendError(
        res,
        404,
        "Not Found",
        "Film s traženim ID-jem ne postoji."
      );

    let glumacId: number;
    const glumacResult = await pool.query(
      `SELECT glumac_id FROM glumac
       WHERE LOWER(ime) = LOWER($1)
         AND LOWER(prezime) = LOWER($2)`,
      [ime, prezime]
    );

    if (glumacResult.rowCount === 0) {
      const insertGlumac = await pool.query(
        `INSERT INTO glumac (ime, prezime)
         VALUES ($1, $2)
         RETURNING glumac_id`,
        [ime, prezime]
      );
      glumacId = insertGlumac.rows[0].glumac_id;
    } else {
      glumacId = glumacResult.rows[0].glumac_id;
    }

    const alreadyLinked = await pool.query(
      "SELECT 1 FROM film_glumac WHERE film_id = $1 AND glumac_id = $2",
      [filmId, glumacId]
    );
    if (alreadyLinked.rowCount != null && alreadyLinked.rowCount > 0)
      return sendError(
        res,
        409,
        "Conflict",
        "Ovaj glumac je već povezan s filmom."
      );

    const result = await pool.query(
      `INSERT INTO film_glumac (film_id, glumac_id, uloga)
       VALUES ($1, $2, $3)
       RETURNING film_id, glumac_id, uloga`,
      [filmId, glumacId, uloga]
    );

    return sendOK(res, "Actor linked to movie", result.rows[0], 201);
  })
);

// PUT film
app.put(
  "/api/filmovi/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return sendError(res, 400, "Bad Request", "Neispravan ID filma.");

    const b = req.body ?? {};
    const allowed = [
      "naziv",
      "godina",
      "zanr",
      "zemlja",
      "trajanje_min",
      "redatelj_ime",
      "redatelj_prezime",
      "budzet_mil_usd",
      "prosjecna_ocjena",
      "ocjena_imdb",
      "ocjena_rotten_tomatoes",
      "ocjena_tmdb",
    ];
    const hasAny = allowed.some((k) => b[k] !== undefined);
    if (!hasAny)
      return sendError(
        res,
        400,
        "Bad Request",
        "Tijelo zahtjeva mora sadržavati barem jedno polje za osvježenje."
      );

    if (b.godina !== undefined && !Number.isInteger(Number(b.godina))) {
      return sendError(
        res,
        400,
        "Bad Request",
        "Polje 'godina' mora biti cijeli broj."
      );
    }

    const result = await pool.query(
      `UPDATE film SET
        naziv = COALESCE($2, naziv),
        godina = COALESCE($3, godina),
        zanr = COALESCE($4, zanr),
        zemlja = COALESCE($5, zemlja),
        trajanje_min = COALESCE($6, trajanje_min),
        redatelj_ime = COALESCE($7, redatelj_ime),
        redatelj_prezime = COALESCE($8, redatelj_prezime),
        budzet_mil_usd = COALESCE($9, budzet_mil_usd),
        prosjecna_ocjena = COALESCE($10, prosjecna_ocjena),
        ocjena_imdb = COALESCE($11, ocjena_imdb),
        ocjena_rotten_tomatoes = COALESCE($12, ocjena_rotten_tomatoes),
        ocjena_tmdb = COALESCE($13, ocjena_tmdb)
      WHERE film_id = $1
      RETURNING
        film_id, naziv, godina, zanr, zemlja, trajanje_min,
        redatelj_ime, redatelj_prezime, budzet_mil_usd,
        prosjecna_ocjena, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb`,
      [
        id,
        b.naziv !== undefined ? String(b.naziv).trim() : null,
        b.godina !== undefined ? Number(b.godina) : null,
        b.zanr !== undefined ? b.zanr : null,
        b.zemlja !== undefined ? b.zemlja : null,
        b.trajanje_min !== undefined ? Number(b.trajanje_min) : null,
        b.redatelj_ime !== undefined ? b.redatelj_ime : null,
        b.redatelj_prezime !== undefined ? b.redatelj_prezime : null,
        b.budzet_mil_usd !== undefined ? Number(b.budzet_mil_usd) : null,
        b.prosjecna_ocjena !== undefined ? Number(b.prosjecna_ocjena) : null,
        b.ocjena_imdb !== undefined ? Number(b.ocjena_imdb) : null,
        b.ocjena_rotten_tomatoes !== undefined
          ? Number(b.ocjena_rotten_tomatoes)
          : null,
        b.ocjena_tmdb !== undefined ? Number(b.ocjena_tmdb) : null,
      ]
    );

    if (result.rowCount === 0) {
      return sendError(
        res,
        404,
        "Not Found",
        "Film s traženim ID-jem ne postoji."
      );
    }

    return sendOK(res, "Updated movie resource", result.rows[0]);
  })
);

// DELETE film
app.delete(
  "/api/filmovi/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return sendError(res, 400, "Bad Request", "Neispravan ID filma.");

    await pool.query("DELETE FROM film_glumac WHERE film_id = $1", [id]);
    const result = await pool.query(
      "DELETE FROM film WHERE film_id = $1 RETURNING film_id",
      [id]
    );

    if (result.rowCount === 0) {
      return sendError(
        res,
        404,
        "Not Found",
        "Film s traženim ID-jem ne postoji."
      );
    }

    return sendOK(res, "Deleted movie resource", { film_id: id });
  })
);

const SNAP_DIR = path.join(__dirname, "../snapshots");
const SNAP_JSON = path.join(SNAP_DIR, "filmovi.json");
const SNAP_CSV = path.join(SNAP_DIR, "filmovi.csv");

function ensureSnapDir() {
  if (!fs.existsSync(SNAP_DIR)) fs.mkdirSync(SNAP_DIR, { recursive: true });
}

function escapeCsvValue(v: any) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowsToCsv(rows: any[]) {
  if (!rows || rows.length === 0) return "";
  const columns = Object.keys(rows[0]);
  const header = columns.join(",") + "\n";
  const body = rows
    .map((row) => columns.map((c) => escapeCsvValue(row[c])).join(","))
    .join("\n");
  return header + body;
}

//osvjezi preslike
app.get(
  "/api/osvjezi-preslike",
  requireAuth,
  asyncHandler(async (req, res) => {
    ensureSnapDir();

    const { sql, params } = filterSQL(undefined, undefined);
    const result = await pool.query(sql, params);
    const rows = result.rows ?? [];

    fs.writeFileSync(SNAP_JSON, JSON.stringify(rows, null, 2), "utf-8");

    const csv = rowsToCsv(rows);
    fs.writeFileSync(SNAP_CSV, csv, "utf-8");

    return sendOK(res, "Snapshots refreshed", {
      records: rows.length,
      csv: "filmovi.csv",
      json: "filmovi.json",
      savedTo: "snapshots/",
      refreshedAt: new Date().toISOString(),
    });
  })
);

function filterSQL(search?: string, field?: string) {
  const fieldMap: Record<string, string> = {
    FilmID: "f.film_id::text",
    "Naziv filma": "f.naziv",
    Godina: "f.godina::text",
    Zanr: "f.zanr",
    "Zemlja nastanka filma": "f.zemlja",
    "Trajanje filma": "f.trajanje_min::text",
    "Ime redatelja": "f.redatelj_ime",
    "Prezime redatelja": "f.redatelj_prezime",
    "Budzet mil USD": "f.budzet_mil_usd::text",
    "Prosjecna ocjena": "f.prosjecna_ocjena::text",
    "IMDB ocjena": "f.ocjena_imdb::text",
    "Rotten tomatoes ocjena": "f.ocjena_rotten_tomatoes::text",
    "TMDB ocjena": "f.ocjena_tmdb::text",
    "Ime glumca": "g.ime",
    "Prezime glumca": "g.prezime",
    Uloga: "fg.uloga",
    Spol: "g.spol",
    "Datum rodenja": "g.datum_rodenja::text",
    "Drzava podrijetla": "g.drzava_podrijetla",
    "Aktivan od": "g.aktivan_od::text",
    "Broj nagrada": "g.broj_nagrada::text",
    Oscar: "g.nagrada_oscar::text",
    "Golden globe": "g.nagrada_golden_globe::text",
    Bafta: "g.nagrada_bafta::text",
  };

  let sql = `
  SELECT 
    f.film_id,
    f.naziv,
    f.godina,
    f.zanr,
    f.zemlja,
    f.trajanje_min,
    f.redatelj_ime,
    f.redatelj_prezime,
    f.budzet_mil_usd,
    f.prosjecna_ocjena,
    f.ocjena_imdb,
    f.ocjena_rotten_tomatoes,
    f.ocjena_tmdb,

    g.glumac_id,
    g.ime,
    g.prezime,
    fg.uloga,
    g.spol,
    g.datum_rodenja,
    g.drzava_podrijetla,
    g.aktivan_od,
    g.broj_nagrada,
    g.nagrada_oscar,
    g.nagrada_golden_globe,
    g.nagrada_bafta

  FROM film f
  LEFT JOIN film_glumac fg ON f.film_id = fg.film_id
  LEFT JOIN glumac g ON g.glumac_id = fg.glumac_id
`;

  const params: any[] = [];

  if (search && search.trim() !== "") {
    const s = `%${search.toLowerCase()}%`;

    if (field && field !== "all" && fieldMap[field]) {
      sql += ` WHERE LOWER(${fieldMap[field]}) ILIKE $1`;
      params.push(s);
    } else {
      sql += ` WHERE 
        LOWER(f.naziv) ILIKE $1 OR
        LOWER(f.zanr) ILIKE $1 OR
        LOWER(f.zemlja) ILIKE $1 OR
        LOWER(f.redatelj_ime) ILIKE $1 OR
        LOWER(f.redatelj_prezime) ILIKE $1 OR
        LOWER(g.ime) ILIKE $1 OR
        LOWER(g.prezime) ILIKE $1 OR
        LOWER(fg.uloga) ILIKE $1 OR
        LOWER(g.spol) ILIKE $1 OR
        LOWER(g.drzava_podrijetla) ILIKE $1 OR
        f.godina::text ILIKE $1 OR
        f.trajanje_min::text ILIKE $1 OR
        f.prosjecna_ocjena::text ILIKE $1 OR
        f.budzet_mil_usd::text ILIKE $1 OR
        f.ocjena_imdb::text ILIKE $1 OR
        f.ocjena_rotten_tomatoes::text ILIKE $1 OR
        f.ocjena_tmdb::text ILIKE $1 OR
        g.datum_rodenja::text ILIKE $1 OR
        g.aktivan_od::text ILIKE $1 OR
        g.broj_nagrada::text ILIKE $1 OR
        g.nagrada_oscar::text ILIKE $1 OR
        g.nagrada_golden_globe::text ILIKE $1 OR
        g.nagrada_bafta::text ILIKE $1
      `;
      params.push(s);
    }
  }

  sql += ` ORDER BY f.film_id, g.glumac_id`;
  return { sql, params };
}

// JSON za tablicu
app.get(
  "/api/filmovi-view",
  asyncHandler(async (req, res) => {
    const { search, field } = req.query;
    const { sql, params } = filterSQL(search as string, field as string);
    const result = await pool.query(sql, params);
    return sendOK(res, "Fetched movies view", result.rows);
  })
);

// CSV download
/* app.get(
  "/api/filmovi.csv",
  asyncHandler(async (req, res) => {
    const { search, field } = req.query;
    const { sql, params } = filterSQL(search as string, field as string);
    const result = await pool.query(sql, params);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="filmovi.csv"');

    if (result.rows.length === 0) return res.send("");

    const columns = Object.keys(result.rows[0]);
    const header = columns.join(",") + "\n";
    const rows = result.rows
      .map((row: any) => columns.map((col) => row[col] ?? "").join(","))
      .join("\n");
    return res.send(header + rows);
  })
);

// JSON download
app.get(
  "/api/filmovi.json",
  asyncHandler(async (req, res) => {
    const { search, field } = req.query;
    const { sql, params } = filterSQL(search as string, field as string);
    const result = await pool.query(sql, params);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="filmovi.json"');
    return res.json(result.rows);
  })
); */

app.get(
  "/api/filmovi.csv",
  asyncHandler(async (req, res) => {
    const { search, field } = req.query;

    // ako nema filtera, pokušaj poslužiti snapshot s diska
    const hasFilter =
      (typeof search === "string" && search.trim() !== "") ||
      (typeof field === "string" &&
        field.trim() !== "" &&
        field !== "all" &&
        field !== "*");

    if (!hasFilter && fs.existsSync(SNAP_CSV)) {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="filmovi.csv"'
      );
      return res.send(fs.readFileSync(SNAP_CSV, "utf-8"));
    }

    // fallback: generiraj iz baze (tvoje staro ponašanje)
    const { sql, params } = filterSQL(search as string, field as string);
    const result = await pool.query(sql, params);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="filmovi.csv"');

    if (result.rows.length === 0) return res.send("");

    const csv = rowsToCsv(result.rows);
    return res.send(csv);
  })
);

app.get(
  "/api/filmovi.json",
  asyncHandler(async (req, res) => {
    const { search, field } = req.query;

    const hasFilter =
      (typeof search === "string" && search.trim() !== "") ||
      (typeof field === "string" &&
        field.trim() !== "" &&
        field !== "all" &&
        field !== "*");

    if (!hasFilter && fs.existsSync(SNAP_JSON)) {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="filmovi.json"'
      );
      return res.send(fs.readFileSync(SNAP_JSON, "utf-8"));
    }

    const { sql, params } = filterSQL(search as string, field as string);
    const result = await pool.query(sql, params);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="filmovi.json"');
    return res.json(result.rows);
  })
);

//openapi.json
app.get(
  "/openapi.json",
  asyncHandler(async (req, res) => {
    const specPath = path.join(__dirname, "../openapi.json");
    const raw = fs.readFileSync(specPath, "utf-8");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.send(raw);
  })
);

app.use("/api", (req, res, next) => {
  if (!["GET", "POST", "PUT", "DELETE"].includes(req.method)) {
    return sendError(
      res,
      501,
      "Not Implemented",
      "Method not implemented for requested resource."
    );
  }
  next();
});

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return sendError(
      res,
      404,
      "Not Found",
      "Requested endpoint doesn't exist."
    );
  }
  return res.status(404).send("Not Found");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (req.path.startsWith("/api/")) {
    return sendError(
      res,
      500,
      "Internal Server Error",
      err?.message || "Unexpected error."
    );
  }
  return res.status(500).send("Internal Server Error");
});

const PORT = Number(process.env.PORT) || 4455;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export default app;
