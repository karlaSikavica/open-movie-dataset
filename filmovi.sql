--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

--SET statement_timeout = 0;
--SET lock_timeout = 0;
--SET idle_in_transaction_session_timeout = 0;
--SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;



CREATE TABLE public.film (
    film_id integer NOT NULL,
    naziv character varying(100),
    godina integer,
    zemlja character varying(50),
    trajanje_min integer,
    zanr character varying(100),
    redatelj_ime character varying(50),
    redatelj_prezime character varying(50),
    prosjecna_ocjena numeric(3,1),
    budzet_mil_usd numeric(10,2),
    ocjena_imdb numeric(3,1),
    ocjena_rotten_tomatoes numeric(3,1),
    ocjena_tmdb numeric(3,1)
);


ALTER TABLE public.film OWNER TO postgres;

--
-- Name: film_film_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.film_film_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.film_film_id_seq OWNER TO postgres;

--
-- Name: film_film_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.film_film_id_seq OWNED BY public.film.film_id;


--
-- Name: film_glumac; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.film_glumac (
    film_id integer NOT NULL,
    glumac_id integer NOT NULL,
    uloga character varying(100)
);


ALTER TABLE public.film_glumac OWNER TO postgres;

--
-- Name: film_ocjene; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.film_ocjene AS
 SELECT film_id,
    naziv,
    round((((ocjena_imdb + (ocjena_rotten_tomatoes / 10.0)) + (ocjena_tmdb / 10.0)) / (3)::numeric), 1) AS prosjecna_ocjena
   FROM public.film;


ALTER VIEW public.film_ocjene OWNER TO postgres;

--
-- Name: glumac; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.glumac (
    glumac_id integer NOT NULL,
    ime character varying(50),
    prezime character varying(50),
    spol character(1),
    datum_rodenja date,
    drzava_podrijetla character varying(50),
    broj_nagrada integer,
    aktivan_od integer,
    nagrada_oscar integer DEFAULT 0,
    nagrada_golden_globe integer DEFAULT 0,
    nagrada_bafta integer DEFAULT 0
);


ALTER TABLE public.glumac OWNER TO postgres;

--
-- Name: glumac_glumac_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.glumac_glumac_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.glumac_glumac_id_seq OWNER TO postgres;

--
-- Name: glumac_glumac_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.glumac_glumac_id_seq OWNED BY public.glumac.glumac_id;


--
-- Name: film film_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.film ALTER COLUMN film_id SET DEFAULT nextval('public.film_film_id_seq'::regclass);


--
-- Name: glumac glumac_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.glumac ALTER COLUMN glumac_id SET DEFAULT nextval('public.glumac_glumac_id_seq'::regclass);


--
-- Data for Name: film; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (1, 'Saltburn', 2023, 'UK', 131, 'Drama, Thriller', 'Emerald', 'Fennell', 7.1, 20.00, 7.1, 72.0, 70.0);
INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (2, 'Knives Out', 2019, 'SAD', 130, 'Mystery, Comedy', 'Rian', 'Johnson', 8.5, 40.00, 7.9, 97.0, 78.0);
INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (3, 'Arrival', 2016, 'SAD', 116, 'Sci-Fi, Drama', 'Denis', 'Villeneuve', 8.3, 47.00, 7.9, 94.0, 76.0);
INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (4, 'Interstellar', 2014, 'SAD', 169, 'Sci-Fi, Adventure', 'Christopher', 'Nolan', 8.1, 165.00, 8.7, 72.0, 85.0);
INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (5, 'Sinners', 2024, 'SAD', 125, 'Thriller, Drama', 'Graham', 'Moore', 8.3, 15.00, 7.6, 97.0, 75.0);
INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (6, 'Call Me by Your Name', 2017, 'Italy', 132, 'Romance, Drama', 'Luca', 'Guadagnino', 8.5, 3.50, 8.0, 95.0, 81.0);
INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (7, 'The Devil Wears Prada', 2006, 'SAD', 109, 'Comedy, Drama', 'David', 'Frankel', 7.3, 35.00, 6.9, 75.0, 74.0);
INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (8, 'Materialists', 2025, 'SAD', 120, 'Romantic Comedy', 'Celine', 'Song', 7.1, 25.00, 6.3, 86.0, 65.0);
INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (9, 'Babygirl', 2024, 'SAD', 118, 'Romance, Drama', 'Halina', 'Reijn', 7.0, 12.00, 7.5, 77.0, 57.0);
INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (10, 'The Imitation Game', 2014, 'UK', 114, 'Biography, Drama', 'Morten', 'Tyldum', 8.3, 14.00, 8.0, 90.0, 80.0);
INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (11, 'Challengers', 2024, 'SAD', 131, 'Drama, Sport, Romantika', 'Luca', 'Guadagnino', 7.7, 55.00, 7.5, 88.0, 69.0);
INSERT INTO public.film (film_id, naziv, godina, zemlja, trajanje_min, zanr, redatelj_ime, redatelj_prezime, prosjecna_ocjena, budzet_mil_usd, ocjena_imdb, ocjena_rotten_tomatoes, ocjena_tmdb) VALUES (12, 'On Swift Horses', 2024, 'SAD', 137, 'Drama, Romantika', 'Daniel', 'Minahan', 6.2, 30.00, 7.0, 53.0, 62.0);


--
-- Data for Name: glumac; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (1, 'Barry', 'Keoghan', 'M', '1992-10-17', 'Ireland', 25, 2011, 0, 0, 1);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (2, 'Jacob', 'Elordi', 'M', '1997-06-26', 'Australia', 10, 2017, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (3, 'Rosamund', 'Pike', 'F', '1979-01-27', 'UK', 35, 1998, 0, 1, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (4, 'Daniel', 'Craig', 'M', '1968-03-02', 'UK', 60, 1992, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (5, 'Ana', 'de Armas', 'F', '1988-04-30', 'Cuba', 40, 2006, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (6, 'Chris', 'Evans', 'M', '1981-06-13', 'SAD', 50, 1999, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (7, 'Amy', 'Adams', 'F', '1974-08-20', 'Italy/USA', 75, 1999, 0, 2, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (8, 'Jeremy', 'Renner', 'M', '1971-01-07', 'SAD', 45, 1995, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (9, 'Forest', 'Whitaker', 'M', '1961-07-15', 'SAD', 60, 1982, 1, 1, 1);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (10, 'Matthew', 'McConaughey', 'M', '1969-11-04', 'SAD', 100, 1991, 1, 1, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (11, 'Anne', 'Hathaway', 'F', '1982-11-12', 'SAD', 85, 1999, 1, 1, 1);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (12, 'Jessica', 'Chastain', 'F', '1977-03-24', 'SAD', 70, 2004, 1, 1, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (13, 'Paul', 'Dano', 'M', '1984-06-19', 'SAD', 40, 2000, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (14, 'Rebecca', 'Ferguson', 'F', '1983-10-19', 'Sweden', 35, 1999, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (15, 'Oscar', 'Isaac', 'M', '1979-03-09', 'Guatemala', 55, 2002, 0, 1, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (16, 'Timothée', 'Chalamet', 'M', '1995-12-27', 'SAD', 60, 2012, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (17, 'Armie', 'Hammer', 'M', '1986-08-28', 'SAD', 20, 2005, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (18, 'Michael', 'Stuhlbarg', 'M', '1968-07-05', 'SAD', 30, 1998, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (19, 'Meryl', 'Streep', 'F', '1949-06-22', 'SAD', 180, 1975, 3, 9, 2);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (20, 'Emily', 'Blunt', 'F', '1983-02-23', 'UK', 60, 2001, 0, 1, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (21, 'Dakota', 'Johnson', 'F', '1989-10-04', 'SAD', 40, 1999, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (22, 'Pedro', 'Pascal', 'M', '1975-04-02', 'Chile', 45, 1996, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (23, 'Chris', 'Messina', 'M', '1974-08-11', 'SAD', 25, 1995, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (24, 'Nicole', 'Kidman', 'F', '1967-06-20', 'Australia', 100, 1983, 1, 6, 1);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (25, 'Harris', 'Dickinson', 'M', '1996-06-24', 'UK', 15, 2014, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (26, 'Paul', 'Mescal', 'M', '1996-02-02', 'Ireland', 30, 2017, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (27, 'Benedict', 'Cumberbatch', 'M', '1976-07-19', 'UK', 90, 2001, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (28, 'Keira', 'Knightley', 'F', '1985-03-26', 'UK', 75, 1995, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (29, 'Matthew', 'Goode', 'M', '1978-04-03', 'UK', 40, 2002, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (30, 'Zendaya', 'Coleman', 'F', '1996-09-01', 'SAD', 70, 2010, 0, 1, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (31, 'Mike', 'Faist', 'M', '1991-01-05', 'SAD', 20, 2012, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (32, 'Josh', 'O''Connor', 'M', '1990-05-20', 'UK', 25, 2011, 0, 1, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (33, 'Daisy', 'Edgar-Jones', 'F', '1998-05-24', 'UK', 15, 2016, 0, 0, 0);
INSERT INTO public.glumac (glumac_id, ime, prezime, spol, datum_rodenja, drzava_podrijetla, broj_nagrada, aktivan_od, nagrada_oscar, nagrada_golden_globe, nagrada_bafta) VALUES (34, 'Will', 'Poulter', 'M', '1993-01-28', 'UK', 25, 2007, 0, 0, 1);


--
-- Data for Name: film_glumac; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (1, 1, 'Oberon');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (1, 2, 'Owen');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (1, 3, 'Sasha');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (2, 4, 'Benoit Blanc');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (2, 5, 'Marta Cabrera');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (2, 6, 'Ransom Drysdale');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (3, 7, 'Louise Banks');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (3, 8, 'Ian Donnelly');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (3, 9, 'Colonel Weber');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (4, 10, 'Cooper');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (4, 11, 'Amelia Brand');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (4, 12, 'Murph');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (5, 13, 'Detective');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (5, 14, 'Reporter');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (5, 15, 'Suspect');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (6, 16, 'Elio');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (6, 17, 'Oliver');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (6, 18, 'Mr. Perlman');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (7, 19, 'Miranda Priestly');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (7, 20, 'Emily Charlton');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (7, 11, 'Andy Sachs');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (8, 21, 'Emma');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (8, 22, 'Liam');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (8, 23, 'David');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (9, 24, 'Elena');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (9, 25, 'Jack');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (9, 26, 'Liam');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (10, 27, 'Alan Turing');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (10, 28, 'Joan Clarke');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (10, 29, 'Hugh Alexander');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (11, 30, 'Maddy');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (11, 31, 'Anthony');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (11, 32, 'Mike');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (12, 33, 'Abby');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (12, 2, 'Eli');
INSERT INTO public.film_glumac (film_id, glumac_id, uloga) VALUES (12, 34, 'Maggie');


--
-- Name: film_film_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.film_film_id_seq', 12, true);


--
-- Name: glumac_glumac_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.glumac_glumac_id_seq', 30, true);



ALTER TABLE ONLY public.film_glumac
    ADD CONSTRAINT film_glumac_pkey PRIMARY KEY (film_id, glumac_id);

ALTER TABLE ONLY public.film
    ADD CONSTRAINT film_pkey PRIMARY KEY (film_id);

ALTER TABLE ONLY public.glumac
    ADD CONSTRAINT glumac_pkey PRIMARY KEY (glumac_id);

ALTER TABLE ONLY public.film_glumac
    ADD CONSTRAINT film_glumac_film_id_fkey FOREIGN KEY (film_id) REFERENCES public.film(film_id);

ALTER TABLE ONLY public.film_glumac
    ADD CONSTRAINT film_glumac_glumac_id_fkey FOREIGN KEY (glumac_id) REFERENCES public.glumac(glumac_id);

--
-- PostgreSQL database dump complete
--

