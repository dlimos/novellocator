"""Query named real geography only; results remain candidates until inspected."""
import concurrent.futures,json,urllib.parse,urllib.request
from pathlib import Path
R=Path(__file__).resolve().parent;W=R.parents[1]/'work/lolita'
queries={}
for line in '''District of Columbia|Washington District of Columbia USA
Paris|Paris France
Florida|Florida USA
Danube|Danube River Europe
Dorset|Dorset England
Pisa|Pisa Italy
Lyon|Lyon France
Italy|Italy
Corfu|Corfu Greece
London|London England
Deux Magots|Les Deux Magots Paris France
Auteuil|Auteuil Paris France
England|England United Kingdom
Massachusetts|Massachusetts USA
Nile|Nile River Egypt
Florence|Florence Italy
Vaucluse|Vaucluse France
Madeleine|La Madeleine Paris France
Rue Bonaparte|Rue Bonaparte Paris France
New York|New York City USA
California|California USA
Pasadena|Pasadena California USA
Venice|Venice Italy
Boston|Boston Massachusetts USA
Ocean City|Ocean City New Jersey USA
Columbia University|Columbia University New York City USA
Dayton|Dayton Ohio USA
Ottawa|Ottawa Ontario Canada
Portugal|Portugal
Central Park|Central Park New York City USA
Victoria Island|Victoria Island Northwest Territories Canada
Bermudas|Bermuda
Bahamas|Bahamas
Mexico|Mexico
New Hampshire|New Hampshire USA
Chicago|Chicago Illinois USA
Savannah|Savannah Georgia USA
Vera Cruz|Veracruz Mexico
Philadelphia|Philadelphia Pennsylvania USA
Chile|Chile
Arles|Arles France
Scandinavia|Scandinavia Europe
Canada|Canada
Maine|Maine USA
New Mexico|New Mexico USA
Vienna|Vienna Austria
Eiffel Tower|Eiffel Tower Paris France
Niagara|Niagara Falls USA Canada
St. Louis|Saint Louis Missouri USA
Cincinnati|Cincinnati Ohio USA
Pennsylvania|Pennsylvania USA
Virginia|Virginia USA
Arkansas|Arkansas USA
Oklahoma|Oklahoma USA
Louisiana|Louisiana USA
Lourdes|Lourdes France
Kansas|Kansas USA
Georgia|Georgia USA
Mississippi|Mississippi USA
Colorado|Colorado USA
Russian Gulch|Russian Gulch State Park California USA
Cannes|Cannes France
Arizona|Arizona USA
Utah|Utah USA
Milner Pass|Milner Pass Colorado USA
Little Rock|Little Rock Arkansas USA
Phoenix|Phoenix Arizona USA
Los Angeles|Los Angeles California USA
Burns|Burns Oregon USA
Oregon|Oregon USA
Sun Valley|Sun Valley Idaho USA
Idaho|Idaho USA
Pinedale|Pinedale Wyoming USA
Farson|Farson Wyoming USA
Nebraska|Nebraska USA
Michigan|Michigan USA
Blue Licks|Blue Licks Battlefield State Resort Park Kentucky USA
Bourbon Street|Bourbon Street New Orleans Louisiana USA
New Orleans|New Orleans Louisiana USA
Independence|Independence Missouri USA
Missouri|Missouri USA
Abilene|Abilene Kansas USA
Texas|Texas USA
Shakespeare|Shakespeare Ghost Town New Mexico USA
Reno|Reno Nevada USA
Nevada|Nevada USA
Death Valley|Death Valley California USA
Scotty|Scotty's Castle Death Valley California USA
Mission Dolores|Mission Dolores San Francisco California USA
Crater Lake|Crater Lake Oregon USA
Yellowstone|Yellowstone National Park USA
North Dakota|North Dakota USA
South Dakota|South Dakota USA
Indiana|Indiana USA
Alabama|Alabama USA
Minnesota|Minnesota USA
Greece|Greece
Naples|Naples Italy
Providence|Providence Rhode Island USA
Brooklyn|Brooklyn New York City USA
New Brunswick|New Brunswick Canada
Tennessee|Tennessee USA
Vermont|Vermont USA
Switzerland|Switzerland
Ohio|Ohio USA
Algiers|Algiers Algeria
Cedar City|Cedar City Utah USA
Porlock|Porlock England
Elmira|Elmira New York USA
Sheridan|Sheridan Wyoming USA
Wyoming|Wyoming USA
Lebanon|Lebanon New Hampshire USA
Geneva|Geneva New York USA
Tombstone|Tombstone Arizona USA
Quebec|Quebec Province Canada
Montreal|Montreal Quebec Canada
Dunkerque|Dunkirk France
Cape Cod|Cape Cod Massachusetts USA
India|India
Alaska|Alaska USA
Juneau|Juneau Alaska USA
Moulinet|Moulinet Alpes Maritimes France
Patagonia|Patagonia Argentina
Jardin des Plantes|Jardin des Plantes Paris France
Provence|Provence France
Russia|Russia
St. Petersburg|Saint Petersburg Russia
Ithaca|Ithaca New York USA
Telluride|Telluride Colorado USA
Afton|Afton Wyoming USA
Portal|Portal Arizona USA
Ashland|Ashland Oregon USA
France|France
Germany|Germany
Spain|Spain
United States|United States'''.splitlines():
 key,q=line.split('|');queries[key]=q
present={r['name']for r in json.loads((W/'reference-census.json').read_text(encoding='utf-8'))}
queries={k:q for k,q in queries.items()if k in present}
out=W/'coordinate-candidates.json'
cached=json.loads(out.read_text(encoding='utf-8'))if out.exists()else{}
def fetch(item):
 key,q=item
 if key in cached and cached[key].get('candidates'):return key,cached[key]
 url='https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?'+urllib.parse.urlencode({'SingleLine':q,'f':'json','outFields':'Match_addr,Addr_type','maxLocations':3})
 try:
  with urllib.request.urlopen(url,timeout=30)as f:payload=json.load(f)
  return key,{'query':q,'url':url,'retrieved':'2026-10-13','candidates':payload.get('candidates',[]),'reviewStatus':'pending'}
 except Exception as e:return key,{'query':q,'url':url,'error':str(e),'reviewStatus':'pending'}
with concurrent.futures.ThreadPoolExecutor(max_workers=4)as pool:result=dict(pool.map(fetch,queries.items()))
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for k,v in result.items():
 c=v.get('candidates',[])
 print(k,[(p['address'],p['score'],p['location'],p['attributes'].get('Addr_type'))for p in c[:1]]or v.get('error','NO MATCH'))
