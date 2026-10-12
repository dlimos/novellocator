import json,re,pathlib,sys
R=pathlib.Path(__file__).resolve().parent
S=json.loads((R/'sections.json').read_text(encoding='utf8'))
# Includes inflected names, adjectival geographic references and historical variants.
patterns={
'moscow':r'Москв\w*|москв\w*','petersburg':r'Петербург\w*|петербург\w*',
'russia':r'Росс\w*','europe':r'Европ\w*','england':r'Англи[яиюе]\w*',
'germany':r'Германи\w*','france':r'Франци\w*','italy':r'Итали\w*',
'america':r'Америк\w*','switzerland':r'Швейцари\w*','prussia':r'Прусси\w*',
'poland':r'Польш\w*','china':r'Кита[йяею]\w*','india':r'Инди\w*','spain':r'Испани\w*',
'turkey':r'Турци\w*','serbia':r'Серби\w*|Сербск\w*','montenegro':r'Черногор\w*',
'herzegovina':r'Герцеговин\w*','central-asia':r'Средней Азии',
'darmstadt':r'Дармштадт\w*','wiesbaden':r'Висбаден\w*','tver':r'\bТвер[ьи]\b',
'nice':r'Ницц\w*','naples':r'Неапол\w*','sorrento':r'Сорренто',
'paris':r'Париж\w*','rome':r'\bРим[аеу]?\b','karlsbad':r'Карлсбад\w*',
'baden':r'\bБаден\w*','kissingen':r'Киссинген\w*','soden':r'Соден\w*',
'frankfurt':r'Франкфурт\w*','menton':r'Ментон\w*','mulhouse':r'Мюлуз\w*',
'kiev':r'Киев\w*','kharkov':r'Харьков\w*','tashkent':r'Ташкент\w*',
'helsinki':r'Гельсингфорс\w*','khiva':r'Хив[аеу]\b','crimea':r'Крым\w*',
'kursk':r'Курск\w*','volga':r'Волг\w*','rhine':r'Рейн\w*',
'babylon':r'Вавилон\w*','flensburg':r'Фленсбург\w*',
'peterhof':r'Петергоф\w*','tsarskoe':r'Царско[мег]+\s+Сел\w*',
'krasnoe':r'Красносельск\w*|Красно[ме]+ Сел\w*',
'moscow-zoo':r'Зоологическ\w*(?:\s+Сад\w*)?',
'hermitage-restaurant':r'Эрмитаж\w*','english-club':r'Английск\w* [Кк]луб\w*',
'summer-garden':r'Летне[мг]+ [Сс]ад\w*','nevsky':r'Невск\w*',
'bolshaya-morskaya':r'\bМорской\b','voz-dvizhenka':r'Воздвиженк\w*',
'sivtsev':r'Сивцев Вражек','nikitskaya':r'Никитскую',
'znamenka':r'Знаменк\w*','okhotny':r'Охотн\w* [Рр]яд\w*',
'kislovka':r'Кисловк\w*','arbat':r'Арбатск\w*|\bАрбат\w*',
'obiralovka':r'Обираловк\w*','nizhny-station':r'Нижегородск\w*',
'kursk-station':r'Курск\w* [Вв]окзал\w*','troitsa':r'Троице',
'mytishchi':r'Мытищ\w*','karazin':r'Каразинск\w*',
'pokrovskoe':r'Покровск\w*','ergushovo':r'Ергуш\w*',
'vozdvizhenskoe':r'Воздвиженск\w*','kashin':r'Кашин\w*',
'kolpenskoye':r'Колпенск\w*','mashkin':r'Машкин\w*(?:\s+Верх\w*)?',
'kalinovy':r'Калинов\w*','sur-forest':r'Суровск\w*',
'yar':r'\bЯр\w?\b','gurin':r'Гурин\w*','dussot':r'Дюссо',
'buff-theatre':r'Буфф\w*','page-corps':r'Пажеск\w* [Кк]орпус\w*',
'moscow-university':r'\b[Уу]ниверситет\w*','foundling':r'Воспитательн\w* [Дд]ом\w*',
'proud':r'Прудном','khapilovo':r'Хапилов\w*','don':r'Донскую',
'birch-dale':r'Березовым Долом','chefir':r'Чефировк\w*','sura':r'\bСуры\b',
'slavyansky':r'Славянск\w* [Бб]азар\w*',
'venice':r'Венеци\w*','byzantium':r'Византи\w*',
'ostend':r'остендск\w*','samara':r'самарск\w*',
'tsaritsyno':r'Царицынск\w*','gvozdevo':r'Гвоздев\w*',
'gazetny':r'Газетно\w* переул\w*','bolshoi':r'Большо[йм]+ [Тт]еатр\w*',
'penza':r'Пензенск\w*','kazan':r'Казанск\w*',
'rambouillet':r'Рамбулье','schuetzburg':r'Шюцбург\w*',
}
hits=[]
for s in S:
    h={}
    for key,pattern in patterns.items():
        indexes=[i for i,p in enumerate(s['paragraphs']) if re.search(pattern,p)]
        if indexes:h[key]=indexes
    hits.append({'id':s['id'],'part':s['part'],'chapter':s['chapter'],'hits':h})
(R/'hits.json').write_text(json.dumps(hits,ensure_ascii=False,indent=2),encoding='utf8')
part=int(sys.argv[1]) if len(sys.argv)>1 else 1
for s,h in zip(S,hits):
    if s['part']!=part:continue
    print(f"\n{s['id']} {part}.{s['chapter']} START: {s['text'][:280]}")
    for key,idx in h['hits'].items():
        p=s['paragraphs'][idx[0]];m=re.search(patterns[key],p)
        print(f" {key} [{','.join(map(str,idx))}]: "+p[max(0,m.start()-95):m.end()+210])
