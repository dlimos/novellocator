import pathlib,json,urllib.request,urllib.parse,concurrent.futures
R=pathlib.Path(__file__).resolve().parent
queries={
'moscow':'Moscow Russia','petersburg':'Saint Petersburg Russia','russia':'Russia','europe':'Europe',
'england':'England United Kingdom','germany':'Germany','france':'France','italy':'Italy',
'switzerland':'Switzerland','poland':'Poland','china':'China','india':'India','spain':'Spain',
'turkey':'Turkey','serbia':'Serbia','montenegro':'Montenegro','herzegovina':'Herzegovina',
'wiesbaden':'Wiesbaden Germany','tver':'Tver Russia','nice':'Nice France','naples':'Naples Italy',
'sorrento':'Sorrento Italy','paris':'Paris France','rome':'Rome Italy','karlsbad':'Karlovy Vary Czechia',
'baden':'Baden Baden Germany','kissingen':'Bad Kissingen Germany','soden':'Bad Soden am Taunus Germany',
'frankfurt':'Frankfurt am Main Germany','menton':'Menton France','mulhouse':'Mulhouse France',
'kiev':'Kyiv Ukraine','kharkov':'Kharkiv Ukraine','tashkent':'Tashkent Uzbekistan','helsinki':'Helsinki Finland',
'khiva':'Khiva Uzbekistan','crimea':'Crimea','kursk':'Kursk Russia','volga':'Volga River Russia',
'rhine':'Rhine Germany','babylon':'Babylon Iraq','flensburg':'Flensburg Germany','ostend':'Ostend Belgium',
'peterhof':'Peterhof Russia','tsarskoe':'Pushkin Saint Petersburg Russia','krasnoe':'Krasnoye Selo Saint Petersburg Russia',
'moscow-zoo':'Moscow Zoo Russia','nevsky':'Nevsky Prospekt Saint Petersburg Russia',
'bolshaya-morskaya':'Bolshaya Morskaya Street Saint Petersburg Russia',
'voz-dvizhenka':'Vozdvizhenka Street Moscow Russia','sivtsev':'Sivtsev Vrazhek Moscow Russia',
'nikitskaya':'Bolshaya Nikitskaya Street Moscow','znamenka':'Znamenka Street Moscow Russia',
'okhotny':'Okhotny Ryad Moscow Russia','kislovka':'Bolshoy Kislovsky Moscow Russia',
'arbat':'Arbat Street Moscow Russia','obiralovka':'Zheleznodorozhnaya railway station Balashikha Russia',
'troitsa':'Trinity Sergius Lavra Russia','mytishchi':'Mytishchi Russia',
'venice':'Venice Italy','samara':'Samara Russia','tsaritsyno':'Tsaritsyno station Moscow Russia',
'gazetny':'Gazetny Pereulok Moscow Russia','bolshoi':'Bolshoi Theatre Moscow Russia',
'penza':'Penza Russia','kazan':'Kazan Russia','bologoe':'Bologoye railway station Russia',
'usa':'United States','vienna':'Vienna Austria','baltic':'Baltic Sea','corso':'Via del Corso Rome Italy',
}
def fetch(item):
    key,q=item
    url='https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?'+urllib.parse.urlencode({'SingleLine':q,'f':'json','outFields':'Match_addr,Addr_type','maxLocations':3})
    try:
        with urllib.request.urlopen(url,timeout=45) as f:data=json.load(f)
        return key,{'query':q,'url':url,'candidates':data.get('candidates',[])}
    except Exception as e:return key,{'query':q,'url':url,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    results=dict(pool.map(fetch,queries.items()))
(R/'coordinates.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
for k,v in results.items():
    c=v.get('candidates',[])
    print(k,[(x['address'],x['score'],x['location']) for x in c[:1]] or v.get('error','NONE'))
