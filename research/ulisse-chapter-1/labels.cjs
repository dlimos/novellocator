const fs=require('fs'),crypto=require('crypto'),q=s=>"'"+s.replaceAll("'","''")+"'";
const labels={
'Dublin Bay':{it:'Baia di Dublino',fr:'Baie de Dublin',es:'Bahía de Dublín'},
'Kingstown harbour mouth':{it:'Imboccatura del porto di Kingstown',fr:'Entrée du port de Kingstown',es:'Bocana del puerto de Kingstown'},
'Elsinore · Kronborg model':{it:'Elsinore · modello: Kronborg',fr:'Elseneur · modèle : Kronborg',es:'Elsinor · modelo: Kronborg'},
'Dottyville · Richmond District Asylum':{it:'Dottyville · manicomio di Richmond',fr:'Dottyville · asile de Richmond',es:'Dottyville · asilo de Richmond'},
'Bullock Harbour':{it:'Porto di Bullock',fr:'Port de Bullock',es:'Puerto de Bullock'},
'National Library of Ireland':{it:'Biblioteca nazionale d’Irlanda',fr:'Bibliothèque nationale d’Irlande',es:'Biblioteca Nacional de Irlanda'}
};
let sql='begin;\n';for(const [source,translations]of Object.entries(labels))for(const [language,text]of Object.entries(translations))sql+=`insert into public.content_translations(book_id,language,source_hash,source_text,translated_text) values ('ulisse',${q(language)},${q(crypto.createHash('sha256').update(source).digest('hex'))},${q(source)},${q(text)}) on conflict do nothing;\n`;
sql+='commit;\nselect count(*) from public.content_translations where book_id=\'ulisse\' and source_text in ('+Object.keys(labels).map(q).join(',')+');\n';fs.writeFileSync(__dirname+'/labels.sql',sql);
