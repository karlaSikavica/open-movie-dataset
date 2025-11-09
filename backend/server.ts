import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/db-check", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0].now });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function filterSQL(search?: string, field?: string) {
  /* const fieldMap: Record<string, string> = {
    naziv: "f.naziv",
    godina: "f.godina::text",
    zemlja: "f.zemlja",
    trajanje_min: "f.trajanje_min::text",
    zanr: "f.zanr",
    redatelj_ime: "f.redatelj_ime",
    redatelj_prezime: "f.redatelj_prezime",
    "g.ime": "g.ime",
    "g.prezime": "g.prezime",
    "fg.uloga": "fg.uloga",
    prosjecna_ocjena: "f.prosjecna_ocjena::text",
    budzet_mil_usd: "f.budzet_mil_usd::text",
    ocjena_imdb: "f.ocjena_imdb::text",
    ocjena_rotten_tomatoes: "f.ocjena_rotten_tomatoes::text",
    ocjena_tmdb: "f.ocjena_tmdb::text",
  }; */

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

  /* let sql = `
    SELECT 
      f.film_id,
      f.naziv,
      f.godina,
      f.zemlja,
      f.trajanje_min,
      f.zanr,
      f.redatelj_ime,
      f.redatelj_prezime,
      f.prosjecna_ocjena,
      f.budzet_mil_usd,
      f.ocjena_imdb,
      f.ocjena_rotten_tomatoes,
      f.ocjena_tmdb,
      g.glumac_id,
      g.ime,
      g.prezime,
      fg.uloga
    FROM film f
    JOIN film_glumac fg ON f.film_id = fg.film_id
    JOIN glumac g ON g.glumac_id = fg.glumac_id
  `; */

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
  JOIN film_glumac fg ON f.film_id = fg.film_id
  JOIN glumac g ON g.glumac_id = fg.glumac_id
`;

  const params: any[] = [];

  if (search && search.trim() !== "") {
    const s = `%${search.toLowerCase()}%`;

    if (field && field !== "all" && fieldMap[field]) {
      sql += ` WHERE LOWER(${fieldMap[field]}) ILIKE $1`;
      params.push(s);
    } else {
      /*  sql += ` WHERE 
        LOWER(f.naziv) ILIKE $1 OR
        LOWER(f.zanr) ILIKE $1 OR
        LOWER(f.zemlja) ILIKE $1 OR
        LOWER(f.redatelj_ime) ILIKE $1 OR
        LOWER(f.redatelj_prezime) ILIKE $1 OR
        LOWER(g.ime) ILIKE $1 OR
        LOWER(g.prezime) ILIKE $1 OR
        LOWER(fg.uloga) ILIKE $1 OR
        f.godina::text ILIKE $1 OR
        f.trajanje_min::text ILIKE $1 OR
        f.prosjecna_ocjena::text ILIKE $1 OR
        f.budzet_mil_usd::text ILIKE $1 OR
        f.ocjena_imdb::text ILIKE $1 OR
        f.ocjena_rotten_tomatoes::text ILIKE $1 OR
        f.ocjena_tmdb::text ILIKE $1
      `; */

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

//JSON endpoint za prikaz u tablici
app.get("/api/filmovi", async (req, res) => {
  try {
    const { search, field } = req.query;
    const { sql, params } = filterSQL(search as string, field as string);
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

//CSV download
app.get("/api/filmovi.csv", async (req, res) => {
  try {
    const { search, field } = req.query;
    const { sql, params } = filterSQL(search as string, field as string);
    const result = await pool.query(sql, params);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="filmovi.csv"');

    if (result.rows.length === 0) {
      return res.send("");
    }

    const columns = Object.keys(result.rows[0]);
    const header = columns.join(",") + "\n";

    const rows = result.rows
      .map((row) => columns.map((col) => row[col] ?? "").join(","))
      .join("\n");

    res.send(header + rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

//JSON download
app.get("/api/filmovi.json", async (req, res) => {
  try {
    const { search, field } = req.query;
    const { sql, params } = filterSQL(search as string, field as string);
    const result = await pool.query(sql, params);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="filmovi.json"');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4455, () => {
  console.log("Server running on port http://localhost:4455");
});

/* const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); */

export default app;
