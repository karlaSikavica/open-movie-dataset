# Open movie dataset
# Otvoreni skup podataka: Filmski katalog

Ovaj skup podataka sadrži informacije o filmovima i glumcima koji u njima sudjeluju.  
Podaci uključuju osnovne informacije o filmovima (naziv, godina izlaska, žanr, trajanje, zemlja nastanka, redatelj, IMDB ocjena, budžet) te povezane podatke o glumcima (ime, prezime, spol, datum rođenja, država podrijetla, broj nagrada, godina početka karijere i uloga).  
Cilj skupa podataka je prikazati primjer pravilno modelirane relacijske baze podataka koja povezuje filmove i glumce kroz odnos **jedan film – više glumaca**.  
Podaci su pohranjeni u formatima **CSV** i **JSON**, koji su strojno čitljivi i jednostavni za daljnju obradu i analizu.

---

## Metapodaci

| Naziv metapodatka | Vrijednost |
|--------------------|------------|
| **Naziv skupa podataka** | Filmovi |
| **Autor** | Karla Sikavica |
| **Verzija** | 1.0 |
| **Jezik podataka** | Hrvatski |
| **Licenca** | Creative Commons Zero (CC0 1.0 Universal) |
| **Format datoteka** | CSV, JSON |
| **Broj zapisa (instanci)** | 12 filmova, 34 glumca |
| **Broj atributa** | 10 atributa za film, 9 atributa za glumca |
| **Izvor podataka** | Ručno prikupljeni podaci iz javno dostupnih izvora (IMDb) |
| **Datum objave** | 17. listopada 2025. |
| **Opis baze podataka** | Baza podataka sadrži dvije tablice: *Film* (roditelj) i *Glumac* (dijete), povezane relacijom 1:N. |
| **Način izvoza** | Podaci su automatski izvezeni iz baze pomoću SQL skripte u formate CSV i JSON. |

---

## Opis atributa

### **Filmovi**
- **FilmID** – jedinstveni identifikator filma  
- **Naziv filma** – naslov filma  
- **Godina** – godina izlaska filma  
- **Zanr** – vrste/žanrovi filma (npr. drama, komedija, triler)  
- **Zemlja nastanka filma** – država u kojoj je film proizveden  
- **Trajanje filma** – duljina trajanja filma u minutama  
- **Ime redatelja**, **Prezime redatelja** – ime i prezime redatelja filma  
- **IMDB ocjena filma** – prosječna ocjena filma s portala IMDb  
- **Budzet mil USD** – procijenjeni budžet filma izražen u milijunima američkih dolara  
- **Glumci** – popis povezanih glumaca s njihovim ulogama  

### **Glumci**
- **GlumacID** – jedinstveni identifikator glumca  
- **Ime glumca**, **Prezime glumca** – osobni podaci glumca  
- **Spol** – spol glumca (M/F)  
- **Datum rodenja** – datum rođenja u formatu YYYY-MM-DD  
- **Drzava podrijetla** – zemlja iz koje glumac potječe  
- **Broj nagrada** – ukupan broj profesionalnih nagrada  
- **Aktivan od** – godina početka karijere  
- **Uloga** – ime lika kojeg glumac tumači u filmu  

---

## Korištenje skupa podataka

Skup podataka može se koristiti za:
- edukativne svrhe u području baza podataka i relacijskog modeliranja  
- izradu analitičkih prikaza o filmovima, žanrovima i karijerama glumaca  
- testiranje algoritama, API-ja i aplikacija koje obrađuju hijerarhijske podatke  
- prikaz koncepta otvorenih podataka i njihove ponovne upotrebe  

---

## Licenca

Ovaj skup podataka objavljen je pod licencom  
**Creative Commons Zero (CC0 1.0 Universal)**  
[https://creativecommons.org/publicdomain/zero/1.0/](https://creativecommons.org/publicdomain/zero/1.0/)

Podaci se mogu slobodno koristiti, dijeliti i mijenjati bez ograničenja i bez potrebe za navođenjem izvora.

---
