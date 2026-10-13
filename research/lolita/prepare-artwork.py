from pathlib import Path
from PIL import Image
import hashlib,json
R=Path(__file__).resolve().parent;ROOT=R.parents[1];W=ROOT/'work/lolita'
original=W/'prinet-kreutzer-original.jpg'
out=ROOT/'docs/images/lolita-prinet-kreutzer.jpg'
with Image.open(original)as im:
 im=im.convert('RGB');im.thumbnail((1280,1280));im.save(out,quality=90,optimize=True)
 width,height=im.size
record={'artist':'René-Xavier Prinet','title':'La Sonate à Kreutzer','year':'1901',
 'url':'https://commons.wikimedia.org/wiki/File:Prinet_-_Kreutzer_Sonata.jpg',
 'downloadUrl':'https://upload.wikimedia.org/wikipedia/commons/8/86/Prinet_-_Kreutzer_Sonata.jpg',
 'rights':'Public domain · faithful reproduction · PD-Art', 'rightsUrl':'https://commons.wikimedia.org/wiki/Commons:Reuse_of_PD-Art_photographs',
 'catalogueReference':'https://salons.musee-orsay.fr/Detail/objects/423547',
 'connection':'Citazione esplicita in Lolita, I.10: la riproduzione è sopra il letto nella camera assegnata a Humbert nella casa Haze. Riscontro controllato visivamente a pagina 25 del lettore, numero 24 stampato. Il testo non specifica quale versione del dipinto; l’immagine scelta è la versione del 1901, identificata nella scheda Commons e nel catalogo del Salon conservato dal Musée d’Orsay.',
 'literaryReference':'https://online.fliphtml5.com/unwsfj/Lolita---Vladimir-Nabokov/#p=25',
 'watermark':{'symbol':'Heart-shaped sunglasses','requestedByUser':True,'literaryBasis':'Dolores appare con occhiali scuri in I.10, lettore p.26; la forma a cuore è la scelta grafica esplicita dell’utente, non una forma attribuita al testo originale.'},
 'localFile':str(out.relative_to(ROOT)).replace('\\','/'),'width':width,'height':height,
 'originalSha256':hashlib.sha256(original.read_bytes()).hexdigest(),
 'localSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'checked':'2026-10-13',
 'catalogueCreditFields':['artist','title','url','year']}
(R/'artwork.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
credits=ROOT/'docs/images/CREDITS.md'
heading='## Lolita — René-Xavier Prinet'
block='\n\n'+heading+'\n\n'+ '\n'.join([
 '- **La Sonate à Kreutzer**, René-Xavier Prinet, **1901**, oil on canvas; private collection according to the image record.',
 '- Image record: '+record['url'], '- Image download: '+record['downloadUrl'],
 '- Historical exhibition record, Musée d’Orsay Salon database: '+record['catalogueReference'],
 '- Reuse: faithful reproduction of a public-domain painting. Artist died in 1946; Commons records PD-Art/PDM status for the image. '+record['rightsUrl'],
 f'- Local asset: `lolita-prinet-kreutzer.jpg`, {width} × {height}; no crop or substantive alteration.',
 '- Connection: '+record['connection'],
 '- Checked 13 October 2026. In the catalogue show only artist, linked title and year; keep all other documentation here and in the database.'])+'\n'
text=credits.read_text(encoding='utf-8')
# Remove only this task's superseded proposed credit section.
old='## Lolita — George Inness'
if old in text:
 start=text.index(old);end=text.find('\n## ',start+len(old))
 text=text[:start]+(text[end:]if end>=0 else '')
if heading not in text:text+=block
credits.write_text(text,encoding='utf-8')
print(json.dumps({'image':str(out),'width':width,'height':height},ensure_ascii=False))
