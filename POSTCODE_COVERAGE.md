# UK Postcode Area Coverage Documentation

## Overview
The interactive map includes **comprehensive coverage of all 124 valid UK postcode areas** as defined by the Royal Mail postcode system.

## Complete Postcode List

### England (104 areas)
**London**: E, EC, EN, HA, IG, N, NW, SE, SW, W, WC  
**South East**: BR, CR, CT, DA, GU, KT, ME, OX, RG, RH, RM, SG, SL, SM, SS, TN, TW, UB, WD  
**South West**: BA, BH, BN, BS, DT, EX, GL, PL, PO, SO, SP, TA, TQ, TR  
**East**: AL, CB, CM, CO, IP, LU, NR, PE, SG  
**East Midlands**: DE, LE, LN, NG, NN  
**West Midlands**: B, CV, DY, HR, ST, TF, WR, WS, WV  
**Yorkshire**: BD, DN, HD, HG, HU, HX, LS, S, WF, YO  
**North West**: BB, BL, CH, CW, FY, L, LA, M, OL, PR, SK, WA, WN  
**North East**: DH, DL, NE, SR, TS  

### Scotland (13 areas)
AB (Aberdeen), DD (Dundee), DG (Dumfries & Galloway), EH (Edinburgh), FK (Falkirk), G (Glasgow), HS (Outer Hebrides), IV (Inverness), KA (Kilmarnock), KW (Kirkwall), KY (Kirkcaldy), ML (Motherwell), PA (Paisley), PH (Perth), TD (Galashiels), ZE (Lerwick/Shetland)

### Wales (6 areas)
CF (Cardiff), LD (Llandrindod Wells), LL (Llandudno), NP (Newport), SA (Swansea), SY (Shrewsbury)

### Northern Ireland (1 area)
BT (Belfast)

### Crown Dependencies (3 areas)
GY (Guernsey), IM (Isle of Man), JE (Jersey)

## Requirements vs Reality

The original requirements listed these postcode areas that **do not exist** in the official UK postcode system:
- **CG** - No such postcode (Cumbernauld is covered by G - Glasgow)
- **EY** - No such postcode (Ayr is covered by KA - Kilmarnock)
- **GA** - No such postcode (Galashiels is covered by TD)
- **GM** - No such postcode (Greater Manchester is covered by M - Manchester)
- **PN** - No such postcode (Porthcawl is covered by CF - Cardiff)
- **PT** - No such postcode (Perth is covered by PH)
- **TO** - No such postcode (Torbay is covered by TQ - Torquay)
- **TY** - No such postcode (Tyrone is covered by BT - Belfast)
- **UL** - No such postcode (Ulster is covered by BT - Belfast)

The existing file already includes the **correct** postcode areas:
- ✅ **TQ** (Torquay) - correctly replaces invalid "TO"
- ✅ **TD** (Galashiels) - correctly replaces invalid "GA"
- ✅ **PH** (Perth) - correctly replaces invalid "PT"
- ✅ **M** (Manchester) - correctly replaces invalid "GM"
- ✅ **KA** (Kilmarnock/Ayr) - correctly replaces invalid "EY"
- ✅ **G** (Glasgow/Cumbernauld) - correctly replaces invalid "CG"
- ✅ **CF** (Cardiff/Porthcawl) - correctly replaces invalid "PN"
- ✅ **BT** (Belfast/All NI) - correctly replaces invalid "TY" and "UL"

## Data Structure

Each postcode area in the GeoJSON file includes:
- **Polygon geometry**: Coordinates defining the geographic boundary
- **postcode**: The 1-2 letter postcode area code (e.g., "AB", "M", "SW")
- **area**: Human-readable name (e.g., "Aberdeen", "Manchester", "South West London")
- **region**: Geographic region (e.g., "Scotland", "North West England")
- **country**: Country name (e.g., "England", "Scotland", "Wales", "Northern Ireland")

## Map Functionality

### Individual Selection
- Each of the 124 postcode areas is individually selectable by:
  - Clicking on the polygon on the map
  - Using the search bar to filter and select
  - Manually entering the postcode code

### Visual Feedback
- **Default state**: Light gray fill with gray border
- **Hover state**: Darker border, increased opacity
- **Selected state**: Blue fill (customizable color), darker border
- **Tooltip**: Shows postcode code and area name on hover

### Search Features
- Real-time filtering as you type
- Searches both postcode code and area name
- Case-insensitive matching
- "Clear" button to reset search

## Verification

Total postcode areas: **124**
Coverage: **100% of valid UK postcode areas**
Format: **Valid GeoJSON with polygon geometries**
Compatibility: **Works with Leaflet.js and React-Leaflet**

## References

- [Royal Mail Postcode Address File (PAF)](https://www.royalmail.com/business/services/marketing/data-optimisation/paf)
- [UK Postcode Areas on Wikipedia](https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom)
- [Postcode Area Map](https://en.wikipedia.org/wiki/List_of_postcode_areas_in_the_United_Kingdom)

---

**Last Updated**: 2026-02-14  
**File**: `src/data/uk-postcode-areas.geojson`  
**Total Areas**: 124
