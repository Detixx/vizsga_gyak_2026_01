# API-szerződés

A frontend az alábbi végpontokat használja. Ugyanezekkel az útvonalakkal és JSON-mezőkkel ASP.NET Core Web API backend is készíthető.

## GET /api/kategoriak

Válasz példa:

```json
[
  {
    "Id": 1,
    "Nev": "Laptopok",
    "Leiras": "Tanórai munkához használható hordozható számítógépek.",
    "EszkozDarab": 3
  }
]
```

## GET /api/eszkozok?kategoriaId=1&kezdet=2026-05-08&veg=2026-05-10

Válasz példa:

```json
[
  {
    "Id": 1,
    "Gyarto": "Lenovo",
    "Modell": "ThinkPad T480",
    "KategoriaId": 1,
    "KategoriaNev": "Laptopok",
    "Leiras": "Megbízható üzleti laptop.",
    "NapiDij": 3500,
    "Keszlet": 4,
    "Elerheto": true,
    "CsakTanar": false,
    "FoglaltMennyiseg": 1,
    "ElerhetoMennyiseg": 3,
    "Foglalasok": [
      {
        "EszkozId": 1,
        "KolcsonzesId": 1,
        "KolcsonzesKezdete": "2026-05-04T00:00:00.000Z",
        "KolcsonzesVege": "2026-05-07T00:00:00.000Z",
        "Mennyiseg": 1
      }
    ]
  }
]
```

## GET /api/tanarok/ellenorzes/:azonosito

Válasz tanár esetén:

```json
{
  "tanar": true,
  "message": "A megadott azonosító tanárhoz tartozik.",
  "tanarAdat": {
    "Id": 1,
    "Azonosito": "TANAR001",
    "Nev": "Balogh Réka",
    "Email": "balogh.reka@iskola.hu",
    "Telefon": "+36303334455"
  }
}
```

## POST /api/kolcsonzesek

Kérés példa:

```json
{
  "igenyloAzonosito": "TANAR001",
  "igenyloNev": "Balogh Réka",
  "telefon": "+36303334455",
  "email": "balogh.reka@iskola.hu",
  "kolcsonzesKezdete": "2026-05-08",
  "kolcsonzesVege": "2026-05-10",
  "eszkozok": [
    { "eszkozId": 9, "mennyiseg": 1 }
  ]
}
```
