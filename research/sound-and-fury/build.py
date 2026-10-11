"""Local editorial import; quotes are sliced from complete, independently saved originals."""
import json, pathlib, re, hashlib
ROOT=pathlib.Path(__file__).resolve().parents[2]
R=ROOT/'research/sound-and-fury'
ID='sound-and-fury'
DY='https://faulkner.iath.virginia.edu/shanti/content/sound-and-fury'
APP='https://drc.usask.ca/projects/faulkner/moved/main/appendix/index.html'
titles=['April Seventh, 1928','June Second, 1910','April Sixth, 1928','April Eighth, 1928','Appendix · Compson 1699–1945']
urls=['https://en.wikisource.org/wiki/The_Sound_and_the_Fury/'+s.replace(' ','_') for s in titles[:4]]+[APP]
texts=[json.loads((R/f'{i}.json').read_text(encoding='utf8')) for i in range(1,6)]
# id | editorial name | source paragraph/line | exact form | action/mentioned | interpretation.
specs=[r'''
pasture|Compson pasture and golf course|0|fence|action|The former pasture has become a golf course; Benjy watches from its boundary.
garden|Compson garden and fence opening|7|garden|action|Luster and Benjy return through the garden; the opening joins the pasture to the grounds.
kitchen|Compson kitchen|750|kitchen|action|Present action and domestic memories overlap.
dining|Compson dining room|26|dining-room|action|The household eats here in Benjy's recollections.
yard|Compson back yard|27|yard|action|The children and servants move through the domestic grounds.
gate|Compson gate and street|30|gate|action|The gate links the enclosed household to the street and Benjy's encounter with the girls.
house|Compson house|41|house|action|The fictional family house; its several rooms remain separately documented.
hall|Compson hall|66|hall|action|The hall connects the household rooms.
carriage|Compson carriage house|68|carriage house|action|The carriage is kept in a separate outbuilding.
square|Jefferson square|113|square|action|The town square is recalled on the carriage route; Jefferson is fictional.
monument|Jefferson Confederate monument|106|soldier|action|The square's soldier monument orders Benjy's familiar visual world.
cemetery|Jefferson cemetery|108|cemetery|mentioned|Mother announces a cemetery visit; this passage does not establish arrival.
barn|Compson barn and crib|122|barn|action|The barn, animal stalls and crib belong to the childhood grounds.
branch|Compson branch|124|branch|action|The stream is a recurring childhood setting; no real stream coordinates are asserted.
patterson|Patterson house and garden|126|Patterson|action|Uncle Maury's letters connect the children to Mrs Patterson's neighboring house.
parlor|Compson parlor|269|parlor|action|Damuddy's funeral and the children's restricted access to the room.
cabin|Dilsey's family cabin|341|house|action|Versh's, T.P.'s and Dilsey's house refer to the Gibson family's cabin.
memphis|Memphis|383|Memphis|mentioned|Versh's move is reported to Benjy.
nancy-ditch|Ditch containing Nancy's bones|420|ditch|action|Nancy is the horse; this ditch must not be confused with a human grave.
funeral-tree|Tree beside the Compson parlor|505|tree|action|Caddy climbs the tree to see into the funeral room.
cellar|Compson cellar|513|cellar|action|T.P. and Benjy's wedding-day drinking episode.
mother-room|Caroline Compson's room|528|room|action|Mother's bedroom within the house.
bathroom|Compson bathroom|541|bathroom|action|Caddy washes away perfume and later restores Benjy's trust.
caddy-room|Caddy's room|548|room|action|A remembered bedroom distinct from her daughter's room.
maury-room|Uncle Maury's room|557|room|action|The children reach the uncle's bedroom.
arcadia|Arcadia in the epitaph|571|Arcadia|mentioned|Classical allusion in the father's speech; no literal journey or uniquely locatable setting.
swing|Swing in the Compson cedar grove|612|swing|action|Miss Quentin's meetings echo Caddy's earlier meetings here.
jackson|Jackson, Mississippi|694|Jackson|mentioned|The threatened institutionalization refers to the state asylum, not an accomplished journey.
burgess|Burgess house and schoolgirls' route|694|Burgess|mentioned|Mrs Burgess is invoked after Benjy's encounter; the house itself is not visited in this passage.
toy-graveyard|Benjy's bottle graveyard|727|bottle|action|A play cemetery in the cedar grove, distinct from Jefferson cemetery.
cedars|Compson cedar grove|743|cedars|action|The wooded remnant surrounding the swing and toy graveyard.
library|Compson library|809|library|action|Family recollection inside the house.
bluegum-woods|Woods in the bluegum story|943|woods|mentioned|An embedded anecdote with no identifiable physical location.
measles-room|Children's sickroom|990|measles|action|The children's measles memory; a room within the Compson house.
quentin-room|Miss Quentin's room and pear tree|1005|Quentin|action|Her window connects the room to the tree and nighttime escape route.
''',r'''
harvard|Harvard University|14|quad|action|Quentin's college setting; the exact dormitory is unidentified.
new-london|New London, Connecticut|4|New London|mentioned|The college boat race is mentioned; Quentin does not travel there that day.
south-carolina|South Carolina|14|South Carolina|mentioned|Spoade's origin.
thompsons|Thompson's restaurant|14|Thompson|mentioned|A restaurant named in the college reminiscence; no verified address.
galilee|Galilee|17|Galilee|mentioned|Biblical allusion, not a journey by Quentin.
st-louis|Saint Louis|17|Saint Louis|mentioned|The fair in a remembered comparison.
niagara|Niagara Falls|17|Niagara|mentioned|A souvenir reproduces the falls; no visit is asserted.
cambridge-post|Cambridge post office|27|postoffice|action|Quentin mails his letter.
parkers|Parker's restaurant, Boston|30|Parker|action|Digital Yoknapatawpha tentatively identifies Parker House; that identification remains qualified.
boston|Boston|154|Boston|action|Quentin's travel across the metropolitan area; city-level marker.
jeweller|Boston jeweller's shop|32|window|action|Quentin examines the watches; the shop's street address is unknown.
hardware-boston|Boston hardware store|53|hardware|action|Quentin obtains flat irons; distinct from Jason's Jefferson store.
virginia|Virginia|55|Virginia|action|A remembered railway journey at Christmas, not the present day's travel.
mississippi-river|Mississippi River|62|Mississippi|mentioned|A teaching/recollection passage; river marker is representative.
charles|Charles River and drawbridge|70|bridge|action|The river and drawbridge are identified contextually by Digital Yoknapatawpha; no exact bridge or suicide point is claimed.
oxford-england|Oxford, England|72|Oxford|mentioned|English students provide a comparison for Gerald's rowing clothes.
kentucky|Kentucky|73|Kentucky|mentioned|The Blands' origin.
massachusetts|Massachusetts|72|Massachusetts|action|The rower and car move along parallel courses in the present geographical setting.
new-york|New York|73|New York|mentioned|Clothing is bought there; no trip by Quentin is asserted.
cambridge|Cambridge, Massachusetts|73|Cambridge|action|Quentin's college town and the Blands' residence.
mason-dixon|Mason–Dixon boundary|73|Mason|mentioned|A cultural boundary invoked in the comparison, not a surveyed point or itinerary.
china|China|74|Chinese|mentioned|Chinese silk is a geographical provenance allusion.
jefferson|Jefferson, Mississippi|82|Jefferson|action|The wedding announcement recalls Caddy's marriage in the fictional town.
south-bend|South Bend, Indiana|82|South Bend|mentioned|The announcement gives the couple's intended home; the street is deliberately unspecified.
french-lick|French Lick, Indiana|93|French Lick|action|Caddy and her mother met Herbert at the resort; this is remembered action.
princeton|Princeton, New Jersey|106|Princeton|mentioned|The club hat supplies a university reference, not a visit.
new-england|New England|215|New England|action|The northern landscape prompts comparison with Mississippi.
mississippi|Mississippi|215|Mississippi|mentioned|Quentin compares the northern vegetation with home.
jackson|Jackson, Mississippi|218|Jackson|mentioned|Benjy's possible commitment is discussed.
hunting-woods|Woods in the Louis Hatcher hunting recollection|229|Louis Hatcher|action|Louis Hatcher's night hunting enters Quentin's Southern recollection; no precise woodland is named.
pennsylvania|Pennsylvania|231|Pennsylvania|mentioned|The flood anecdote invokes Pennsylvania; it does not name Johnstown.
cemetery-knoll|Knoll behind Jefferson cemetery|234|graveyard|action|A remembered landscape of home, not part of the Massachusetts outing.
rural-bridge|Stone bridge over the rural stream|249|bridge|action|An unnamed bridge outside the city, distinct from the Charles drawbridge.
eddy|The Eddy fishing place|275|Eddy|mentioned|The boys propose a fishing spot; its location is unspecified.
bigelow|Bigelow's Mill and swimming hole|276|Bigelow|mentioned|The boys name the mill; the later bathing scene is documented separately.
unitarian|Unitarian church and steeple|286|Unitarian|mentioned|A visible landmark in the invented rural geography.
orchard|Rural orchard and lane|314|orchard|action|Quentin crosses the orchard and lane on his wandering route.
coventry|Coventry in the idiom|326|Coventry|mentioned|Sent to Coventry is an idiom for exclusion; no literal Coventry journey.
bakery|Rural bakery|338|bread|action|Quentin buys bread for the little girl; village unidentified.
rural-drugstore|Rural drugstore|363|drugstore|action|Quentin buys ice cream, continuing to search for the child's home.
livery-rural|Rural livery stable|382|stable|action|Inquiry while escorting the child.
italian-neighborhood|Italian neighborhood outside Cambridge|389|houses|action|Neighborhood reconstructed from the child's route, without an asserted town identification.
rural-station|Rural railway station|389|station|action|Part of Quentin's search route.
rural-post|Rural post office|386|postoffice|action|Quentin asks about the little girl.
woodlot|Woodlot outside Cambridge|403|woodlot|action|The child's pursuit continues through the rural landscape.
barn|Compson barn and crib|417|barn|action|Natalie's remembered encounter belongs to the Southern childhood setting.
swimming|Rural swimming hole|442|swimming|action|The boys are seen bathing; identification with the mill vicinity is contextual.
squire|Squire's courtroom|489|Squire|action|Quentin is detained after Julio's accusation.
rural-house|Rural house with the pink garment|549|house|action|A landmark during the return from detention.
england|England|556|England|mentioned|Comparison involving a motoring cap.
canada|Canada|557|Canada|mentioned|Gerald's reported fishing trip.
bathroom|Compson bathroom|562|bathroom|action|The remembered household episode of Caddy, Benjy and the bathroom.
oceans|Oceans in Dalton Ames's reported travels|574|oceans|mentioned|Generalized ocean travel; no specific ocean is supplied.
nancy-ditch|Ditch containing Nancy's bones|636|ditch|action|A childhood recollection of the horse's remains.
square|Jefferson square|687|square|action|The home-town courthouse clock enters the recollection.
swing|Swing in the Compson cedar grove|731|swing|action|Caddy's remembered rendezvous.
barber|Jefferson barbershop|739|barber|action|Quentin questions Dalton Ames in the recollection.
hotel-jefferson|Dalton Ames's possible hotel|745|hotel|mentioned|Quentin asks whether Dalton is staying there; the question is not proof of lodging.
creek-bridge|Bridge over the creek near Jefferson|746|bridge|action|Quentin's confrontation with Dalton; distinct from the Massachusetts bridges.
picnic|Rural picnic site and farmhouse|850|pump|action|The Blands' gathering and Quentin's recovery after the fight; no exact farm.
mikes|Mike's boxing establishment, Boston|873|Mike|mentioned|Gerald's boxing connection is reported, not visited by Quentin here.
atlantic-city|Atlantic City, New Jersey|881|Atlantic City|action|Gerald's embedded story recalls the resort, hotel, dancing and pier.
memphis|Memphis|904|Memphis|action|A remembered brothel incident; city marker does not identify a building.
egypt|Egypt|904|Egypt|mentioned|Biblical Benjamin allusion.
maine|Maine|918|Maine|mentioned|Father's proposal for rest, never an accomplished journey in this section.
''',r'''
kitchen|Compson kitchen|30|kitchen|action|Jason's morning confrontation begins in the domestic kitchen.
harvard|Harvard University|10|Harvard|mentioned|Jason resents the education funded by the family.
store|Jefferson farm-supply and hardware store|10|store|action|Jason works for Earl; the building is fictional.
dining|Compson dining room|30|diningroom|action|Breakfast and the evening meal.
carriage|Compson carriage house|74|car|action|The old outbuilding functions as a garage.
pasture|Compson pasture and golf course|79|field|mentioned|Jason refers to the family's lost land.
jackson|Jackson, Mississippi|79|Jackson|mentioned|The asylum remains a threatened destination in the 1928 narrative.
beards|Beard's lot and travelling show|93|Beard|action|The show is set up in the town lot; Jason passes its surroundings.
school|Jefferson school|94|school|action|Jason visits to investigate Miss Quentin's absence.
post-jefferson|Jefferson post office|99|postoffice|action|Letters and money connect the family to Caddy.
new-york|New York|117|New York|mentioned|Cotton speculation depends on market quotations and offices in New York.
telegraph|Jefferson telegraph office|122|telegraph|action|Jason checks and sends market messages.
memphis|Memphis|134|Memphis|action|Jason's remembered visits and relationship with Lorraine.
china|China|138|Chinese|mentioned|A missionary comparison invokes Chinese origins; no particular mission is identified.
sewanee|Sewanee, Tennessee|148|Sewanee|mentioned|Jason's preferred university for Benjy is a taunt, not a journey.
state-university|State University baseball ground|450|state University|action|The unnamed state university is not automatically assigned a Mississippi campus.
cemetery|Jefferson cemetery|183|shovel|action|Jason recalls the father's funeral and Caddy's visit.
black-cemetery|Black cemetery sector, Jefferson|185|graveyard|action|The funeral recollection distinguishes the segregated burial ground.
livery-jefferson|Jefferson livery stable|216|livery|action|Jason hires the hack for Caddy's brief view of her daughter.
station-jefferson|Jefferson railway station|216|depot|action|Caddy's train departure frames the coercive carriage ride.
rogers|Rogers' restaurant, Jefferson|249|Rogers|mentioned|Earl's lunch arrangements, not a meal by Jason.
printing|Jefferson printing shop|309|printing|action|The childhood job and discarded bank stationery are recalled.
opera|Old Jefferson opera house|309|opera|action|The printing shop occupies the former opera-house building.
failed-bank|Merchants' and Farmers' Bank|309|Bank|mentioned|The failed bank's papers are used for the forged letter.
st-louis|Saint Louis|309|Saint Louis|mentioned|The stationery recalls an outside bank; no trip is asserted.
indianapolis|Indianapolis, Indiana|339|Indianapolis|mentioned|An Indianapolis bank is mentioned in the financial correspondence.
mississippi|Mississippi|371|Mississippi|mentioned|Jason's family and business operate in the state; this particular reference is comparative.
milk-honey|Milk street and Honey avenue|372|Milk|mentioned|Sarcastic imaginary addresses; not plotted as real streets.
bank|Current Jefferson bank|409|bank|action|Jason's banking visit, distinct from the failed bank of the forged letter.
louisville|Louisville, Kentucky|443|Louisville|mentioned|Rhetorical destination in Jason's speculation about the runaway car.
gayoso|Gayoso area, Memphis|449|Gayoso|mentioned|Comparison to Lorraine's clothing, without a visit in this day's action.
beale|Beale Street, Memphis|449|Beale|mentioned|Jason's comparison invokes a real Memphis street; marker represents the street only.
delta|Mississippi Delta|452|Delta|mentioned|Flood and cotton-market anxieties; regional marker.
washington|Washington, D.C.|452|Washington|mentioned|Federal politicians are invoked in Jason's complaints.
nicaragua|Nicaragua|452|Nicaragua|mentioned|Political and military-policy reference.
forks|Forks in the rural road|492|forks|action|Jason stops at the road junction during the pursuit.
ab-russell|Ab Russell's farm and barn|495|Russell|action|Jason pursues the Ford through the farm and field.
sand-ditch|Rural sand ditch and hidden Ford|500|ditch|action|The couple's concealed vehicle is a separate pursuit landmark.
drugstore-jefferson|Jefferson drugstore|505|drugstore|action|Jason returns to town and seeks relief for the headache.
methodist|Jefferson Methodist church|538|Methodist|mentioned|The sunset landmark prompts a recollection of shooting pigeons.
square|Jefferson square|546|square|action|Jason moves through the courthouse business district.
library|Compson library|628|room|action|Family interaction inside the living room.
jason-room|Jason's room and money box|727|room|action|Jason's hoard and locked private room.
''',r'''
cabin|Dilsey's family cabin|0|cabin|action|Dilsey leaves her cabin on Easter morning.
mexico|Mexico|2|Mexican|mentioned|A comparison to Mexican houses; not a Mexican scene.
kitchen|Compson kitchen|2|kitchen|action|Dilsey prepares breakfast and attends to the household.
cellar|Compson cellar|17|cellar|action|Domestic service moves through the house and cellar.
quentin-room|Miss Quentin's room and pear tree|147|room|action|Jason discovers his niece has escaped.
jason-room|Jason's room and money box|154|room|action|The broken money box precipitates Jason's pursuit.
st-louis|Saint Louis|219|Looey|mentioned|Reverend Shegog's visiting origin, in the dialogue's original spelling.
black-neighborhood|Black neighborhood of Jefferson|229|cabins|action|Dilsey, Frony, Luster and Benjy walk through the segregated neighborhood to church.
black-church|Black church in Jefferson|248|church|action|The Easter congregation and Reverend Shegog's sermon.
egypt|Egypt|262|Egypt|mentioned|Biblical geography evoked in the Easter sermon.
calvary|Calvary in the sermon|269|Calvary|mentioned|Sacred narrative geography; no precise hill coordinates are asserted.
heaven-hell|Heaven and hell in the sermon|271|heaven|mentioned|Religious imagery without terrestrial coordinates.
house|Compson house|282|house|action|The domestic setting contrasts with the Easter service.
sheriff|Sheriff's house, Jefferson|316|house|action|Jason seeks official assistance.
mottson|Mottson|338|Mottson|action|Jason pursues the travelling show in the fictional nearby town.
russia|Russia|353|Russia|mentioned|Jason's political comparison.
gas-jefferson|Jefferson filling station|354|filling station|action|Jason starts the car journey after obtaining fuel.
road-mottson|Road between Jefferson and Mottson|363|Mottson|action|The pursuit route; no actual Mississippi highway is substituted.
churches-south|Churches south of Jefferson|362|churches|mentioned|Country churches seen along the Sunday road.
gas-mottson|Mottson filling station|366|filling station|action|Jason asks about the show cars.
station-mottson|Mottson railway station and show galley|367|station|action|The station, circus cars and galley are the site of Jason's confrontation.
drugstore-mottson|Closed Mottson drugstore|408|drugstore|mentioned|The closed shop frustrates Jason's attempt to obtain medicine.
toy-graveyard|Benjy's bottle graveyard|437|bottle|action|Luster tends Benjy's miniature burial ground.
pasture|Compson pasture and golf course|439|green|action|The closing scenes return to the lost pasture.
st-johns|St John's church|449|John|mentioned|T.P.'s proposed church visit; location not reliably identified.
cemetery|Jefferson cemetery|457|graveyard|mentioned|The carriage outing intends a cemetery visit; the narrative ends before arrival.
square|Jefferson square|485|square|action|Luster drives the carriage around the square.
monument|Jefferson Confederate monument|485|monument|action|The wrong turn disrupts Benjy's familiar ordered view.
''',r'''
france|France|2|France|mentioned|The French chevalier's origin.
mississippi|Mississippi|8|Mississippi|action|The Compson land grant in North Mississippi.
jefferson|Jefferson, Mississippi|10|Jefferson|action|The fictional town's early Chickasaw trading post.
oklahoma|Oklahoma|17|Oklahoma|action|Removal of the Chickasaw is narrated historically in the family account.
washington|Washington, D.C.|24|Wassi Town|action|The appendix's Wassi Town denotes the federal seat; contextual identification.
glasgow|Glasgow, Scotland|30|Glasgow|mentioned|The printer's origin.
perth|Perth Highlands, Scotland|31|Perth|action|Quentin MacLachan's upbringing; regional position only.
carolina|Carolina|31|Carolina|action|The early family's migration; the appendix does not specify one modern Carolina state.
culloden|Culloden Moor, Scotland|32|Culloden|action|Flight after the battle; place remembered in the family history.
england|England|34|English|mentioned|The monarch's nationality, not a narrated English setting.
georgia|Georgia|37|Georgia|action|The battlefield where Charles Stuart is thought dead.
kentucky|Kentucky|37|Kentucky|action|Refuge with the infant grandson.
harrodsburg|Harrodsburg, Kentucky|43|Harrodsburg|action|Charles Stuart rejoins his family.
mississippi-valley|Mississippi Valley|53|Mississippi Valley|mentioned|The proposed secession is a political plan.
united-states|United States|53|United States|mentioned|The political territory targeted by the scheme.
spain|Spain|53|Spain|mentioned|The intended political allegiance, not accomplished travel to Spain.
natchez-trace|Natchez Trace|71|Natchez Trace|action|Jason Lycurgus's 1811 route; a representative marker for the historic corridor.
okatoba|Okatoba and Chickasaw Agency|76|Okatoba|action|The appendix's earlier name for Old Jefferson; fictional trading-post location.
domain|Compson Domain, grounds and mansion|98|Compson Domain|action|The larger ancestral property includes gardens, slave quarters and stables, later fragmented.
new-orleans|New Orleans|88|New Orleans|mentioned|The house furnishings are shipped from there; not a journey by the family.
shiloh|Shiloh battlefield|108|Shiloh|action|The brigadier's military history.
resaca|Resaca battlefield, Georgia|108|Resaca|action|The second named military failure.
new-england|New England|110|New England|mentioned|The mortgage holder's origin.
tallahatchie|Tallahatchie River bottom|116|Tallahatchie|action|The general's final hunting and fishing camp; river-basin marker, not an exact camp.
law-office|Jason III's law office above Jefferson square|123|office|action|An upstairs professional office, distinct from Jason IV's later dwelling.
cabin|Dilsey's family cabin|137|cabin|action|The surviving family servant's cabin.
harvard|Harvard University|139|Harvard|action|Quentin's year at college.
jackson|Jackson, Mississippi|149|Jackson|action|The appendix adds Benjy's commitment in 1933; this is not an event in the 1928 sections.
house|Compson house and later boardinghouse|149|house|action|The family home is sold and converted before later redevelopment.
cambridge|Cambridge, Massachusetts|168|Cambridge|action|Quentin's death is explicitly located here.
french-lick|French Lick, Indiana|193|French Lick|action|Caddy meets Herbert during the vacation.
hollywood|Hollywood, California|194|Hollywood|action|Caddy's second marriage.
mexico|Mexico|195|Mexico|action|The divorce by agreement.
paris|Paris|195|Paris|action|Caddy disappears during the German occupation.
library-town|Jefferson public library|212|library|action|Melissa Meek's workplace and the clipping discovery.
memphis|Memphis|293|Memphis|action|Melissa's visit to Dilsey; the city also frames Jason's and the Gibsons' later lives.
store|Jefferson farm-supply and hardware store|223|store|action|Melissa confronts Jason in the business he now owns.
cannebiere|Cannebière backdrop in the clipping|245|Cannebière|mentioned|An uncertain photographed Mediterranean backdrop; not sufficient evidence for an exact Marseille or Cannes location.
frony-house|Frony's house and Dilsey's room, Memphis|293|house|action|The domestic visit in 1943; no address is given.
bus-memphis|Memphis bus terminal|328|bus terminal|action|Melissa's return journey begins here; terminal building unidentified.
jason-apartment|Jason IV's apartment above the store|397|supplystore|action|The later converted offices, distinct from the ancestral-house bedroom.
cinema|Jefferson picture show|403|show|action|Jason and his companion's Saturday outing.
egypt|Egypt|416|Egypt|mentioned|The Biblical Benjamin allusion.
beale|Beale Street, Memphis|479|Beale Street|action|T.P.'s clothing and presence in Memphis.
chicago|Chicago|481|Chicago|mentioned|Manufacturing origin of the clothes.
new-york|New York|481|New York|mentioned|Manufacturing origin of the clothes.
st-louis|Saint Louis|483|St Louis|action|Frony's residence before returning to Memphis.
''']

specs[0]+="\nmedical|Benjy's unidentified medical setting|708|breathed|action|The breathing recollection suggests anesthesia; Digital Yoknapatawpha treats the operation site as uncertain.\n"
specs[1]+="\nhavana|Havana, Cuba|172|Havana|mentioned|Herbert's cigars come from a friend in Havana.\nbranch|Compson branch|687|branch|action|Quentin remembers Caddy beside the stream near home.\nharvard-room|Quentin's Harvard room and quad|0|curtains|action|The day begins and ends in the college residence; the exact building is unspecified.\nboathouses|Charles River boathouses|72|boathouses|action|Gerald launches his shell; no exact rowing building is identified.\ntrolley|Cambridge and Boston trolley|55|street car|action|The metropolitan transit vehicle links Quentin's stops.\ninterurban|Massachusetts interurban train|154|interurbans|action|Quentin's rural outing uses regional transport; no exact line is supplied.\n"
specs[3]+="\nbiblical-bethlehem|Bethlehem evoked in the sermon|266|Jesus|mentioned|Digital Yoknapatawpha identifies the Nativity episode contextually with Bethlehem; the name does not occur in the passage.\nbiblical-jerusalem|Jerusalem evoked in the sermon|269|Calvary|mentioned|Critical identification of the Crucifixion setting; the city name does not occur in the passage.\n"

mapped_queries={
 'memphis':'Memphis, Tennessee','jackson':'Jackson, Mississippi','harvard':'Harvard University, Cambridge, Massachusetts','new-london':'New London, Connecticut','south-carolina':'South Carolina, USA','galilee':'Galilee, Israel','st-louis':'Saint Louis, Missouri','niagara':'Niagara Falls, New York','boston':'Boston, Massachusetts','virginia':'Virginia, USA','mississippi-river':'Mississippi River, USA','oxford-england':'Oxford, England','kentucky':'Kentucky, USA','massachusetts':'Massachusetts, USA','new-york':'New York City, USA','cambridge':'Cambridge, Massachusetts','china':'China','south-bend':'South Bend, Indiana','french-lick':'French Lick, Indiana','princeton':'Princeton University, New Jersey','new-england':'New England, USA','mississippi':'Mississippi, USA','pennsylvania':'Pennsylvania, USA','england':'England, United Kingdom','canada':'Canada','atlantic-city':'Atlantic City, New Jersey','egypt':'Egypt','maine':'Maine, USA','sewanee':'Sewanee, Tennessee','indianapolis':'Indianapolis, Indiana','louisville':'Louisville, Kentucky','beale':'Beale Street, Memphis, Tennessee','delta':'Mississippi Delta, Mississippi','washington':'Washington, DC','nicaragua':'Nicaragua','mexico':'Mexico','russia':'Russia','france':'France','oklahoma':'Oklahoma, USA','glasgow':'Glasgow, Scotland','perth':'Perth, Scotland','culloden':'Culloden Battlefield, Scotland','georgia':'Georgia, USA','harrodsburg':'Harrodsburg, Kentucky','mississippi-valley':'Mississippi River, USA','united-states':'United States','spain':'Spain','natchez-trace':'Natchez Trace Parkway, Mississippi','new-orleans':'New Orleans, Louisiana','shiloh':'Shiloh National Military Park, Tennessee','resaca':'Resaca Battlefield, Georgia','tallahatchie':'Tallahatchie River, Mississippi','hollywood':'Hollywood, Los Angeles, California','paris':'Paris, France','chicago':'Chicago, Illinois'
}
mapped_queries['havana']='Havana, Cuba'

def records():
 result=[]
 for s,block in enumerate(specs,1):
  for line in block.strip().splitlines():
   if not line.strip():continue
   ident,name,index,term,category,note=line.split('|');index=int(index)
   # An explicit paragraph identifies the evidence; no generated prose is used as a quotation.
   p=texts[s-1][index]
   if term.casefold() not in p.casefold():
    near=[(i,t) for i,t in enumerate(texts[s-1]) if abs(i-index)<12 and term.casefold() in t.casefold()]
    raise ValueError(f'{s}/{ident}/{index}: {term!r} absent; nearby candidates {[i for i,t in near]}')
   pos=p.casefold().index(term.casefold());actual=p[pos:pos+len(term)]
   if s==5:
    # Keep total appendix quotations short; provide exact, source-linked geographical clauses.
    left=list(re.finditer(r'\S+',p[:pos]));right=list(re.finditer(r'\S+',p[pos+len(term):]))
    start=left[-1].start() if left else pos
    end=pos+len(term)+(right[0].end() if right else 0)
    quote=p[start:end]
   else:
    start=max(0,pos-65);end=min(len(p),pos+len(term)+125)
    if start: start=p.find(' ',start)+1
    if end<len(p):end=p.rfind(' ',start,end)
    quote=p[start:end]
   assert quote in p and actual in quote
   result.append(dict(section=s,id=ident,name=name,paragraph=index,term=actual,category=category,note=note,quote=quote,url=urls[s-1]))
 return result

def build():
 refs=records();coords=json.loads((R/'coordinates.json').read_text(encoding='utf8'))
 data={'book':{'id':ID,'title':'The Sound and the Fury','author':'William Faulkner','year':'1929','originalLanguage':'en','unit':'section','hashPrefix':'section','description':'Four narrative sections and the later Compson appendix: memories, journeys and the changing geography of a Southern family.','sidebarTitle':'The four days and the appendix','help':'Choose a section or explore the geographical references.','sidebarNote':'Jefferson, Mottson and unverified interiors remain without coordinates. The appendix is a later text with documented differences.','initialView':{'center':[-89.5,34.4],'zoom':5},'citationCsvPrefix':ID+'-citations','links':[{'url':urls[0].rsplit('/',1)[0],'label':'Original English · scanned 1931 printing'},{'url':DY,'label':'University of Virginia · Digital Yoknapatawpha'},{'url':APP,'label':'University of Saskatchewan · Compson appendix'}]},'chapters':[],'places':{},'citedPlaces':{}}
 attribution='William Faulkner · The Sound and the Fury · Jonathan Cape and Harrison Smith, 1931 third printing (original publication 1929) · Wikisource'
 for i,title in enumerate(titles,1):
  chapter={'id':i,'title':title,'time':['1928, with childhood memories','1910, with Southern memories','1928, with family memories','Easter Sunday 1928','1699–1945; appendix written 1945, published 1946'][i-1],'setting':'Jefferson and the Compson grounds' if i in [1,3,4] else 'Cambridge, Boston and remembered Southern places' if i==2 else 'Compson migrations and later family history','people':['Benjy, Luster and the remembered household','Quentin, Shreve, the Blands, Caddy','Jason, Caroline, Miss Quentin and Earl','Dilsey, Benjy, Luster, Jason and Reverend Shegog','The Compsons and the Gibson family'][i-1],'text':['Benjy moves between the present and childhood without chronological transitions.','Quentin wanders through Massachusetts as memories of Caddy and home interrupt the day.','Jason narrates his financial grievances and pursues his niece.','Dilsey attends the Easter service while Jason pursues the travelling show.','A later genealogy extends the family history beyond the original ending.'][i-1],'note':data['book']['sidebarNote'],'links':[{'url':urls[i-1],'label':title},{'url':DY if i<5 else 'https://faulkner.iath.virginia.edu/shanti/content/appendix-compson','label':'Digital Yoknapatawpha · critical context'}],'places':[],'placeText':[],'placeExcerpts':{},'citations':[],'unlocatedPlaces':[]}
  for ref in [r for r in refs if r['section']==i]:
   src=attribution+' · '+title+' · paragraph '+str(ref['paragraph']+1) if i<5 else 'William Faulkner · Compson 1699–1945 (1946) · University of Saskatchewan transcription · '+ref['id']
   original={'quote':ref['quote'],'language':'en','url':ref['url'],'attribution':src,'type':'original','rightsUrl':ref['url'],'highlightTerms':[ref['term']],'sourceParagraph':ref['paragraph']+1}
   if ref['id'] in coords:
    geo=coords[ref['id']];place=data['places'].setdefault(ref['id'],{'name':ref['name'],'area':geo['query'],'kind':'area' if ref['id'] in ['russia','canada','china','mississippi','massachusetts','kentucky','south-carolina','virginia','maine','pennsylvania','new-england','delta','france','oklahoma','england','georgia','mexico','egypt','united-states','spain','nicaragua','mississippi-valley','tallahatchie','natchez-trace','perth'] else ('street' if ref['id']=='beale' else 'historical' if ref['id'] in ['shiloh','resaca'] else 'area'),'coords':geo['coords'],'zoom':5 if geo['score']<100 else 10,'checked':'2026-10-11','status':'Representative geographical position','note':'The marker identifies the named area or institution, not an exact character position.','method':'ArcGIS World Geocoding Service; editorially reviewed result.','positionSource':{'url':geo['url'],'label':'ArcGIS · '+geo['address']},'narrativeSource':{'url':DY,'label':'Digital Yoknapatawpha · textual and interpretive context'},'aliases':[]})
    if ref['term'] not in place['aliases']:place['aliases'].append(ref['term'])
    if ref['category']=='action':chapter['places'].append(ref['id']);chapter['placeText'].append(ref['note']);chapter['placeExcerpts'][ref['id']]={'original':original,'translations':{}}
    else:chapter['citations'].append({'placeId':ref['id'],'category':'mentioned','text':ref['note'],'excerpt':{'original':original,'translations':{}}})
   else:chapter['unlocatedPlaces'].append({'id':ref['id'],'name':ref['name'],'text':ref['note'],'quote':ref['quote'],'url':ref['url'],'language':'en','attribution':src,'category':ref['category'],'highlightTerms':[ref['term']],'sourceParagraph':ref['paragraph']+1,'criticalSource':DY if i<5 else 'https://faulkner.iath.virginia.edu/shanti/content/appendix-compson','precision':'No reliable terrestrial coordinates'})
  data['chapters'].append(chapter)
 action_ids={p for c in data['chapters'] for p in c['places']}
 mention_ids={r['placeId'] for c in data['chapters'] for r in c['citations']}
 all_places=data['places']
 data['places']={k:v for k,v in all_places.items() if k in action_ids}
 data['citedPlaces']={k:v for k,v in all_places.items() if k in mention_ids}
 (ROOT/'docs/data'/f'{ID}.js').write_text('window.atlasData='+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
 (ROOT/'docs/data'/f'{ID}-i18n.js').write_text('window.atlasTranslations={"en":{},"it":{},"fr":{},"es":{}};\n',encoding='utf8')
 audit={'book':ID,'sourceEdition':'1931 third printing, original 1929; separately attributed 1946 appendix','fullTextReviewed':True,'sections':[{'id':i,'title':titles[i-1],'url':urls[i-1],'paragraphCount':len(texts[i-1]),'sha256':hashlib.sha256((R/f'{i}.json').read_bytes()).hexdigest(),'reviewedRange':[0,len(texts[i-1])-1],'references':len([x for x in refs if x['section']==i]),'result':'Complete sequential reading; action, memories, reported journeys, mentions and unlocated settings recorded.'} for i in range(1,6)],'references':refs,'mappedPlaces':len(all_places),'mappedReferences':sum(len(c['places'])+len(c['citations']) for c in data['chapters']),'unlocatedReferences':sum(len(c['unlocatedPlaces']) for c in data['chapters']),'appendixQuotedWords':sum(len(x['quote'].split()) for x in refs if x['section']==5),'pending':[]}
 (R/'analysis.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print({k:v for k,v in audit.items() if k not in ['references','sections']})
if __name__=='__main__':build()
