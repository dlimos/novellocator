"""Persist the inspected representative positions and rejected homonyms."""
import json
from pathlib import Path
R=Path(__file__).resolve().parent;W=R.parents[1]/'work/lolita'
data=json.loads((W/'coordinate-candidates.json').read_text(encoding='utf-8'))
defer={'Danube':'Il risultato è un punto alla foce del fiume con corrispondenza incompleta; serve una scelta motivata per il corso fluviale.',
 'Scandinavia':'Il primo risultato è un’attività in California; anche gli altri candidati sono omonimi estranei alla regione europea.',
 'Niagara':'La ricerca restituisce la città, mentre il passo è una similitudine delle cascate: non confondere le due entità.',
 'Vaucluse':'Il riferimento letterario ai paesaggi di Petrarca non risolve fra dipartimento e area di Fontaine-de-Vaucluse.',
 'Sun Valley':'Il testo indica una cittadina non nominata nella valle; il punto del comune Sun Valley non localizza quella scena.',
 'Cedar City':'La notizia sulla nuova residenza di Ann non specifica lo stato. Il candidato Cedar City, Utah, non risolve da solo l’identificazione narrativa.'}
choose={'Crater Lake':1,'Telluride':1,'Corfu':1}
notes={'Crater Lake':'Scartato il primo omonimo nell’Oregon orientale; scelto il lago della caldera del Mount Mazama, confrontato con USGS/NPS. Riferimento geografico, non posizione dei personaggi.',
 'Telluride':'Scartato il primo POI; scelto il comune in Colorado, citato nella postfazione come luogo della stesura, non tappa di Humbert.',
 'Corfu':'Posizione rappresentativa dell’isola, non della sola città o di un ospedale. Il testo riferisce la morte di Annabel senza narrare una scena.',
 'Madeleine':'Il punto rappresenta i dintorni della chiesa nominata; la scena del cammino non è ambientata nel suo interno.',
 'Quebec':'Il punto rappresenta la provincia, non un sanatorio identificato; il testo non ne fornisce un recapito.',
 'District of Columbia':'Posizione rappresentativa del distretto per l’affiliazione professionale del legale, non sede del carcere.'}
out={}
for name,record in data.items():
 if name in defer:
  out[name]={'status':'unlocated-pending-identification','reason':defer[name],'source':record['url']};continue
 c=record.get('candidates',[])
 if not c:
  out[name]={'status':'unlocated-no-match','reason':record.get('error','No match'),'source':record['url']};continue
 index=choose.get(name,0);p=c[index]
 assert p['score']==100,(name,p['score'])
 xy=p['location'];assert -90<=xy['y']<=90 and -180<=xy['x']<=180
 out[name]={'status':'reviewed-representative-position','coords':[xy['y'],xy['x']],
  'matchedName':p['address'],'candidateIndex':index,'entityType':p['attributes']['Addr_type'],
  'source':record['url'],'retrieved':record['retrieved'],
  'method':notes.get(name,'Posizione rappresentativa del luogo reale nominato, non coordinata della scena o di un interno.'),
  'narrativeIdentificationVerified':False}
 if name=='Crater Lake':out[name]['additionalSource']='https://pubs.usgs.gov/of/1990/0651/report.pdf'
(R/'coordinates.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'reviewedPositions':sum(v['status']=='reviewed-representative-position'for v in out.values()),'deferred':sum(v['status']!='reviewed-representative-position'for v in out.values())}))
